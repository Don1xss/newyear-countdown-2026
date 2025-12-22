const music = document.getElementById('music');
const musicBtn = document.getElementById('musicBtn');
const message = document.getElementById('message');

const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

let userAllowedMusic = false;
let musicStarted = false;
let fireworksStarted = false;

const targetDate = new Date('2026-01-01T00:00:00');

musicBtn.onclick = () => {
  userAllowedMusic = true;
  musicBtn.textContent = 'Музыка готова 🎧';
  musicBtn.disabled = true;
};

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    daysEl.textContent = 0;
    hoursEl.textContent = 0;
    minutesEl.textContent = 0;
    secondsEl.textContent = 0;

    message.textContent = '🎆 С Новым 2026 годом! 🎆';

    if (userAllowedMusic && !musicStarted) {
      music.play();
      musicStarted = true;
    }

    if (!fireworksStarted) {
      startFireworks();
      fireworksStarted = true;
    }

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
}

updateCountdown();
setInterval(updateCountdown, 1000);

const snowContainer = document.getElementById('snow');

function createSnowflake() {
  const snowflake = document.createElement('div');
  snowflake.className = 'snowflake';
  snowflake.textContent = '❄';

  snowflake.style.left = Math.random() * window.innerWidth + 'px';
  snowflake.style.fontSize = Math.random() * 14 + 10 + 'px';
  snowflake.style.opacity = Math.random();
  snowflake.style.animationDuration =
    Math.random() * 5 + 6 + 's';

  snowContainer.appendChild(snowflake);

  setTimeout(() => {
    snowflake.remove();
  }, 12000);
}

setInterval(createSnowflake, 200);

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

  setTimeout(() => {
    star.remove();
  }, 5000);
}

setInterval(createStar, 500);

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

  setTimeout(() => {
    firework.remove();
  }, 2000);
}

function startFireworks() {
  setInterval(createFirework, 300);
}

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

const quizQuestions = [
  {
    question: 'Когда отмечается Новый год?',
    options: ['1 января', '31 декабря', '25 декабря'],
    answer: '1 января'
  },
  {
    question: 'Кто приносит подарки на Новый год?',
    options: ['Дед Мороз', 'Санта Клаус', 'Оба варианта'],
    answer: 'Оба варианта'
  },
  {
    question: 'Что является символом Нового года?',
    options: ['Ёлка', 'Пасхальное яйцо', 'Тыква'],
    answer: 'Ёлка'
  }
];

let currentQuizIndex = 0;
let quizScore = 0;

const quizQuestionEl = document.getElementById('quizQuestion');
const quizOptionsEl = document.getElementById('quizOptions');
const quizScoreEl = document.getElementById('quizScore');
const nextQuizBtn = document.getElementById('nextQuiz');

function loadQuizQuestion() {
  if (currentQuizIndex >= quizQuestions.length) {
    quizQuestionEl.textContent = 'Quiz завершён!';
    quizOptionsEl.innerHTML = '';
    nextQuizBtn.style.display = 'none';
    return;
  }

  const q = quizQuestions[currentQuizIndex];
  quizQuestionEl.textContent = q.question;
  quizOptionsEl.innerHTML = '';
  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.addEventListener('click', () => checkQuizAnswer(opt));
    quizOptionsEl.appendChild(btn);
  });
}

function checkQuizAnswer(selected) {
  const q = quizQuestions[currentQuizIndex];
  if (selected === q.answer) {
    quizScore += 10;
    quizScoreEl.textContent = `Счёт: ${quizScore}`;
    showNotification('Правильно!');
  } else {
    showNotification('Неправильно!', 'error');
  }
  currentQuizIndex++;
  loadQuizQuestion();
}

nextQuizBtn.addEventListener('click', () => {
  currentQuizIndex++;
  loadQuizQuestion();
});

loadQuizQuestion();

function showNotification(msg, type = 'success') {
  const notif = document.getElementById('notification');
  notif.textContent = msg;
  notif.className = `notification ${type}`;
  notif.style.display = 'block';
  setTimeout(() => {
    notif.style.display = 'none';
  }, 3000);
}