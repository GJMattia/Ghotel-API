const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const userRouter = require('./routes/users');
const http = require('http');
const { Server } = require('socket.io');

const friendListRouter = require('./routes/friendlist');
const accountRouter = require('./routes/account');
const roomRouter = require('./routes/room');

const SERVERDEVPORT = 4741;
const CLIENTDEVPORT = 5173;

mongoose.connect(process.env.DATABASE_URL);

const app = express();
app.use(require('./config/checkToken'));

app.use(cors({ origin: process.env.CLIENT_ORIGIN || `http://localhost:${CLIENTDEVPORT}` }));
const PORT = process.env.PORT || SERVERDEVPORT;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/users', userRouter);

const ensureLoggedIn = require('./config/ensureLoggedIn');

app.use('/friendlist', ensureLoggedIn, friendListRouter);
app.use('/account', ensureLoggedIn, accountRouter);
app.use('/room', ensureLoggedIn, roomRouter);




const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'https://www.ghotel.org',
        // origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    },
});

const messageHistory = {};
const spriteHistory = {};
const chooserHistory = {};


io.on('connection', (socket) => {
    // CHAT
    socket.on('join_chat', (data) => {
        const { room } = data;
        socket.join(room);

        if (messageHistory[room]) {
            socket.emit('message_history', { messages: messageHistory[room], room });
        }
    });

    socket.on('send_message', (data) => {
        const { room, message } = data;

        if (!messageHistory[room]) {
            messageHistory[room] = [];
        }
        messageHistory[room].push(message);

        io.to(room).emit('receive_message', data);
    });


    // Chooser
    socket.on('join_room', ({ username, roomNumber }) => {
        // Check if the roomNumber exists in spriteHistory
        if (!chooserHistory.hasOwnProperty(roomNumber)) {
            chooserHistory[roomNumber] = [];
        }

        if (!socket.rooms.has(roomNumber)) {
            socket.join(roomNumber);
        }

        // Check if the user's sprite data already exists for the room
        const userSpriteIndex = chooserHistory[roomNumber].findIndex(name => name === username);
        if (userSpriteIndex === -1) {

            chooserHistory[roomNumber].push(username);
        }

        // Emit sprite data to all clients in the room
        io.to(roomNumber).emit('user_joined', chooserHistory[roomNumber]);
    });

    socket.on('leave_room', ({ username, roomNumber }) => {
        socket.leave(roomNumber);

        if (chooserHistory[roomNumber]) {
            const userSpriteIndex = chooserHistory[roomNumber].findIndex(name => name === username);

            if (userSpriteIndex !== -1) {
                chooserHistory[roomNumber].splice(userSpriteIndex, 1);

            };
        };
        if (!chooserHistory[roomNumber]?.length) {
            delete chooserHistory[roomNumber];
        }

        io.to(roomNumber).emit('user_left', username);
    });


    //Room chatting
    socket.on('send_message', ({ username, message, roomNumber }) => {
        io.to(roomNumber).emit('receive_message', { username, message });
    });

    socket.on('disconnect', () => {
        // console.log(`User disconnected: ${socket.id}`);
        // Implement any necessary cleanup logic here
    });

    //ROOM DATA TRANSFER 64
    socket.on('send_change', ({ username, roomNumber, roomChange }) => {
        io.to(roomNumber).emit('receive_change', { username, roomChange });
    })

    //Room Change
    socket.on('info_change', (roomInfo) => {
        io.to(roomInfo.chat).emit('info_update', roomInfo);
    });

    //Sending Credits

    socket.on('send_credits', (data) => {
        const roomNumber = data.roomNumber;
        io.to(roomNumber).emit('get_credits', { sender: data.username, person: data.person, credits: data.credits, room: data.roomNumber });
    });


    //Sprites
    socket.on('add_sprite', (data) => {
        const { roomNumber } = data;
        // Check if the roomNumber exists in spriteHistory
        if (!spriteHistory.hasOwnProperty(roomNumber)) {
            spriteHistory[roomNumber] = [];
        }

        if (!socket.rooms.has(roomNumber)) {
            socket.join(roomNumber);
        }

        // Check if the user's sprite data already exists for the room
        const userSpriteIndex = spriteHistory[roomNumber].findIndex(spriteData => spriteData.username === data.username);
        if (userSpriteIndex === -1) {
            // If the user's sprite data doesn't exist, add it to spriteHistory
            spriteHistory[roomNumber].push(data);
        }

        // Emit sprite data to all clients in the room
        io.to(roomNumber).emit('sprite_data', spriteHistory[roomNumber]);
    });

    socket.on('move_sprite', (data) => {
        const roomNumber = data.roomNumber
        io.to(roomNumber).emit('move1_sprite', { username: data.username, tileID: data.tileID });

        if (spriteHistory.hasOwnProperty(data.roomNumber)) {

            const room = spriteHistory[roomNumber];

            const userIndex = room.findIndex(user => user.username === data.username);
            if (userIndex !== -1) {

                room[userIndex].tileID = data.tileID;
            }
        }
    });

    socket.on('height_sprite', (data) => {
        const roomNumber = data.roomNumber
        io.to(roomNumber).emit('move2_sprite', { username: data.username, height: data.height });

        if (spriteHistory.hasOwnProperty(data.roomNumber)) {

            const room = spriteHistory[roomNumber];

            const userIndex = room.findIndex(user => user.username === data.username);
            if (userIndex !== -1) {

                room[userIndex].height = data.height;
            }
        }
    });

    socket.on('rotate_sprite', (data) => {
        const roomNumber = data.roomNumber
        io.to(roomNumber).emit('move3_sprite', { username: data.username, rotation: data.rotation });

        if (spriteHistory.hasOwnProperty(data.roomNumber)) {

            const room = spriteHistory[roomNumber];

            const userIndex = room.findIndex(user => user.username === data.username);
            if (userIndex !== -1) {

                room[userIndex].rotation = data.rotation;
            }
        }
    });

    socket.on('leave_sprite', ({ username, roomNumber }) => {
        socket.leave(roomNumber);

        io.to(roomNumber).emit('sprite_left', { username });

        // Remove the user's sprite data from spriteHistory for the specified room
        if (spriteHistory.hasOwnProperty(roomNumber)) {
            spriteHistory[roomNumber] = spriteHistory[roomNumber].filter(sprite => sprite.username !== username);
        }
    });





});




server.listen(PORT, () => {
    console.log('listening on port ' + PORT);
});
module.exports = app;
