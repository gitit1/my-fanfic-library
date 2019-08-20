const express = require('express');
const http = require('http')

const app = express();
const server = http.createServer(app);
var io = require('socket.io')(server,{
      serveClient: false,

      pingInterval: 200000,
      pingTimeout: 200000,
      cookie: false
});

const func = require('../connection');

server.listen(8080);

io.on('connection', (socket) => {
      socket.on('getFandomFanfics', (fandomData,choice,method) => {
        console.log('[socket.js] getFandomFanfics()');
        
        func.manageDownloader(socket,fandomData,choice,method)
        
      });
});
io.on('error', function(err) {
  console.error("Server error:", err);
});
io.on('clientError', function(err) {
  console.error("Client connection error:", err);
});

server.on('error', function(err) {
  console.error("WebSocket error:", err);
});