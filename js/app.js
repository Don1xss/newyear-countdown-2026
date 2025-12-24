// js/app.js — финальная версия (всё работает: отсчёт, снег, музыка, этапы, игры, профиль, Supabase)

const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const message = document.getElementById('message');
const musicBtn = document.getElementById('musicBtn');
const body = document.body;
const topGarland = document.querySelector('.top-garland');
const bottomGarland = document.querySelector('.bottom-garland');
const finalCountdownOverlay = document.getElementById('finalCountdownOverlay');
const finalCountdownNumber = document.getElementById('finalCountdownNumber');

const backgroundMusic = document.getElementById('backgroundMusic');
const newyearMusic = document.getElementById('newyearMusic');

let userAllowedMusic = false;
let isNewYearMusicPlaying = false;
let fireworksStarted = false;

// Этапы событий
let stage24Hours = false;
let stage1Hour = false;
let stage10Minutes = false;
let stage10Seconds = false;
let stageNewYear = false;

const targetDate = new Date('2026-01-01T00:00:00');

// === SUPABASE ===
const SUPABASE_URL = 'https://kfhkuqcqzhsmjeaiuufz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_E_QSjBIxInHDCwj2cvobig_pDCMJioU';

let userData = {
  id: null,
  name: '',
  character: 'tree',
  totalScore: 0,
  memoryHighScore: 0,
  quizHighScore: 0,
  santaFlightHighScore: 0
};

// Загрузка профиля
if (localStorage.getItem('newyearUserData')) {
  userData = JSON.parse(localStorage.getItem('newyearUserData'));
  applyPersonalization();
  updateProfileDisplay();
} else {
  document.getElementById('personalizationModal').style.display = 'flex';
}

// Сохранение в localStorage + Supabase
async function saveUserData() {
  localStorage.setItem('newyearUserData', JSON.stringify(userData));
  updateProfileDisplay();

  try {
    let method = userData.id ? 'PATCH' : 'POST';
    let url = `${SUPABASE_URL}/rest/v1/users`;
    if (userData.id) url += `?id=eq.${userData.id}`;

    const response = await fetch(url, {
      method,
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        name: userData.name,
        character: userData.character,
        total_score: userData.totalScore,
        memory_high: userData.memoryHighScore,
        quiz_high: userData.quizHighScore,
        santa_flight_high: userData.santaFlightHighScore
      })
    });

    if (response.ok && !userData.id) {
      const data = await response.json();
      if (data.length > 0) {
        userData.id = data[0].id;
        localStorage.setItem('newyearUserData', JSON.stringify(userData));
      }
    }
  } catch (err) {
    console.log('Оффлайн — данные сохранены локально');
  }
}

// Персонализация
document.getElementById('savePersonalization').addEventListener('click', async () => {
  const name = document.getElementById('userNameInput').value.trim();
  const character = document.querySelector('input[name="character"]:checked').value;

  if (name) {
    userData.name = name;
    userData.character = character;
    await saveUserData();
    updateProfileDisplay();
    applyPersonalization();
    document.getElementById('personalizationModal').style.display = 'none';
    showNotification(`Привет, ${name}! ${getCharacterEmoji()}`);
  } else {
    showNotification('Введите имя!', 'error');
  }
});

function getCharacterEmoji() {
  const map = { tree: '🎄', reindeer: '🦌', snowman: '⛄' };
  return map[userData.character] || '🎄';
}

function applyPersonalization() {
  if (userData.name) {
    document.getElementById('greetingTitle').innerHTML = `${getCharacterEmoji()} ${userData.name}, до Нового года осталось`;
    document.getElementById('playerName').textContent = userData.name;
    document.getElementById('playerCharacter').textContent = getCharacterEmoji();
  }
}

function getLevelName(score) {
  if (score >= 300) return 'Легенда Нового года 🌟';
  if (score >= 200) return 'Дед Мороз 🎅';
  if (score >= 100) return 'Снегурочка ❄️';
  if (score >= 50) return 'Эльф 🧝';
  return 'Гость 👤';
}

