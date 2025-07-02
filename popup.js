const workDuration = 25 * 60; // 25 minutes in seconds

let timeLeft = workDuration;
let timer = null;
let isRunning = false;

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');

function updateTimer() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
}

function tick() {
  if (timeLeft > 0) {
    timeLeft--;
    updateTimer();
  } else {
    clearInterval(timer);
    isRunning = false;
    alert("Time's up! Take a break.");
  }
}

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    timer = setInterval(tick, 1000);
  }
}

function pauseTimer() {
  if (isRunning) {
    clearInterval(timer);
    isRunning = false;
  }
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  timeLeft = workDuration;
  updateTimer();
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

updateTimer();
