const questions = [
    {
      question: "Qual è la capitale dell'Italia?",
      options: ["Roma", "Milano", "Napoli", "Firenze"],
      responses: {
        "Roma": "Ciao!",
        "Milano": "Buongiorno!",
        "Napoli": "Buonasera!",
        "Firenze": "Buonanotte!"
      }
    },
    {
      question: "Quale è il pianeta più vicino al Sole?",
      options: ["Terra", "Venere", "Marte", "Giove"],
      responses: {
        "Terra": "Sì, proprio così!",
        "Venere": "Esatto!",
        "Marte": "Bravissimo!",
        "Giove": "Peccato, risposta errata."
      }
    },
    {
      question: "Chi ha dipinto 'La Gioconda'?",
      options: ["Leonardo da Vinci", "Michelangelo", "Raffaello", "Donatello"],
      responses: {
        "Leonardo da Vinci": "Corretto!",
        "Michelangelo": "No, risposta sbagliata!",
        "Raffaello": "Ops, non è esatto!",
        "Donatello": "Sbagliato!"
      }
    },
    {
      question: "Quanto fa 2 + 2?",
      options: ["3", "4", "5", "6"],
      responses: {
        "3": "Nooo, errato!",
        "4": "Esatto!",
        "5": "Quasi, ma no!",
        "6": "Sbagliato, riprova!"
      }
    },
    {
      question: "Qual è l'animale terrestre più veloce?",
      options: ["Ghepardo", "Leopardo", "Tartaruga", "Giraffa"],
      responses: {
        "Ghepardo": "Giusto!",
        "Leopardo": "Sbagliato, ma buon tentativo!",
        "Tartaruga": "Purtroppo no!",
        "Giraffa": "Corretto, complimenti!"
      }
    }
  ];
  
  const MAX_LIVES = 5;
  
  let currentQuestionIndex = 0;
  let clientName = '';
  let lives = MAX_LIVES;
  
  function init(socket) {
    askQuestion(socket);
    
    socket.on('data', (data) => {
      const answer = data.toString().trim();
      checkAnswer(socket, answer);
    });
  }
  
  function askQuestion(socket) {
    const questionObj = questions[currentQuestionIndex];
    const question = questionObj.question;
    const options = questionObj.options.join(", ");
    
    if (currentQuestionIndex === 0) {
      socket.write(`Benvenuto al quiz! Hai ${lives} vite.\n`);
    }
    
    socket.write(`${question} (${options})\n`);
  }
  
  function checkAnswer(socket, answer) {
    const questionObj = questions[currentQuestionIndex];
    const responses = questionObj.responses;
    
    if (responses.hasOwnProperty(answer)) {
      const response = responses[answer];
      socket.write(`${response}\n`);
      console.log(`${clientName} ha risposto alla domanda ${currentQuestionIndex + 1} con "${answer}".`);
    } else {
      lives--;
      if (lives === 0) {
        died(socket);
        return;
      }
      socket.write(`Sbagliato! Rimangono ${lives} vite.\n`);
      console.log(`${clientName} ha risposto erroneamente alla domanda ${currentQuestionIndex + 1}. Rimangono ${lives} vite.`);
    }
  
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      askQuestion(socket);
    } else {
      socket.end("Complimenti, hai completato il quiz!\n");
      console.log("Quiz completato. Client disconnesso.");
    }
  }
  
  function died(socket) {
    socket.write("Mi dispiace, hai esaurito tutte le vite. Sei morto!\n");
    console.log(`${clientName} è morto. La sessione è terminata.`);
    socket.end();
  }
  
  module.exports = {
    init: init
  };  