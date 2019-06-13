const io = require('socket.io')();
const test = require('../db/db');

io.listen(5555);

io.sockets.on('connection', (socket) => {
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