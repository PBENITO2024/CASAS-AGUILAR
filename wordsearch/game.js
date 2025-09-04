function generateBoard(wordList, size = 12, numWords = 5) {
  const board = Array.from({ length: size }, () => Array(size).fill(''));
  const words = [];
  const available = [...wordList];

  while (words.length < numWords && available.length) {
    const index = Math.floor(Math.random() * available.length);
    const word = available.splice(index, 1)[0].toUpperCase();
    words.push(word);
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * (size - word.length));
    for (let i = 0; i < word.length; i++) {
      board[row][col + i] = word[i];
    }
  }

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!board[r][c]) {
        board[r][c] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }
  return { board, words };
}

module.exports = { generateBoard };
