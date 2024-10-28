// socket.js
const { Server } = require("socket.io");

let io; // To hold the Socket.IO server instance

const initSocket = (server) => {
  io = new Server(server);

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

// Export the initialized Socket.IO instance and event emitter
const emitJobPosted = (jobListing) => {
  if (io) {
    io.emit("jobPosted", jobListing);
  }
};

const emitJobApplied = (data) => {
  if (io) {
    io.emit("jobApplied", data);
  }
};

module.exports = { initSocket, emitJobPosted, emitJobApplied };
