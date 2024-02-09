const MAX_LIVES = 5;

let currentQuestionIndex = 0;
let clientName = '';
let lives = MAX_LIVES;
let socketUsing = '';

const questions = [
  {
    question: "Come ti chiami?\n"
  },
  {
    question: "Ti trovi davanti ad un muro. Cosa fai?\n",
    options: ["A. Lo abbatti con un pugno", "B. Lo scavalchi", "C. Cerchi un ingresso"],
    responses: {
      A: answer1('A'),
      B: answer1('B'),
      C: answer1('C')
    }
  },
  {
    question: "Trovi una mappa con un percorso segnato. Cosa fai?\n",
    options: ["A. Seguo il percorso segnato", "B. Cerco un percorso alternativo", "C. Chiedo indicazioni"],
    responses: {
      A: answer2('A'),
      B: answer2('B'),
      C: answer2('C')
    }
  },
  {
    question: "Incontri un compagno di viaggio. Cosa fai?\n",
    options: ["A. Parlo con lui/lei per conoscerci meglio", "B. Lo saluto e proseguo di fretta perchè odio parlare con le persone", "C. Lo ignoro e proseguo"],
    responses: {
      A: answer3('A'),
      B: answer3('B'),
      C: answer3('C')
    }
  },
  {
    question: "Trovi un oggetto misterioso per terra. Cosa fai?\n",
    options: ["A. Lo raccolgo e lo esamino attentamente", "B. Lo lascio dov'è e proseguo", "C. Cerco chi potrebbe esserselo perso"],
    responses: {
      A: answer4('A'),
      B: answer4('B'),
      C: answer4('C')
    }
  },
  {
    question: "Ti imbatti in un bivio. Cosa fai?\n",
    options: ["A. Seguo a sinistra", "B. Seguo a destra", "C. Tiro a sorte"],
    responses: {
      A: answer5('A'),
      B: answer5('B'),
      C: answer5('C')
    }
  }
];


function start(socket) {
  socketUsing = socket;
  askQuestion(socketUsing);

  socketUsing.on('data', (data) => {
    const answer = data.toString().trim();
    checkAnswer(socketUsing, answer);
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
    question = questionObj.question;
    socket.write(`${question}`);
  }
}


function checkAnswer(socket, answer) {
  const questionObj = questions[currentQuestionIndex];

  if(currentQuestionIndex === 0){
    clientName = answer;
    socket.write(`Benvenuto ${clientName}!\n`);
    socket.write("Ad ogni domada scrivi l'opzione che hai scelto (scrivi A, B, C, ecc....)\n\n");
    console.log(`${clientName} si è connesso.`);
  }else{
    const responses = questionObj.responses;
    socket.write(`${responses[answer]}\n`);
    if (responses[answer].includes('(damaged)')) {
      lives--;
      socket.write(`HAI SUBITO DANNO! Rimangono ${lives} vite.\n`);
      if (lives === 0) {
        died(socket);
        return;
      }
      }
  }
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length && lives > 0) {
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

function answer1(answer) {
  switch (answer) {
    case 'A':
      return "Un enorme forza ti attraversa il corpo e la mano destra si infiamma. Appena il muro entra in contatto con il pugno, si incenerisce, aprendo un passaggio.";
    case 'B':
      return "Riesci a scavalcare, ma dall'altro lato trovi un dirupo e ci cadi debtro (damaged)";
    case 'C':
      return "Cerchi un ingresso, e trovi un casello del pedaggio. Paghi il pedaggio e passi.";
  }
}

function answer2(answer) {
  switch (answer) {
    case 'A':
      return "Seguendo il percorso segnato, trovi la via giusta.";
    case 'B':
      return "Non seguendo la mappa e cercando un percorso alternativo, ti ritrovi da tutt'altra parte rispetto a dove volevi andare. Spendi l'intera giornta per tornare indietro.";
    case 'C':
      return "Chiedendo indicazioni, finisci in un vicolo cieco. Una banda di ladri ti accerchia e ti deruba di tutto (damaged).";
  }
}

function answer3(answer) {
  switch (answer) {
    case 'A':
      return "Parlando con il compagno di viaggio, scopri che è una brava persona ed interessante. passate una piacevole serata in locanda a bere";
    case 'B':
      return "Decidendo di continuare il viaggio da solo, ti penti di non avere compagnia.";
    case 'C':
      return "Ignorandolo completamnete, si offende e ti pugnala alle spalle, picchiandoti molto, spuntandoti addosso e gridandoti frasi ingiuriose (damaged)";
  }
}

function answer4(answer) {
  switch (answer) {
    case 'A':
      return "Raccogliendo e esaminando l'oggetto misterioso, attivi una trappola (damaged).";
    case 'B':
      return "Lasciando l'oggetto dov'è, continui il viaggio senza intoppi.";
    case 'C':
      return "Cercando chi potrebbe essersi perso l'oggetto, incontri un gruppo di banditi che vogliono il tuo tesoro (damaged).";
  }
}

function answer5(answer) {
  switch (answer) {
    case 'A':
      return "Seguendo a sinistra, arrivi ad un sentiero oscuro e pericoloso dove un lupo ti sbrana il braccio (damaged).";
    case 'B':
      return "Seguendo a destra, ti ritrovi in una zona deserta e isolata dove uno scorpione ti punge la mano. devi amputarla per impedire al veleno di espandersi (damaged).";
    case 'C':
      return "Tirando a sorte, finisci per fare la scelta peggiore possibile. Un orda di zombi ti attacca e mangia una gamba (damaged).";
  }
}

module.exports = {
  start: start
};  