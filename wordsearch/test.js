const { generateBoard } = require('./game');

function findWord(board, word) {
  const size = board.length;
  const len = word.length;
  const dirs = [
    [0,1],
    [1,0],
    [1,1]
  ];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      for (const [dr, dc] of dirs) {
        let match = true;
        for (let i = 0; i < len; i++) {
          const nr = r + dr * i;
          const nc = c + dc * i;
          if (nr >= size || nc >= size || board[nr][nc] !== word[i]) {
            match = false;
            break;
          }
        }
        if (match) return true;
        match = true;
        for (let i = 0; i < len; i++) {
          const nr = r + dr * i;
          const nc = c + dc * i;
          if (nr >= size || nc >= size || board[nr][nc] !== word[len - 1 - i]) {
            match = false;
            break;
          }
        }
        if (match) return true;
      }
    }
  }
  return false;
}

const { board, words } = generateBoard(['TEST', 'WORD'], 12, 2);
if (board.length !== 12) {
  console.error('Board size incorrect');
  process.exit(1);
}
for (const w of words) {
  if (!findWord(board, w)) {
    console.error('Word missing or misplaced:', w);
    process.exit(1);
  }
}
console.log('Tests passed');
