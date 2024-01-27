function adventureGame(socket) {
    socket.write('Welcome to the game!\n');
    socket.write('Please enter your name: ');
}

function writeToClient(socket, message) {
    socket.write(`Message from external module: ${message}\n`);
}

function Died(socket) {   
    socket.end('Sorry, the Adventure is end!\n');
}

module.exports = {
    writeToClient,
    adventureGame,
    Died
};
