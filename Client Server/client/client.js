const net = require("net");
const readline = require("node:readline/promises");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const socket = net.createConnection(
  { host: "127.0.0.1", port: 3000 },
  async () => {
    console.log("Connesso al server");
    const message = await rl.question("Inserisci la tua scelta:");
    socket.write(message);
  }
);

socket.on("end", () => {
  console.log("Connessione terminata");
});