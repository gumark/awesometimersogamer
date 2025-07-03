const workInput = document.getElementById('workTime');
const breakInput = document.getElementById('breakTime');
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');

let timer = null;
let isRunning = false;
let isWork = true;
let timeLeft = parseInt(workInput.value) * 60;

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}

function switchMode() {
  isWork = !isWork;
  timeLeft = isWork ? parseInt(workInput.value) * 60 : parseInt(breakInput.value) * 60;
  alert(isWork ? "Work time! Let's focus." : 'Break time! Relax a bit.');
  updateTimerDisplay();
  startTimer();
}

function tick() {
  if (timeLeft > 0) {
    timeLeft--;
    updateTimerDisplay();
  } else {
    clearInterval(timer);
    isRunning = false;
    switchMode();
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
  timeLeft = isWork ? parseInt(workInput.value) * 60 : parseInt(breakInput.value) * 60;
  updateTimerDisplay();
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

updateTimerDisplay();
