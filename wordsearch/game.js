function generateBoard(wordList, size = 12, numWords = 5) {
  const board = Array.from({ length: size }, () => Array(size).fill(''));
  const words = [];
  const available = [...wordList];

  while (words.length < numWords && available.length) {
    const index = Math.floor(Math.random() * available.length);
    const word = available.splice(index, 1)[0].toUpperCase();
    let placed = false;
    let attempts = 0;
    const directions = [
      { dr: 0, dc: 1 }, // horizontal
      { dr: 1, dc: 0 }, // vertical
      { dr: 1, dc: 1 }  // diagonal
    ];
    while (!placed && attempts < 100) {
      attempts++;
      const dir = directions[Math.floor(Math.random() * directions.length)];
      let row = 0;
      let col = 0;
      if (dir.dr === 0 && dir.dc === 1) { // horizontal
        row = Math.floor(Math.random() * size);
        col = Math.floor(Math.random() * (size - word.length));
      } else if (dir.dr === 1 && dir.dc === 0) { // vertical
        row = Math.floor(Math.random() * (size - word.length));
        col = Math.floor(Math.random() * size);
      } else { // diagonal
        row = Math.floor(Math.random() * (size - word.length));
        col = Math.floor(Math.random() * (size - word.length));
      }
      let collision = false;
      for (let i = 0; i < word.length; i++) {
        const r = row + dir.dr * i;
        const c = col + dir.dc * i;
        if (board[r][c] && board[r][c] !== word[i]) {
          collision = true;
          break;
        }
      }
      if (!collision) {
        for (let i = 0; i < word.length; i++) {
          const r = row + dir.dr * i;
          const c = col + dir.dc * i;
          board[r][c] = word[i];
        }
        placed = true;
        words.push(word);
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
