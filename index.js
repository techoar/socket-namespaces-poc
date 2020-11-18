var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http, {
  transports: ['websocket', 'polling']
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  // socket.on('chat message', (msg) => {
  //   io.emit('chat message', msg);
  // });
  // socket.broadcast.emit('user disconnected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

let nps = {};
const namespaces = ['org1', 'org2', 'org3', 'org4'];
const rooms = ['web', 'android'];

namespaces.forEach((data) => {
  setNamespace(data);
});

function setNamespace(data) {
  nps[data] = io.of(`/${data}`);
  nps[data].on('connection', socket => {
    socket.emit('chating', 'Hola');
    socket.on('joinRoom', (room) => {
      if (rooms.includes(room)) {
        socket.join(room);
        socket.emit('success', 'Joined room');
        io.of(data).to(room).emit('chating', 'Welcom to the room');
      } else {
        socket.emit('err', 'Room doesnt exit');
      }
    });
    socket.on('chating', (msg) => {
      nps[data].emit('chating', msg);
    });
  });
}

setInterval(() => {
  io.of('/org1').to('web').emit('chating', 'ping');
}, 20000)

setInterval(() => {
  io.of('/org2').to('web').emit('chating', 'pong');
}, 20000)

setInterval(() => {
  io.of('/org3').to('web').emit('chating', 'ding');
}, 20000)

setInterval(() => {
  io.of('/org4').to('web').emit('chating', 'dong');
}, 20000)

setInterval(() => {
  io.of('/org1').emit('chating', 'global');
}, 25000)

// setTimeout(() => {
//   console.log(nps);
//   setNamespace('org1');
//   console.log(nps);
// }, 15000);


http.listen(3000, () => {
  console.log('listening on *:3000');
});
