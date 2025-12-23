// js/app.js — с этапами событий по таймеру

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

musicBtn.onclick = () => {
  userAllowedMusic = true;
  musicBtn.textContent = 'Музыка играет 🎶';
  musicBtn.disabled = true;

  backgroundMusic.volume = 0.4;
  backgroundMusic.play().catch(() => {});
};

function checkStages() {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0 && !stageNewYear) {
    stageNewYear = true;
    message.textContent = '🎆 С Новым 2026 годом! 🎆';
    finalCountdownOverlay.style.display = 'none';

    if (userAllowedMusic && !isNewYearMusicPlaying) {
      isNewYearMusicPlaying = true;
      const fadeOut = setInterval(() => {
        if (backgroundMusic.volume > 0.05) backgroundMusic.volume -= 0.05;
        else {
          backgroundMusic.pause();
          clearInterval(fadeOut);
          newyearMusic.volume = 0;
          newyearMusic.play();
          const fadeIn = setInterval(() => {
            if (newyearMusic.volume < 0.6) newyearMusic.volume += 0.05;
            else clearInterval(fadeIn);
          }, 200);
        }
      }, 200);
    }

    if (!fireworksStarted) {
      startFireworks();
      fireworksStarted = true;
    }
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);

  // 24 часа (86400 секунд)
  if (totalSeconds <= 86400 && !stage24Hours) {
    stage24Hours = true;
    body.classList.add('bright-mode');
    showNotification('До Нового года осталось 24 часа! Сайт стал ярче 🎉');
  }

  // 1 час (3600 секунд)
  if (totalSeconds <= 3600 && !stage1Hour) {
    stage1Hour = true;
    snowInterval = 100; // Ускоряем снег
    showNotification('Остался 1 час! Снег идёт быстрее ❄️');
  }

  // 10 минут (600 секунд)
  if (totalSeconds <= 600 && !stage10Minutes) {
    stage10Minutes = true;
    topGarland.classList.add('garland-flash');
    bottomGarland.classList.add('garland-flash');
    showNotification('10 минут до Нового года! Гирлянды мигают ✨');
  }

  // 10 секунд
  if (totalSeconds <= 10 && !stage10Seconds) {
    stage10Seconds = true;
    finalCountdownOverlay.style.display = 'flex';
    let count = 10;
    const countdownInterval = setInterval(() => {
      finalCountdownNumber.textContent = count;
      count--;
      if (count < 0) {
        clearInterval(countdownInterval);
        finalCountdownNumber.textContent = 'С Новым годом!';
      }
    }, 1000);
  }
}

let snowInterval = 200; // Начальная скорость снега

function createSnowflake() {
  const snowflake = document.createElement('div');
  snowflake.className = 'snowflake';
  snowflake.textContent = '❄';
  snowflake.style.left = Math.random() * window.innerWidth + 'px';
  snowflake.style.fontSize = Math.random() * 14 + 10 + 'px';
  snowflake.style.opacity = Math.random();
  snowflake.style.animationDuration = Math.random() * 5 + 6 + 's';
  document.getElementById('snow').appendChild(snowflake);
  setTimeout(() => snowflake.remove(), 12000);
}

setInterval(createSnowflake, snowInterval);

// Остальные функции (звёзды, фейерверки, память, квиз) остаются без изменений

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

  checkStages(); // Проверяем этапы на каждом тике секунды
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ... (остальной код: звёзды, фейерверки, вкладки, память, квиз, уведомления — без изменений)
// === Снег ===
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

setInterval(createSnowflake, 200);

// === Звёзды ===
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

// === Фейерверки ===
const fireworksContainer = document.getElementById('fireworks');

