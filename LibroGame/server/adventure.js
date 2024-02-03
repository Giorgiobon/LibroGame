const questions = [
  {
    question: "Come ti chiami?\n"
  },
  {
    question: "Ti trovi davanti ad un muro. Cosa fai?\n",
    options: ["A. Lo abbatti con un pugno", "B. Lo scavalchi", "C. Cerchi un ingresso"],
    responses: {
      A: "Un enorme forza ti attraversa il corpo e la mano destra si infiamma. Appena il muro entra in contatto con il pugno, si incenerisce, aprendo un passaggio.",
      B: "Esegui un salvo sovrumanente e scavalchi il muro.",
      C: "Cerchi un ingresso, e trovi un casello del pedaggio. Paghi il pedaggio e passi."
    }
  }
];

const MAX_LIVES = 5;

let currentQuestionIndex = 0;
let clientName = '';
let lives = MAX_LIVES;

function start(socket) {
  askQuestion(socket);

  socket.on('data', (data) => {
    const answer = data.toString().trim();
    checkAnswer(socket, answer);
  }); 
}

function askQuestion(socket) {
  const questionObj = questions[currentQuestionIndex];
  let question;
  if(currentQuestionIndex > 0){
    question = questionObj.question;
    const options = questionObj.options.join(", ");
    socket.write(`${question} (${options})\n`);
  }else{
    question = "Come ti chiami?";
    socket.write(`Benvenuto nell'avventura! Hai ${lives} vite.\n`);
    socket.write(`${question}\n`);
  }
}


function checkAnswer(socket, answer) {
  const questionObj = questions[currentQuestionIndex];

  if(currentQuestionIndex === 0){
    clientName = answer;
    socket.write(`Benvenuto ${clientName}!\n`);
    socket.write("Ad ogni domada scrivi l'opzione che hai scelto (scrivi A, B, C, ecc....)\n");
    console.log(`${clientName} si è connesso.`);
  }else{
    const responses = questionObj.responses;
    if (responses.hasOwnProperty(answer)) {
      socket.write(`${responses[answer]}\n`);
      console.log(`${clientName} ha deciso di "${answer}".`);
    } else {
      lives--;
      if (lives === 0) {
        died(socket);
        return;
      }
      socket.write(`HAI SUBITO DANNO! Rimangono ${lives} vite.\n`);
      console.log(`${clientName} ha risposto erroneamente alla domanda ${currentQuestionIndex + 1}. Rimangono ${lives} vite.`);
    }
  }
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    askQuestion(socket);
  } else {
    socket.end("Complimenti, hai completato l'avventura!\n");
    console.log("Quiz completato. Client disconnesso.");
  }
}

function died(socket) {
  socket.write("Mi dispiace, hai esaurito tutte le vite. Sei morto!\n");
  console.log(`${clientName} è morto. La sessione è terminata.`);
  socket.end();
}

function hello() {
  return "Ciao\n";
}

module.exports = {
  start: start
};  