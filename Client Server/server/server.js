const adventures = require('./adventure.js');
const net = require('net');
const i = 0;

const server = net.createServer(socket => {
  console.log('Client connected');

  socket.on('data', data => {
    const expression = data.toString().trim();

    if (expression === 'exit') {
      socket.end('Goodbye!');
      console.log('Client disconnected');
    } else {
      console.log(`avventura numero`, i);
      const adventure = adventures.matrix[i](expression);
      socket.write(`Result: ${adventure}\n`);
    }
  });

  socket.on('end', () => {
    console.log('Client disconnected');
  });
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


