const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { generateBoard } = require('./game');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const categories = {
  peliculas: ['TITANIC', 'AVATAR', 'MATRIX'],
  comida: ['PASTA', 'TACO', 'SOPA'],
  lugares: ['PARIS', 'LIMA', 'TOKIO'],
  personajes: ['BATMAN', 'SHREK', 'GOKU'],
  pasatiempos: ['LECTURA', 'AJEDREZ', 'DIBUJO'],
  animales: ['TIGRE', 'PERRO', 'GATO'],
  colores: ['ROJO', 'VERDE', 'AZUL'],
  deportes: ['FUTBOL', 'TENIS', 'BOX'],
  musica: ['ROCK', 'POP', 'JAZZ'],
  tecnologia: ['LAPTOP', 'ROBOT', 'DRONE']
};

const games = {};

io.on('connection', (socket) => {
  socket.on('createGame', ({ room, category, rounds }) => {
    if (games[room]) return;
    games[room] = {
      players: {},
      category,
      rounds,
      currentRound: 0,
      board: null,
      words: null,
      scores: {}
    };
    socket.join(room);
    socket.emit('waiting');
  });

  socket.on('joinGame', ({ room, name }) => {
    const game = games[room];
    if (!game || Object.keys(game.players).length >= 2) {
      socket.emit('full');
      return;
    }
    game.players[socket.id] = name;
    game.scores[name] = 0;
    socket.join(room);
    io.to(room).emit('playerJoined', game.players);
    if (Object.keys(game.players).length === 2) {
      startRound(room);
    }
  });

  socket.on('foundWord', ({ room, word, player }) => {
    const game = games[room];
    if (!game || !game.words.includes(word)) return;
    const index = game.words.indexOf(word);
    if (index === -1) return;
    game.words.splice(index, 1);
    game.scores[player] += 1;
    io.to(room).emit('updateScores', game.scores);
    if (game.words.length === 0) {
      game.currentRound += 1;
      if (game.currentRound >= game.rounds) {
        io.to(room).emit('gameOver', game.scores);
        delete games[room];
      } else {
        startRound(room);
      }
    }
  });

  socket.on('disconnecting', () => {
    const rooms = [...socket.rooms].filter(r => r !== socket.id);
    rooms.forEach(room => {
      delete games[room];
      io.to(room).emit('playerLeft');
    });
  });
});

function startRound(room) {
  const game = games[room];
  const { board, words } = generateBoard(categories[game.category]);
  game.board = board;
  game.words = words;
  io.to(room).emit('startRound', {
    round: game.currentRound + 1,
    board,
    words: words.slice()
  });
}

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));
