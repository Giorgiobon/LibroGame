const net = require('net');
const adventure = require('./adventure.js');

const PORT = 3000;
const server = net.createServer();

server.on('connection', (socket) => {
  console.log('Client connected');

  adventure.start(socket);

  socket.on('end', () => {
    console.log('Client disconnected');
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});