function createFirework() {
  const firework = document.createElement('div');
  firework.className = 'firework';
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  firework.style.backgroundColor = color;
  firework.style.left = Math.random() * window.innerWidth + 'px';
  firework.style.top = Math.random() * window.innerHeight * 0.7 + 'px';
  firework.style.animationDuration = Math.random() * 1 + 1 + 's';

  fireworksContainer.appendChild(firework);

  setTimeout(() => firework.remove(), 2000);
}

function startFireworks() {
  setInterval(createFirework, 300);
}

// === Переключение вкладок ===
const countdownTab = document.getElementById('countdownTab');
const gamesTab = document.getElementById('gamesTab');
const countdownBtn = document.getElementById('countdownBtn');
const gamesBtn = document.getElementById('gamesBtn');

countdownBtn.addEventListener('click', () => {
  countdownTab.style.display = 'block';
  gamesTab.style.display = 'none';
  countdownBtn.classList.add('active');
  gamesBtn.classList.remove('active');
});

gamesBtn.addEventListener('click', () => {
  countdownTab.style.display = 'none';
  gamesTab.style.display = 'block';
  countdownBtn.classList.remove('active');
  gamesBtn.classList.add('active');
});

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
// js/app.js — с общим прогрессом, уровнями и профилем

// ... (предыдущий код: отсчёт, снег, музыка, этапы событий — остаётся)

// === SUPABASE ИНТЕГРАЦИЯ ===
const SUPABASE_URL = 'https://kfhkuqcqzhsmjeaiuufz.supabase.co';  // ← ВСТАВЬ СВОЙ URL
const SUPABASE_ANON_KEY = 'sb_publishable_E_QSjBIxInHDCwj2cvobig_pDCMJioU';              // ← ВСТАВЬ СВОЙ КЛЮЧ

let userData = {
  id: null,
  name: '',
  character: 'tree',
  totalScore: 0,
  memoryHighScore: 0,
  quizHighScore: 0
};

// Загрузка локальных данных
if (localStorage.getItem('newyearUserData')) {
  const local = JSON.parse(localStorage.getItem('newyearUserData'));
  Object.assign(userData, local);
  applyPersonalization();
  updateProgressDisplay();
} else {
  document.getElementById('personalizationModal').style.display = 'flex';
}

// Сохранение в Supabase + localStorage
async function saveUserData() {
  // Локальное сохранение
  localStorage.setItem('newyearUserData', JSON.stringify(userData));
  updateProgressDisplay();

  // Отправка на сервер
  try {
    let url = `${SUPABASE_URL}/rest/v1/users`;
    let method = 'POST';

    if (userData.id) {
      method = 'PATCH';
      url += `?id=eq.${userData.id}`;
    }

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
        quiz_high: userData.quizHighScore
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (!userData.id && data[0]?.id) {
        userData.id = data[0].id;
        localStorage.setItem('newyearUserData', JSON.stringify(userData));
      }
    }
  } catch (err) {
    console.log('Нет интернета — данные сохранены локально');
    showNotification('Оффлайн-режим: данные сохранены локально', 'error');
  }
}

// Пример использования после рекорда
async function addPoints(points) {
  userData.totalScore += points;
  await saveUserData();
}

// В функциях завершения игр:
async function finishMemoryGame() {
  if (memoryScore > userData.memoryHighScore) {
    userData.memoryHighScore = memoryScore;
    await addPoints(memoryScore);
    showNotification('Новый рекорд! Очки добавлены к общему счёту!');
  }
  updateProgressDisplay();
}

async function finishQuiz() {
  if (quizScore > userData.quizHighScore) {
    userData.quizHighScore = quizScore;
    await addPoints(quizScore);
    showNotification('Новый рекорд в квизе!');
  }
  updateProgressDisplay();
}

// Остальной код (уровни, отображение, этапы, игры) остаётся тем же

