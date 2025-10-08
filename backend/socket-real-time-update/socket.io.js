import { Server } from 'socket.io';
import { createServer } from 'http';
import express from 'express';

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTENDURL,
    credentials: true
  }
});

const onlineUser = [];

io.on("connection", (socket) => {
  const userid = socket.handshake.query.userid;

  if (userid) {
    const existingUserCheck = onlineUser.find((user) => user.userid === userid);

    if (!existingUserCheck) {
      onlineUser.push({ userid, socketId: socket.id });
      console.log("Online Users:", onlineUser);
    } else {
      console.log(`User ${userid} is already online`);
    }
  } else {
    socket.disconnect();
  }

  socket.on("disconnect", () => {
    const index = onlineUser.findIndex((user) => user.userid === userid);

    if (index !== -1) {
      onlineUser.splice(index, 1);
      io.emit("disconnectedUser", onlineUser);
    }
  });
});

export { app, io, onlineUser, server };
