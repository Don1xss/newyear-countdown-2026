const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(express.json());

const db = new sqlite3.Database('users.db');
db.run(`CREATE TABLE IF NOT EXISTS users (
  userId TEXT PRIMARY KEY,
  name TEXT,
  character TEXT,
  totalScore INTEGER DEFAULT 0,
  memoryHighScore INTEGER DEFAULT 0,
  quizHighScore INTEGER DEFAULT 0,
  lastVisit TEXT
)`);

app.post('/api/users', (req, res) => {
  const id = uuidv4();
  db.run(`INSERT INTO users (userId, name, character, totalScore, memoryHighScore, quizHighScore, lastVisit) 
          VALUES (?, ?, ?, 0, 0, 0, ?)`,
    [id, req.body.name, req.body.character, new Date().toISOString()],
    function(err) {
      if (err) return res.status(500).json({error: err.message});
      res.json({userId: id});
    });
});

app.put('/api/users', (req, res) => {
  db.run(`UPDATE users SET name=?, character=?, totalScore=?, memoryHighScore=?, quizHighScore=?, lastVisit=?
          WHERE userId=?`,
    [req.body.name, req.body.character, req.body.totalScore, req.body.memoryHighScore, req.body.quizHighScore, new Date().toISOString(), req.body.userId],
    function(err) {
      if (err) return res.status(500).json({error: err.message});
      res.json({success: true});
    });
});

app.listen(3000, () => console.log('Админ-сервер запущен на порту 3000'));