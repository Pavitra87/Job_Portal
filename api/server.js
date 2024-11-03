const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

const { Server } = require("socket.io");

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5001;
const server = http.createServer(app);

app.use(cors());
app.use(bodyParser.json());

// let io;
// const initSocket = (server) => {
//   io = new Server(server);

//   io.on("connection", (socket) => {
//     console.log("A user connected:", socket.id);

//     socket.on("disconnect", () => {
//       console.log("User disconnected:", socket.id);
//     });
//   });
// };

app.use(
  "/uploads/profile_picture_url",
  express.static("uploads/profile_picture_url")
);

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/jobListing", require("./routes/jobListingRoutes"));
app.use("/api/jobApplications", require("./routes/jobApplicationRoutes"));

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
