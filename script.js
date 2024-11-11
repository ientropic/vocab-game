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

// Rest of the script remains the same
