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
      const key = header.toLowerCase().replace(/\s+/g, ''); // Simplified key formatting
      entry[key] = parts[index];
    });
    return entry;
  });
  return data;
}

function initializeGame(vocabData) {
  const gameContainer = document.getElementById('game-container'); // Ensure this element exists in your HTML
  gameContainer.innerHTML = ''; // Clear content if reinitializing

  const quizGameButton = document.createElement('button');
  quizGameButton.textContent = 'Start Quiz';
  quizGameButton.className = 'game-button';
  quizGameButton.addEventListener('click', () => startQuizGame(vocabData));

  gameContainer.appendChild(quizGameButton);
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
  clearTimeout(timer); // Clear previous timers
  resultContainer.innerHTML = ''; // Clear result display
  questionContainer.innerHTML = ''; // Clear previous question

  // Randomly decide whether to show a word or definition
  const showDefinition = Math.random() > 0.5;
  const questionType = showDefinition ? 'definition' : 'word';

  // Select a random entry from the vocabData
  const correctEntry = vocabData[Math.floor(Math.random() * vocabData.length)];

  // Create separate elements for the question and entry
  const questionText = document.createElement('p');
  questionText.textContent = showDefinition
    ? `Which word matches this definition?`
    : `What is the definition of this word?`;

  const entryText = document.createElement('p');
  entryText.textContent = showDefinition ? correctEntry.definition : correctEntry.word;
  entryText.className = 'highlighted-entry'; // Add a CSS class for styling

  // Append the question and entry to the questionContainer
  questionContainer.appendChild(questionText);
  questionContainer.appendChild(entryText);

  // Create shuffled options
  const shuffledData = shuffleArray([...vocabData]);
  let options = shuffledData.slice(0, 3); // Pick 3 random incorrect options
  if (!options.some(option => option.word === correctEntry.word)) {
    options.push(correctEntry); // Ensure the correct option is included
  }
  options = shuffleArray(options); // Shuffle again to randomize positions

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
      flashScreen('green', 'Correct! Well done!'); // Flash green for correct answer
    } else {
      flashScreen('red', 'Incorrect. Try again!'); // Flash red for incorrect answer
    }

    // Load the next question after 2 seconds
    timer = setTimeout(loadNewQuestion, 2000);
  }

  function flashScreen(color, message) {
    const flashOverlay = document.createElement('div');
    flashOverlay.style.position = 'fixed';
    flashOverlay.style.top = '0';
    flashOverlay.style.left = '0';
    flashOverlay.style.width = '100%';
    flashOverlay.style.height = '100%';
    flashOverlay.style.backgroundColor = color;
    flashOverlay.style.opacity = '0.5';
    flashOverlay.style.zIndex = '9999';
    flashOverlay.style.pointerEvents = 'none'; // Ensure overlay doesn't block clicks
    document.body.appendChild(flashOverlay);

    // Display the result message
    resultContainer.textContent = message;

    // Remove the flash overlay after 500ms
    setTimeout(() => {
      flashOverlay.remove();
    }, 500);
  }

  // Start the game by loading the first question
  loadNewQuestion();
}

// Utility function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