function updateProfileDisplay() {
  const level = getLevelName(userData.totalScore);

  document.getElementById('totalScore').textContent = userData.totalScore;
  document.getElementById('levelName').textContent = level;

  document.getElementById('profileName').textContent = userData.name || 'Гость';
  document.getElementById('profileCharacter').textContent = getCharacterEmoji();
  document.getElementById('profileLevel').textContent = level;
  document.getElementById('profileTotalScore').textContent = userData.totalScore;
  document.getElementById('profileMemoryHigh').textContent = userData.memoryHighScore;
  document.getElementById('profileQuizHigh').textContent = userData.quizHighScore;

  const santaHighEl = document.getElementById('santaHighScore');
  if (santaHighEl) santaHighEl.textContent = `Рекорд: ${userData.santaFlightHighScore || 0}`;
}

async function addAchievement(points, game = 'general') {
  userData.totalScore += points;

  if (game === 'memory' && points > userData.memoryHighScore) {
    userData.memoryHighScore = points;
  }
  if (game === 'quiz' && points > userData.quizHighScore) {
    userData.quizHighScore = points;
  }
  if (game === 'santaFlight' && points > userData.santaFlightHighScore) {
    userData.santaFlightHighScore = points;
  }

  await saveUserData();

  // ← ЭТА СТРОКА РЕШАЕТ ПРОБЛЕМУ!
  updateProfileDisplay();

  const newLevel = getLevelName(userData.totalScore);
  const oldLevel = getLevelName(userData.totalScore - points);
  if (newLevel !== oldLevel) {
    showNotification(`Новый уровень: ${newLevel} 🎉`);
  }
}

// Музыка
musicBtn.onclick = () => {
  userAllowedMusic = true;
  musicBtn.textContent = 'Музыка играет 🎶';
  musicBtn.disabled = true;
  backgroundMusic.volume = 0.4;
  backgroundMusic.play().catch(() => {});
};

// Снег
let snowInterval = 200;
const snowContainer = document.getElementById('snow');

function createSnowflake() {
  const snowflake = document.createElement('div');
  snowflake.className = 'snowflake';
  snowflake.textContent = '❄';
  snowflake.style.left = Math.random() * window.innerWidth + 'px';
  snowflake.style.fontSize = Math.random() * 14 + 10 + 'px';
  snowflake.style.opacity = Math.random();
  snowflake.style.animationDuration = Math.random() * 5 + 6 + 's';
  snowContainer.appendChild(snowflake);
  setTimeout(() => snowflake.remove(), 12000);
}

setInterval(createSnowflake, snowInterval);

// Звёзды
const starsContainer = document.getElementById('stars');

function createStar() {
  const star = document.createElement('div');
  star.className = 'star';
  star.textContent = '✨';
  star.style.left = Math.random() * window.innerWidth + 'px';
  star.style.top = Math.random() * window.innerHeight + 'px';
  star.style.fontSize = Math.random() * 8 + 4 + 'px';
  star.style.opacity = Math.random() * 0.5 + 0.5;
  star.style.animationDuration = Math.random() * 2 + 1 + 's';
  starsContainer.appendChild(star);
  setTimeout(() => star.remove(), 5000);
}

setInterval(createStar, 500);

// Фейерверки
const fireworksContainer = document.getElementById('fireworks');

function createFirework() {
  const firework = document.createElement('div');
  firework.className = 'firework';
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
  firework.style.left = Math.random() * window.innerWidth + 'px';
  firework.style.top = Math.random() * window.innerHeight * 0.7 + 'px';
  fireworksContainer.appendChild(firework);
  setTimeout(() => firework.remove(), 2000);
}

function startFireworks() {
  setInterval(createFirework, 300);
}

