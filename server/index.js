const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const socketConnection = require("./socket");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

mongoose.connect("mongodb://localhost/whatsapp-clone", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

io.on("connection", socketConnection);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
