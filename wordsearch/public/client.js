const socket = io();

const categories = ['peliculas','comida','lugares','personajes','pasatiempos','animales','colores','deportes','musica','tecnologia'];
const categoryThemes = {
  peliculas: '#ffeb3b',
  comida: '#ff5722',
  lugares: '#4caf50',
  personajes: '#9c27b0',
  pasatiempos: '#03a9f4',
  animales: '#8bc34a',
  colores: '#e91e63',
  deportes: '#ffc107',
  musica: '#3f51b5',
  tecnologia: '#009688'
};

const categorySelect = document.getElementById('category');
categories.forEach(cat => {
  const opt = document.createElement('option');
  opt.value = cat;
  opt.textContent = cat;
  categorySelect.appendChild(opt);
});

document.getElementById('create').onclick = () => {
  const room = document.getElementById('room').value;
  const name = document.getElementById('name').value;
  const category = categorySelect.value;
  const rounds = parseInt(document.getElementById('rounds').value);
  socket.emit('createGame', { room, name, category, rounds, single: false });
};

document.getElementById('join').onclick = () => {
  const room = document.getElementById('room').value;
  const name = document.getElementById('name').value;
  socket.emit('joinGame', { room, name });
};

document.getElementById('solo').onclick = () => {
  const room = 'solo-' + Date.now();
  const name = document.getElementById('name').value || 'Jugador';
  const category = categorySelect.value;
  const rounds = parseInt(document.getElementById('rounds').value);
  document.getElementById('room').value = room;
  socket.emit('createGame', { room, name, category, rounds, single: true });
};

let players = {};
let currentWords = [];
let categoryColor = '#fff';

socket.on('waiting', () => {
  const setupDiv = document.getElementById('setup');
  const gameDiv = document.getElementById('game');
  setupDiv.style.display = 'none';
  gameDiv.style.display = 'block';
  document.getElementById('info').textContent = 'Esperando a segundo jugador...';
});

socket.on('playerJoined', playersList => {
  document.getElementById('info').textContent = 'Jugadores: ' + playersList.join(', ');
});

socket.on('startRound', ({ round, board, words, players: playerMap, category }) => {
  players = playerMap;
  currentWords = words;
  categoryColor = categoryThemes[category] || '#fff';
  document.getElementById('setup').style.display = 'none';
  const gameDiv = document.getElementById('game');
  gameDiv.style.display = 'block';
  gameDiv.style.background = categoryColor;
  document.getElementById('info').textContent = 'Ronda ' + round;
  renderBoard(board);
  renderWords(words);
  document.getElementById('scores').textContent = 'Puntuación: ' + Object.keys(players).map(p => `${p}:0`).join(' ');
  document.getElementById('found').innerHTML = '';
});

socket.on('wordFound', ({ word, player, positions, scores }) => {
  positions.forEach(([r, c]) => {
    const cell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
    if (cell) {
      cell.classList.add('found');
      cell.style.background = players[player];
    }
  });
  const span = document.createElement('span');
  span.textContent = `${player}: ${word}`;
  span.style.color = players[player];
  document.getElementById('found').appendChild(span);
  currentWords = currentWords.filter(w => w !== word);
  renderWords(currentWords);
  document.getElementById('scores').textContent = 'Puntuación: ' + Object.entries(scores).map(([p,s]) => `${p}:${s}`).join(' ');
});

socket.on('gameOver', scores => {
  const entries = Object.entries(scores).sort((a,b) => b[1]-a[1]);
  const winner = entries[0][0];
  document.getElementById('info').textContent = 'Ganador: ' + winner;
});

function renderBoard(board) {
  const boardDiv = document.getElementById('board');
  boardDiv.innerHTML = '';
  board.forEach((row, r) => {
    row.forEach((letter, c) => {
      const cell = document.createElement('div');
      cell.textContent = letter;
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.dataset.letter = letter;
      boardDiv.appendChild(cell);
    });
  });
}

function renderWords(words) {
  const wordsDiv = document.getElementById('words');
  wordsDiv.textContent = 'Palabras: ' + words.join(', ');
}

let selecting = false;
let selected = [];
const boardDiv = document.getElementById('board');

boardDiv.addEventListener('pointerdown', e => {
  if (!e.target.dataset.letter) return;
  selecting = true;
  selected = [e.target];
  e.target.classList.add('selecting');
});

boardDiv.addEventListener('pointerenter', e => {
  if (!selecting || !e.target.dataset.letter) return;
  if (!selected.includes(e.target)) {
    selected.push(e.target);
    e.target.classList.add('selecting');
  }
});

function isStraightLine(pos) {
  if (pos.length < 2) return false;
  const dr = Math.sign(pos[1][0] - pos[0][0]);
  const dc = Math.sign(pos[1][1] - pos[0][1]);
  if (dr === 0 && dc === 0) return false;
  if (!(dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc))) return false;
  for (let i = 1; i < pos.length; i++) {
    if (pos[i][0] - pos[i - 1][0] !== dr || pos[i][1] - pos[i - 1][1] !== dc) {
      return false;
    }
  }
  return true;
}

window.addEventListener('pointerup', () => {
  if (!selecting) return;
  selecting = false;
  const letters = selected.map(c => c.dataset.letter);
  const word = letters.join('');
  const rev = letters.slice().reverse().join('');
  const player = document.getElementById('name').value;
  const room = document.getElementById('room').value;
  const positions = selected.map(c => [parseInt(c.dataset.row), parseInt(c.dataset.col)]);
  selected.forEach(c => c.classList.remove('selecting'));
  let chosen = null;
  if (isStraightLine(positions)) {
    if (currentWords.includes(word)) chosen = word;
    else if (currentWords.includes(rev)) {
      chosen = rev;
      positions.reverse();
    }
  }
  if (chosen) {
    socket.emit('foundWord', { room, word: chosen, player, positions });
  }
  selected = [];
});