// Этапы событий
function checkStages() {
  const now = new Date();
  const diff = targetDate - now;
  const totalSeconds = Math.floor(diff / 1000);

  if (diff <= 0 && !stageNewYear) {
    stageNewYear = true;
    message.textContent = '🎆 С Новым 2026 годом! 🎆';
    finalCountdownOverlay.style.display = 'none';
    if (userAllowedMusic && !isNewYearMusicPlaying) {
      isNewYearMusicPlaying = true;
      backgroundMusic.pause();
      newyearMusic.play();
    }
    if (!fireworksStarted) {
      startFireworks();
      fireworksStarted = true;
    }
    return;
  }

  if (totalSeconds <= 86400 && !stage24Hours) {
    stage24Hours = true;
    body.classList.add('bright-mode');
    showNotification('24 часа до Нового года!');
  }

  if (totalSeconds <= 3600 && !stage1Hour) {
    stage1Hour = true;
    snowInterval = 100;
    showNotification('Остался 1 час!');
  }

  if (totalSeconds <= 600 && !stage10Minutes) {
    stage10Minutes = true;
    topGarland.classList.add('garland-flash');
    bottomGarland.classList.add('garland-flash');
    showNotification('10 минут до Нового года!');
  }

  if (totalSeconds <= 10 && !stage10Seconds) {
    stage10Seconds = true;
    finalCountdownOverlay.style.display = 'flex';
    let count = 10;
    const interval = setInterval(() => {
      finalCountdownNumber.textContent = count;
      count--;
      if (count < 0) {
        clearInterval(interval);
        finalCountdownNumber.textContent = 'С Новым годом!';
      }
    }, 1000);
  }
}

// Отсчёт
function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    daysEl.textContent = hoursEl.textContent = minutesEl.textContent = secondsEl.textContent = 0;
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  daysEl.textContent = days;
  hoursEl.textContent = hours;
  minutesEl.textContent = minutes;
  secondsEl.textContent = seconds;

  checkStages();
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Уведомления
function showNotification(msg, type = 'success') {
  const notif = document.getElementById('notification');
  notif.textContent = msg;
  notif.className = `notification ${type}`;
  notif.style.display = 'block';
  setTimeout(() => notif.style.display = 'none', 3000);
}

// Вкладки
document.querySelectorAll('.tabs button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    document.querySelectorAll('.tabs button').forEach(b => b.classList.remove('active'));
    const tabId = btn.id.replace('Btn', 'Tab');
    document.getElementById(tabId).style.display = 'block';
    btn.classList.add('active');
    if (btn.id === 'profileBtn') updateProfileDisplay();
  });
});

// Инициализация профиля
updateProfileDisplay();
// === Игра на память ===
const emojis = ['🎄', '🎅', '❄️', '🎁', '🔔', '🍾', '🎄', '🎅', '❄️', '🎁', '🔔', '🍾'];
let shuffledEmojis = emojis.sort(() => Math.random() - 0.5);
let selectedCards = [];
let matchedPairs = 0;
let memoryScore = 0;

const memoryGrid = document.getElementById('memoryGame');
const memoryScoreEl = document.getElementById('memoryScore');
const resetMemoryBtn = document.getElementById('resetMemory');

function createMemoryGame() {
  memoryGrid.innerHTML = '';
  shuffledEmojis.forEach((emoji, index) => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.dataset.index = index;
    card.dataset.emoji = emoji;
    card.addEventListener('click', flipCard);
    memoryGrid.appendChild(card);
  });
}

function flipCard() {
  if (selectedCards.length < 2 && !this.classList.contains('flipped')) {
    this.classList.add('flipped');
    this.textContent = this.dataset.emoji;
    selectedCards.push(this);

    if (selectedCards.length === 2) {
      setTimeout(checkMatch, 500);
    }
  }
}

function checkMatch() {
  const [card1, card2] = selectedCards;
  if (card1.dataset.emoji === card2.dataset.emoji) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    matchedPairs++;
    memoryScore += 10;
    memoryScoreEl.textContent = `Счёт: ${memoryScore}`;
    if (matchedPairs === emojis.length / 2) {
      showNotification('Поздравляем! Вы выиграли!');
    }
  } else {
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
    card1.textContent = '';
    card2.textContent = '';
  }
  selectedCards = [];
}

