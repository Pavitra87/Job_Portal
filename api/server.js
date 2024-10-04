const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const { initSocket } = require("./controllers/notification/socket");

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5001;
const server = http.createServer(app);
initSocket(server);

app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/jobProvider", require("./routes/jobProviderRoutes"));
app.use("/api/jobSeeker", require("./routes/jobSeekerRoutes"));
app.use("/api/jobCategory", require("./routes/jobCategoryRoutes"));
app.use("/api/jobListings", require("./routes/jobListingRoutes"));
app.use("/api/jobApplications", require("./routes/jobApplicationRoutes"));
app.use("/api/searching", require("./routes/jobSearchRoute"));

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
