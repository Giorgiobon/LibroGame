const net = require('net');

const PORT = 3000;
const HOST = 'localhost';

const client = new net.Socket();

client.connect(PORT, HOST, () => {
    console.log('Connected to server');
    console.log('Type EXIT to quit');

    process.stdin.on('data', (data) => {
        const input = data.toString().trim();
        client.write(input);
        if (input === 'EXIT') {
            console.log('Exiting...');
            client.end();
        }
    });
});

client.on('data', (data) => {
    console.log(data.toString().trim());
});

client.on('close', () => {
    console.log('Connection closed');
});

client.on('error', (err) => {
    console.error('Connection error:', err);
});