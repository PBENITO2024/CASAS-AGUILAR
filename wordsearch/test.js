const { generateBoard } = require('./game');

const { board, words } = generateBoard(['TEST']);
if (board.length !== 12) {
  console.error('Board size incorrect');
  process.exit(1);
}
if (!words.includes('TEST')) {
  console.error('Word missing');
  process.exit(1);
}
console.log('Tests passed');
