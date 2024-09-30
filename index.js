const express = require("express");
const cors = require('cors');
const dotenv = require("dotenv");
const job = require("./cron/cron");

job.start();

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

app.get("", (req, res) => {
  res.json({
    "message": "Server is running..."
  })
})

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('offer', (data) => {
    console.log('Offer received:', data);
    socket.broadcast.emit('offer', data);
  });

  socket.on('answer', (data) => {
    console.log('Answer received:', data);
    socket.broadcast.emit('answer', data);
  });

  socket.on('candidate', (data) => {
    console.log('Candidate received:', data);
    socket.broadcast.emit('candidate', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 8000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});