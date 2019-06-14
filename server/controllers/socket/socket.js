const server = require('http').createServer();

const io = require('socket.io')(server,{
    serveClient: false,
    // below are engine.IO options
    pingInterval: 30000,
    pingTimeout: 80000,
    cookie: false
  });

const test = require('../db/db');

server.listen(5555);

io.on('connection', (socket) => {
    socket.on('subscribeToTimer', (interval) => {
        console.log('client is subscribing to timer with interval ', interval);
        setInterval(() => {
            socket.emit('timer', new Date());
          }, interval);
      });
      socket.on('getFandomFanfics', (fandomOriginalName) => {
        console.log('getFandomFanfics: ', fandomOriginalName);
        //socket.emit('test', fandom);
        //test.test(fandom)
        test.test(socket,fandomOriginalName)
        
      });
});