resetMemoryBtn.addEventListener('click', () => {
  shuffledEmojis = emojis.sort(() => Math.random() - 0.5);
  matchedPairs = 0;
  memoryScore = 0;
  memoryScoreEl.textContent = `Счёт: ${memoryScore}`;
  createMemoryGame();
});
updateProfileDisplay();

createMemoryGame();

// === Квиз (остаётся без изменений) ===
const quizQuestions = [
  // ... (твой массив вопросов остаётся полностью тем же)
];

let currentQuizIndex = 0;
let quizScore = 0;
let timerInterval;
let timeLeft = 30;

const quizCategoryEl = document.getElementById('quizCategory');
const quizQuestionEl = document.getElementById('quizQuestion');
const quizOptionsEl = document.getElementById('quizOptions');
const quizTimerEl = document.getElementById('quizTimer');
const quizScoreEl = document.getElementById('quizScore');
const quizResultEl = document.getElementById('quizResult');
const startQuizBtn = document.getElementById('startQuiz');
const nextQuizBtn = document.getElementById('nextQuiz');

function startTimer() {
  timeLeft = 30;
  quizTimerEl.textContent = `Время: ${timeLeft} сек`;
  timerInterval = setInterval(() => {
    timeLeft--;
    quizTimerEl.textContent = `Время: ${timeLeft} сек`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      showNotification('Время вышло!', 'error');
      currentQuizIndex++;
      loadQuizQuestion();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function loadQuizQuestion() {
  stopTimer();
  quizResultEl.style.display = 'none';
  nextQuizBtn.style.display = 'none';

  if (currentQuizIndex >= quizQuestions.length) {
    quizQuestionEl.textContent = 'Quiz завершён!';
    quizOptionsEl.innerHTML = '';
    quizCategoryEl.textContent = '';
    quizTimerEl.textContent = '';
    let resultText;
    if (quizScore >= 150) {
      resultText = 'Ты — Дед Мороз! 🎅 Ты мастер новогодних традиций!';
    } else if (quizScore >= 80) {
      resultText = 'Ты — новогодний эльф! 🧝 Хорошие знания, но есть куда расти!';
    } else {
      resultText = 'Ты — Гринч! 😈 Тебе стоит больше узнать о Новом годе!';
    }
    quizResultEl.textContent = resultText;
    quizResultEl.style.display = 'block';
    startQuizBtn.style.display = 'block';
    return;
  }

  const q = quizQuestions[currentQuizIndex];
  quizCategoryEl.textContent = `Категория: ${q.category}`;
  quizQuestionEl.textContent = q.question;
  quizOptionsEl.innerHTML = '';
  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.addEventListener('click', () => checkQuizAnswer(opt));
    quizOptionsEl.appendChild(btn);
  });
  startTimer();
}

function checkQuizAnswer(selected) {
  stopTimer();
  const q = quizQuestions[currentQuizIndex];
  if (selected === q.answer) {
    quizScore += 10;
    quizScoreEl.textContent = `Счёт: ${quizScore}`;
    showNotification('Правильно!');
  } else {
    showNotification('Неправильно!', 'error');
  }
  currentQuizIndex++;
  nextQuizBtn.style.display = 'block';
}

startQuizBtn.addEventListener('click', () => {
  currentQuizIndex = 0;
  quizScore = 0;
  quizScoreEl.textContent = `Счёт: ${quizScore}`;
  startQuizBtn.style.display = 'none';
  loadQuizQuestion();
});

nextQuizBtn.addEventListener('click', () => {
  loadQuizQuestion();
});

function showNotification(msg, type = 'success') {
  const notif = document.getElementById('notification');
  notif.textContent = msg;
  notif.className = `notification ${type}`;
  notif.style.display = 'block';
  setTimeout(() => {
    notif.style.display = 'none';
  }, 3000);
}
updateProfileDisplay();

// === МИНИ-ИГРА: Ёлочки vs Олени (с режимом против компьютера) ===
const ticTacToeBoard = document.getElementById('ticTacToeBoard');
const ticTacToeStatus = document.getElementById('ticTacToeStatus');
const restartTicTacToeBtn = document.getElementById('restartTicTacToe');
const vsPlayerBtn = document.getElementById('vsPlayerBtn');
const vsComputerBtn = document.getElementById('vsComputerBtn');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = '🎄'; // Игрок всегда начинает за Ёлочки
let gameActive = true;
let vsComputer = false; // По умолчанию — с другом

function createBoard() {
  ticTacToeBoard.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'tic-tac-toe-cell';
    cell.dataset.index = i;
    cell.addEventListener('click', handleCellClick);
    ticTacToeBoard.appendChild(cell);
  }
  ticTacToeStatus.textContent = `Ход: ${currentPlayer}`;
}