// Персонализация
document.getElementById('savePersonalization').addEventListener('click', () => {
  const name = document.getElementById('userNameInput').value.trim();
  const character = document.querySelector('input[name="character"]:checked').value;

  if (name) {
    userData.name = name;
    userData.character = character;
    saveUserData();
    applyPersonalization();
    document.getElementById('personalizationModal').style.display = 'none';
    showNotification(`Добро пожаловать, ${userData.name}! ${getCharacterEmoji()}`);
  } else {
    showNotification('Введите имя!', 'error');
  }
});

function getCharacterEmoji() {
  const emojis = { tree: '🎄', reindeer: '🦌', snowman: '⛄' };
  return emojis[userData.character] || '🎄';
}

function getLevelName(score) {
  if (score >= 200) return 'Легенда Нового года 🌟';
  if (score >= 130) return 'Дед Мороз 🎅';
  if (score >= 60) return 'Эльф 🧝';
  return 'Гость 👤';
}

function applyPersonalization() {
  if (userData.name) {
    document.getElementById('greetingTitle').innerHTML = `${getCharacterEmoji()} ${userData.name}, до Нового года осталось`;
    document.getElementById('playerName').textContent = userData.name;
    document.getElementById('playerCharacter').textContent = getCharacterEmoji();
  }
}

function updateProgressDisplay() {
  const levelName = getLevelName(userData.totalScore);
  document.getElementById('totalScore').textContent = userData.totalScore;
  document.getElementById('levelName').textContent = levelName;

  // Профиль
  document.getElementById('profileName').textContent = userData.name || 'Гость';
  document.getElementById('profileCharacter').textContent = getCharacterEmoji();
  document.getElementById('profileLevel').textContent = levelName;
  document.getElementById('profileTotalScore').textContent = userData.totalScore;
  document.getElementById('profileMemoryHigh').textContent = userData.memoryHighScore;
  document.getElementById('profileQuizHigh').textContent = userData.quizHighScore;

  // Рекорды в играх
  document.getElementById('memoryScore').textContent = `Счёт: ${memoryScore} (Рекорд: ${userData.memoryHighScore})`;
  document.getElementById('quizScore').textContent = `Счёт: ${quizScore} (Рекорд: ${userData.quizHighScore})`;
}

// Добавление очков и обновление уровня
function addPoints(points) {
  userData.totalScore += points;
  saveUserData();
  const newLevel = getLevelName(userData.totalScore);
  const oldLevel = getLevelName(userData.totalScore - points);
  if (newLevel !== oldLevel) {
    showNotification(`Поздравляем! Новый уровень: ${newLevel} 🎉`);
  }
}

// Обновление рекордов и добавление очков
function finishMemoryGame() {
  if (memoryScore > userData.memoryHighScore) {
    userData.memoryHighScore = memoryScore;
    addPoints(memoryScore); // Добавляем текущий счёт как бонус
    showNotification('Новый рекорд в памяти! +очки к общему счёту');
  }
}

function finishQuiz() {
  if (quizScore > userData.quizHighScore) {
    userData.quizHighScore = quizScore;
    addPoints(quizScore);
    showNotification('Новый рекорд в квизе! +очки к общему счёту');
  }
  updateProgressDisplay(); // Обновляем после завершения квиза
}

// Вызови finishMemoryGame() и finishQuiz() в конце соответствующих игр
// Например, в checkMatch при победе, и в loadQuizQuestion при завершении квиза

// Сброс прогресса
document.getElementById('resetProgress').addEventListener('click', () => {
  if (confirm('Сбросить весь прогресс? Это нельзя отменить!')) {
    localStorage.removeItem('newyearUserData');
    location.reload();
  }
});

// Вкладка Профиль
const profileBtn = document.getElementById('profileBtn');
const profileTab = document.getElementById('profileTab');

profileBtn.addEventListener('click', () => {
  document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
  document.querySelectorAll('.tabs button').forEach(btn => btn.classList.remove('active'));
  profileTab.style.display = 'block';
  profileBtn.classList.add('active');
  updateProgressDisplay();
});

// Инициализация
updateProgressDisplay();
