const express = require('express');
const app = express();
const http = require('http');
const socketio = require('socket.io');
const path = require('path');

// Create HTTP server and Socket.IO instance
const server = http.createServer(app);
const io = socketio(server);

// Set up view engine and static file serving
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Socket.IO connection event
io.on("connection", (socket) => {
    socket.on("send-location", function(data) {
        io.emit("receive-location", { id: socket.id, ...data });
    });
    console.log("A user connected");

    socket.on('disconnect', () => {
        io.emit("user-disconnected", socket.id);
        console.log('A user disconnected', socket.id);
    });
});

// Route for rendering index.ejs
app.get("/", (req, resp) => {
    resp.render("index");
});

// Start server
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
