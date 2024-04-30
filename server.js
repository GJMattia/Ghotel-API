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
        origin: 'https://ghotel-client.onrender.com',
        // origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    },
});

const messageHistory = {};

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('join_room', (data) => {
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
});


server.listen(PORT, () => {
    console.log('listening on port ' + PORT);
});
module.exports = app;
