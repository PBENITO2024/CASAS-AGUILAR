const socket = io();

const categories = ['peliculas','comida','lugares','personajes','pasatiempos','animales','colores','deportes','musica','tecnologia'];
const categorySelect = document.getElementById('category');
categories.forEach(cat => {
  const opt = document.createElement('option');
  opt.value = cat;
  opt.textContent = cat;
  categorySelect.appendChild(opt);
});

document.getElementById('create').onclick = () => {
  const room = document.getElementById('room').value;
  const category = categorySelect.value;
  const rounds = parseInt(document.getElementById('rounds').value);
  socket.emit('createGame', { room, category, rounds });
};

document.getElementById('join').onclick = () => {
  const room = document.getElementById('room').value;
  const name = document.getElementById('name').value;
  socket.emit('joinGame', { room, name });
};

socket.on('waiting', () => {
  document.getElementById('info').textContent = 'Esperando a segundo jugador...';
});

socket.on('playerJoined', players => {
  document.getElementById('info').textContent = 'Jugadores: ' + Object.values(players).join(', ');
});

socket.on('startRound', ({ round, board, words }) => {
  document.getElementById('setup').style.display = 'none';
  document.getElementById('game').style.display = 'block';
  document.getElementById('info').textContent = 'Ronda ' + round;
  renderBoard(board);
  renderWords(words);
});

socket.on('updateScores', scores => {
  document.getElementById('scores').textContent = 'Puntuación: ' + JSON.stringify(scores);
});

socket.on('gameOver', scores => {
  const entries = Object.entries(scores).sort((a,b) => b[1]-a[1]);
  const winner = entries[0][0];
  document.getElementById('info').textContent = 'Ganador: ' + winner;
});

function renderBoard(board) {
  const boardDiv = document.getElementById('board');
  boardDiv.innerHTML = '';
  board.forEach(row => {
    row.forEach(letter => {
      const cell = document.createElement('div');
      cell.textContent = letter;
      boardDiv.appendChild(cell);
    });
  });
}

function renderWords(words) {
  const wordsDiv = document.getElementById('words');
  wordsDiv.textContent = 'Palabras: ' + words.join(', ');
}

document.getElementById('board').addEventListener('click', e => {
  if (e.target.tagName !== 'DIV') return;
  const word = prompt('Ingresa la palabra encontrada');
  const player = document.getElementById('name').value;
  const room = document.getElementById('room').value;
  if (word) {
    socket.emit('foundWord', { room, word: word.toUpperCase(), player });
  }
});
