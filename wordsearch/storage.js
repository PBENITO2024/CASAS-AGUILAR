const { readFile, writeFile, mkdir } = require('fs/promises');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const file = path.join(dataDir, 'games.json');

async function loadGames() {
  try {
    const data = await readFile(file, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return {};
    }
    throw err;
  }
}

async function saveGames(games) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(file, JSON.stringify(games), 'utf8');
}

module.exports = { loadGames, saveGames };
