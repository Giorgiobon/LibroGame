const net = require('net');
const externalModule = require('./adventure.js');

const PORT = 3000;
const server = net.createServer();

server.on('connection', (socket) => {
  console.log('Client connected');
  externalModule.adventureGame(socket);

  socket.on('data', (data) => {
    const name = data.toString().trim();
    socket.write(`Welcome ${name}!\n`);
    /*socket.write('You want start the adventure?\n(Type YES or EXIT)\n');
    const message = data.toString().trim();
    if (message === 'EXIT') {
      console.log('Client requested to exit.');
      externalModule.Died(socket);
    } else {
      externalModule.writeToClient(socket, message);
    }*/ 
  });

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
