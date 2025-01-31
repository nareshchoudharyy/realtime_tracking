const express = require('express');
const socketio = require("socket.io");
const path = require('path')
const http = require('http');
const app = express();
const server = http.createServer(app);
// socket.io server 
const io = socketio(server);
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
io.on("connection", function (socket) {
    // accepting the loaction on backend 
    socket.on('send-location', function(data){
        //emiting the location of user on map
        io.emit('receive-location', {io: socket.id, ...data})
    });
    socket.on("disconnect",()=>{
        io.emit("User-disconnected", socket.id)
    })
})
app.get("/", function (req, res) {
    res.render("index");
})
server.listen(3000);