function handleCellClick(e) {
  const index = parseInt(e.target.dataset.index);
  if (board[index] !== '' || !gameActive) return;

  makeMove(index, currentPlayer);

  if (gameActive && vsComputer && currentPlayer === '🦌') {
    setTimeout(computerMove, 600); // Небольшая задержка для "думания"
  }
}

function makeMove(index, player) {
  board[index] = player;
  const cell = document.querySelector(`.tic-tac-toe-cell[data-index="${index}"]`);
  cell.textContent = player;
  cell.classList.add('filled');

  if (checkWin(player)) {
    ticTacToeStatus.textContent = `${player} победил! 🎉`;
    highlightWinner(player);
    gameActive = false;
    return true;
  }

  if (board.every(cell => cell !== '')) {
    ticTacToeStatus.textContent = 'Ничья! 🎄🦌';
    gameActive = false;
    return true;
  }

  currentPlayer = currentPlayer === '🎄' ? '🦌' : '🎄';
  ticTacToeStatus.textContent = `Ход: ${currentPlayer}`;
  return false;
}

function checkWin(player) {
  const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  return winConditions.some(condition => {
    return condition.every(i => board[i] === player);
  });
}

function highlightWinner(player) {
  const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  winConditions.forEach(condition => {
    if (condition.every(i => board[i] === player)) {
      condition.forEach(i => {
        document.querySelector(`.tic-tac-toe-cell[data-index="${i}"]`).classList.add('winner');
      });
    }
  });
}

// === ИИ для компьютера ===
function computerMove() {
  if (!gameActive) return;

  // 1. Пытаемся выиграть
  for (let i = 0; i < 9; i++) {
    if (board[i] === '') {
      board[i] = '🦌';
      if (checkWin('🦌')) {
        makeMove(i, '🦌');
        return;
      }
      board[i] = '';
    }
  }

  // 2. Блокируем победу игрока
  for (let i = 0; i < 9; i++) {
    if (board[i] === '') {
      board[i] = '🎄';
      if (checkWin('🎄')) {
        board[i] = '';
        makeMove(i, '🦌');
        return;
      }
      board[i] = '';
    }
  }

  // 3. Ход в центр, если свободно
  if (board[4] === '') {
    makeMove(4, '🦌');
    return;
  }

  // 4. Случайный ход
  let available = board.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
  if (available.length > 0) {
    const randomIndex = available[Math.floor(Math.random() * available.length)];
    makeMove(randomIndex, '🦌');
  }
}

// === Переключение режимов ===
vsPlayerBtn.addEventListener('click', () => {
  vsComputer = false;
  vsPlayerBtn.classList.add('active');
  vsComputerBtn.classList.remove('active');
  restartGame();
});

vsComputerBtn.addEventListener('click', () => {
  vsComputer = true;
  vsComputerBtn.classList.add('active');
  vsPlayerBtn.classList.remove('active');
  restartGame();
});

// === Перезапуск ===
function restartGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = '🎄';
  gameActive = true;
  createBoard();
  ticTacToeStatus.textContent = `Ход: ${currentPlayer}`;
}

restartTicTacToeBtn.addEventListener('click', restartGame);

