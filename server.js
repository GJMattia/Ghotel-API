const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const userRouter = require('./routes/users');
const http = require('http');
const { Server } = require('socket.io');
const friendListRouter = require('./routes/friendlist');

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





const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    },
});

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);


    socket.on('join_room', (data) => {
        socket.join(data)
    });


    socket.on('send_message', (data) => {
        // Emit the message to all users in the room, including the sender
        io.to(data.room).emit('receive_message', data);
    });
});


server.listen(PORT, () => {
    console.log('listening on port ' + PORT);
});
module.exports = app;