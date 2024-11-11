// script.js

document.addEventListener('DOMContentLoaded', () => {
  fetch('vocab.txt')
    .then(response => response.text())
    .then(text => {
      const vocabData = parseTSV(text);
      initializeGame(vocabData);
    })
    .catch(error => {
      console.error('Error loading vocab data:', error);
    });
});

function parseTSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split('\t');
  const data = lines.slice(1).map(line => {
    const parts = line.split('\t');
    const entry = {};
    headers.forEach((header, index) => {
      const key = header.replace(/ /g, '').replace(/(\w)(\w*)/g,
          function(g0,g1,g2){return g1.toLowerCase() + g2;});
      entry[key] = parts[index];
    });
    return entry;
  });
  return data;
}

function initializeGame(vocabData) {
  // Same as above
  // ... (use the same initializeGame and startMatchGame functions)
}

function startQuizGame(vocabData) {
  const gameContainer = document.getElementById('game-container');
  gameContainer.innerHTML = ''; // Clear previous content

  // Create a container for the question and options
  const questionContainer = document.createElement('div');
  const optionsContainer = document.createElement('div');
  const resultContainer = document.createElement('div');

  questionContainer.id = 'question-container';
  optionsContainer.id = 'options-container';
  resultContainer.id = 'result-container';

  gameContainer.appendChild(questionContainer);
  gameContainer.appendChild(optionsContainer);
  gameContainer.appendChild(resultContainer);

  let timer; // To control the next question timing

  function loadNewQuestion() {
    clearTimeout(timer); // Clear any previous timers
    resultContainer.innerHTML = ''; // Clear result display

    // Randomly decide whether to show a word or definition
    const showDefinition = Math.random() > 0.5;
    const questionType = showDefinition ? 'definition' : 'word';

    // Select a random entry from the vocabData
    const correctEntry = vocabData[Math.floor(Math.random() * vocabData.length)];

    // Display the question
    questionContainer.textContent = showDefinition
      ? `Which word matches this definition? "${correctEntry.definition}"`
      : `What is the definition of "${correctEntry.word}"?`;

    // Create shuffled options (one correct, others incorrect)
    const shuffledData = shuffleArray(vocabData);
    const options = shuffledData.slice(0, 4); // Pick 4 random options
    if (!options.includes(correctEntry)) options[0] = correctEntry; // Ensure the correct answer is included
    shuffleArray(options); // Shuffle again to randomize position

    // Display options as buttons
    optionsContainer.innerHTML = ''; // Clear previous options
    options.forEach(option => {
      const optionButton = document.createElement('button');
      optionButton.className = 'game-item';
      optionButton.textContent = showDefinition ? option.word : option.definition;
      optionButton.addEventListener('click', () => checkAnswer(option, correctEntry, questionType));
      optionsContainer.appendChild(optionButton);
    });
  }

  function checkAnswer(selectedOption, correctEntry, questionType) {
    const isCorrect =
      (questionType === 'definition' && selectedOption.word === correctEntry.word) ||
      (questionType === 'word' && selectedOption.definition === correctEntry.definition);

    if (isCorrect) {
      showConfetti();
      resultContainer.textContent = 'Correct!';
    } else {
      showRedX();
      resultContainer.textContent = 'Incorrect.';
    }

    // Load the next question after 5 seconds
    timer = setTimeout(loadNewQuestion, 5000);
  }

  function showConfetti() {
    const confettiCanvas = document.createElement('canvas');
    confettiCanvas.id = 'confetti-canvas';
    confettiCanvas.style.position = 'fixed';
    confettiCanvas.style.top = '0';
    confettiCanvas.style.left = '0';
    confettiCanvas.style.width = '100%';
    confettiCanvas.style.height = '100%';
    document.body.appendChild(confettiCanvas);

    const confetti = new ConfettiGenerator({ target: 'confetti-canvas' });
    confetti.render();

    // Stop and remove confetti after 3 seconds
    setTimeout(() => {
      confetti.clear();
      confettiCanvas.remove();
    }, 3000);
  }

  function showRedX() {
    const redX = document.createElement('div');
    redX.textContent = 'X';
    redX.style.color = 'red';
    redX.style.fontSize = '100px';
    redX.style.fontWeight = 'bold';
    redX.style.position = 'fixed';
    redX.style.top = '50%';
    redX.style.left = '50%';
    redX.style.transform = 'translate(-50%, -50%)';
    document.body.appendChild(redX);

    // Remove red X after 2 seconds
    setTimeout(() => redX.remove(), 2000);
  }

  // Start the game by loading the first question
  loadNewQuestion();
}

// Rest of the script remains the same
