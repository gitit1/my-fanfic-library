const server = require('http').createServer();

const io = require('socket.io')(server,{
    serveClient: true,
    // below are engine.IO options
    pingInterval: 30000,
    pingTimeout: 80000,
    cookie: false
  });

const func = require('../connection');

server.listen(5005);

io.on('connection', (socket) => {
      socket.on('getFandomFanfics', (fandomData,choice,method) => {
        console.log('[socket.js] getFandomFanfics()');
        
        func.manageDownloader(socket,fandomData,choice,method)
        
      });
});