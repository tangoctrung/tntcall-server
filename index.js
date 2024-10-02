const express = require("express");
const cors = require('cors');
const dotenv = require("dotenv");
const job = require("./cron/cron");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());
dotenv.config();
app.use(express.json());

// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: 'https://tntcall.vercel.app', // Chấp nhận tất cả các nguồn gốc (domain)
//   },
// });

// Socket
const httpServer = require('http').createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
  },
});

job.start();

app.get("", (req, res) => {
  res.json({
    "message": "Server is running..."
  })
})

// one call
// io.on('connection', (socket) => {
//   console.log('New client connected');

//   socket.on('offer', (data) => {
//     console.log('Offer received:', data);
//     socket.broadcast.emit('offer', data);
//   });

//   socket.on('answer', (data) => {
//     console.log('Answer received:', data);
//     socket.broadcast.emit('answer', data);
//   });

//   socket.on('candidate', (data) => {
//     console.log('Candidate received:', data);
//     socket.broadcast.emit('candidate', data);
//   });

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
// });

let users = {};

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // Khi người dùng tham gia phòng
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    users[socket.id] = userId;

    socket.broadcast.to(roomId).emit('user-connected', userId);

    // Khi nhận được offer, chuyển nó đến peer khác trong phòng
    socket.on('offer', (offer, receiverId) => {
      socket.to(receiverId).emit('offer', offer, userId);
    });

    // Khi nhận được answer, chuyển nó đến peer đã gửi offer
    socket.on('answer', (answer, senderId) => {
      socket.to(senderId).emit('answer', answer, userId);
    });

    // Khi nhận được ICE candidate, chuyển nó đến peer tương ứng
    socket.on('candidate', (candidate, receiverId) => {
      socket.to(receiverId).emit('candidate', candidate, userId);
    });

    // Khi người dùng rời khỏi phòng
    socket.on('disconnect', () => {
      socket.broadcast.to(roomId).emit('user-disconnected', userId);
      delete users[socket.id];
    });
  });
});

const PORT = process.env.PORT || 8000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});