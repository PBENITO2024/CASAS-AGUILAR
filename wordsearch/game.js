function generateBoard(wordList, size = 12, numWords = 5) {
  // initialize empty board
  const board = Array.from({ length: size }, () => Array(size).fill(''));
  const words = [];
  const available = [...wordList];

  // eight possible directions (horizontal, vertical, diagonal)
  const directions = [
    [0, 1],   // derecha
    [1, 0],   // abajo
    [0, -1],  // izquierda
    [-1, 0],  // arriba
    [1, 1],   // diagonal abajo-derecha
    [-1, -1], // diagonal arriba-izquierda
    [1, -1],  // diagonal abajo-izquierda
    [-1, 1],  // diagonal arriba-derecha
  ];

  while (words.length < numWords && available.length) {
    const index = Math.floor(Math.random() * available.length);
    const word = available.splice(index, 1)[0].toUpperCase();

    let placed = false;
    let attempts = 0;

    // attempt to place the word in a random direction/position
    while (!placed && attempts < 100) {
      attempts++;
      const [dr, dc] = directions[Math.floor(Math.random() * directions.length)];
      const startRow = Math.floor(Math.random() * size);
      const startCol = Math.floor(Math.random() * size);

      // check if word fits
      let fits = true;
      for (let i = 0; i < word.length; i++) {
        const r = startRow + dr * i;
        const c = startCol + dc * i;

        if (r < 0 || c < 0 || r >= size || c >= size) {
          fits = false;
          break;
        }
        const current = board[r][c];
        if (current && current !== word[i]) {
          fits = false;
          break;
        }
      }

      if (!fits) continue;

      // place word on board
      for (let i = 0; i < word.length; i++) {
        const r = startRow + dr * i;
        const c = startCol + dc * i;
        board[r][c] = word[i];
      }
      placed = true;
      words.push(word);
    }
    // if not placed after attempts, skip word (could be replaced by another)
  }

  // fill remaining empty cells with random letters
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