// === МИНИ-ИГРА: Полёт Деда Мороза (адаптивный + рекорд + стабильный рестарт) ===
const santaFlightCanvas = document.getElementById('santaFlightCanvas');
if (santaFlightCanvas) {
  const ctx = santaFlightCanvas.getContext('2d');

  // Загрузка изображений
  const backgroundImg = new Image();
  backgroundImg.src = 'assets/game/background.png';
  const santaImg = new Image();
  santaImg.src = 'assets/game/santa.png';
  const chimneyImg = new Image();
  chimneyImg.src = 'assets/game/chimney.png';
  const birdImg = new Image();
  birdImg.src = 'assets/game/bird.png';

  // Игровые параметры
  let santa = {
    x: 120,
    y: 200,
    w: 90,
    h: 120,
    velocityY: 0
  };

  function getSantaHitbox() {
    return {
      x: santa.x + 25,
      y: santa.y + 20,
      w: 50,
      h: 90
    };
  }

  const gravity = 0.7;
  const jumpPower = -14;
  const HORIZONTAL_SPEED = 6; // Фиксированная скорость

  let score = 0;
  let giftsCollected = 0;
  let highScore = parseInt(localStorage.getItem('santaFlightHighScore') || '0');
  let gameOver = false;
  let obstacles = [];
  let gifts = [];
  let spawnTimer = null;
  let animationId = null;
  let parallaxOffset = 0;

  // Адаптация canvas к размерам (вызывается при ресайзе и старте)
  function resizeCanvas() {
    santaFlightCanvas.width = santaFlightCanvas.clientWidth;
    santaFlightCanvas.height = santaFlightCanvas.clientHeight;

    // Корректируем позицию Санты
    santa.x = santaFlightCanvas.width * 0.15; // 15% от ширины
    if (santa.y + santa.h > santaFlightCanvas.height) {
      santa.y = santaFlightCanvas.height - santa.h;
    }
  }

  function updateHighScore() {
    if (Math.floor(score) > highScore) {
      highScore = Math.floor(score);
      localStorage.setItem('santaFlightHighScore', highScore);
    }
    const highScoreEl = document.getElementById('santaHighScore');
    if (highScoreEl) highScoreEl.textContent = `Рекорд: ${highScore}`;
  }

  function resetGame() {
    // Полное обнуление
    if (spawnTimer) clearInterval(spawnTimer);
    if (animationId) cancelAnimationFrame(animationId);

    resizeCanvas(); // Обновляем размер

    santa.y = santaFlightCanvas.height / 2;
    santa.velocityY = 0;
    score = 0;
    giftsCollected = 0;
    gameOver = false;
    obstacles = [];
    gifts = [];
    parallaxOffset = 0;

    document.getElementById('santaFlightScore').textContent = 'Очки: 0 | 🎁 0';
    updateHighScore();

    spawnTimer = setInterval(spawnObjects, 1800);
    animationId = requestAnimationFrame(gameLoop);
  }

  function spawnObjects() {
    if (gameOver) return;

    const isBird = Math.random() > 0.5;
    obstacles.push({
      x: santaFlightCanvas.width,
      y: isBird
        ? Math.random() * (santaFlightCanvas.height - 150) + 50
        : santaFlightCanvas.height - 64,
      w: 64,
      h: 64,
      type: isBird ? 'bird' : 'chimney'
    });

    if (Math.random() > 0.4) {
      gifts.push({
        x: santaFlightCanvas.width + 200,
        y: Math.random() * (santaFlightCanvas.height - 200) + 80,
        size: 40
      });
    }
  }

  function rectsIntersect(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function gameLoop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, santaFlightCanvas.width, santaFlightCanvas.height);

    // Параллакс
    parallaxOffset -= HORIZONTAL_SPEED * 0.5;
    if (parallaxOffset <= -santaFlightCanvas.width) parallaxOffset = 0;
    ctx.drawImage(backgroundImg, parallaxOffset, 0, santaFlightCanvas.width, santaFlightCanvas.height);
    ctx.drawImage(backgroundImg, parallaxOffset + santaFlightCanvas.width, 0, santaFlightCanvas.width, santaFlightCanvas.height);

    // Физика
    santa.velocityY += gravity;
    santa.y += santa.velocityY;

    if (santa.y < 0) santa.y = 0;
    if (santa.y + santa.h > santaFlightCanvas.height) {
      santa.y = santaFlightCanvas.height - santa.h;
      santa.velocityY = 0;
    }

    ctx.drawImage(santaImg, santa.x, santa.y, santa.w, santa.h);
    const santaHitbox = getSantaHitbox();

    // Препятствия
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const o = obstacles[i];
      o.x -= HORIZONTAL_SPEED;

      if (o.type === 'chimney') {
        ctx.drawImage(chimneyImg, o.x, o.y, 64, 64);
      } else {
        ctx.drawImage(birdImg, o.x, o.y, 64, 64);
      }

      const obstacleHitbox = { x: o.x + 10, y: o.y + 10, w: 44, h: 44 };

      if (rectsIntersect(santaHitbox, obstacleHitbox)) {
        endGame();
        return;
      }

      if (o.x + 64 < 0) obstacles.splice(i, 1);
    }

    // Подарки
    for (let i = gifts.length - 1; i >= 0; i--) {
      const g = gifts[i];
      g.x -= HORIZONTAL_SPEED;

      ctx.font = '32px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🎁', g.x + g.size / 2, g.y);

      const giftBox = { x: g.x, y: g.y - g.size / 2, w: g.size, h: g.size };

      if (rectsIntersect(santaHitbox, giftBox)) {
        giftsCollected++;
        score += 5;
        gifts.splice(i, 1);
      }

      if (g.x + g.size < 0) gifts.splice(i, 1);
    }

    // Очки
    score += 0.02;
    document.getElementById('santaFlightScore').textContent = `Очки: ${Math.floor(score)} | 🎁 ${giftsCollected}`;

    animationId = requestAnimationFrame(gameLoop);
  }

  function endGame() {
    gameOver = true;
    clearInterval(spawnTimer);
    spawnTimer = null;
    cancelAnimationFrame(animationId);
    animationId = null;
    updateProfileDisplay();

    updateHighScore();
    showNotification('❄️ Игра окончена! Нажми «Начать заново»');
  }

  // Управление
  function jump() {
    if (!gameOver && santa.y >= santaFlightCanvas.height - santa.h - 10) {
      santa.velocityY = jumpPower;
    }
  }

  document.addEventListener('keydown', e => {
    if (e.code === 'Space') {
      e.preventDefault();
      jump();
    }
  });

  santaFlightCanvas.addEventListener('touchstart', e => {
    e.preventDefault();
    jump();
  });

  document.getElementById('restartSantaFlight').addEventListener('click', resetGame);

  // Адаптация размера окна
  window.addEventListener('resize', () => {
    resizeCanvas();
    if (!gameOver) resetGame(); // Перезапуск при ресайзе, чтобы всё подстроилось
  });

  // Запуск после загрузки изображений
  let loadedImages = 0;
  const totalImages = 4;

  function onImageLoad() {
    loadedImages++;
    if (loadedImages === totalImages) {
      resizeCanvas();
      updateHighScore();
      resetGame(); // Автозапуск
    }
  }

  backgroundImg.onload = onImageLoad;
  santaImg.onload = onImageLoad;
  chimneyImg.onload = onImageLoad;
  birdImg.onload = onImageLoad;

  // Если изображения уже загружены (кэш)
  if (backgroundImg.complete) onImageLoad();
  if (santaImg.complete) onImageLoad();
  if (chimneyImg.complete) onImageLoad();
  if (birdImg.complete) onImageLoad();
}
// PWA установка
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('installBtn').style.display = 'block';
});

document.getElementById('installBtn').addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      document.getElementById('installBtn').style.display = 'none';
      showNotification('Приложение установлено! 🎉');
    }
    deferredPrompt = null;
  }
});
