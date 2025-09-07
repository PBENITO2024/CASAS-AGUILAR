function generateBoard(wordList, size = 12, numWords = 5) {
  const board = Array.from({ length: size }, () => Array(size).fill(''));
  const words = [];
  const available = [...wordList];
  const orientations = [
    { dr: 0, dc: 1 }, // horizontal
    { dr: 1, dc: 0 }, // vertical
    { dr: 1, dc: 1 }, // diagonal
  ];

  while (words.length < numWords && available.length) {
    const index = Math.floor(Math.random() * available.length);
    const word = available.splice(index, 1)[0].toUpperCase();
    let placed = false;

    for (let attempt = 0; attempt < 100 && !placed; attempt++) {
      const { dr, dc } = orientations[Math.floor(Math.random() * orientations.length)];

      const maxRow = dr === 1 ? size - word.length : size;
      const maxCol = dc === 1 ? size - word.length : size;
      const row = Math.floor(Math.random() * maxRow);
      const col = Math.floor(Math.random() * maxCol);

      let fits = true;
      for (let i = 0; i < word.length; i++) {
        const r = row + dr * i;
        const c = col + dc * i;
        if (r < 0 || r >= size || c < 0 || c >= size || (board[r][c] && board[r][c] !== word[i])) {
          fits = false;
          break;
        }
      }

      if (fits) {
        for (let i = 0; i < word.length; i++) {
          board[row + dr * i][col + dc * i] = word[i];
        }
        words.push(word);
        placed = true;
      }
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
