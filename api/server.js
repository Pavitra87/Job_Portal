const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5001;
const server = http.createServer(app);

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(bodyParser.json());

const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Uploads folder created");
}
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/jobListing", require("./routes/jobListingRoutes"));
app.use("/api/jobApplications", require("./routes/jobApplicationRoutes"));

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
