let workDuration = 25 * 60;
let breakDuration = 5 * 60;
let timeLeft = workDuration;
let timer = null;
let isRunning = false;
let isWork = true;

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const workInput = document.getElementById('workTime');
const breakInput = document.getElementById('breakTime');

function updateTimer() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
}

function switchMode() {
  isWork = !isWork;
  if (isWork) {
    timeLeft = workDuration;
    alert("Work time! Focus!");
  } else {
    timeLeft = breakDuration;
    alert("Break time! Relax!");
  }
  updateTimer();
}

function tick() {
  if (timeLeft > 0) {
    timeLeft--;
    updateTimer();
  } else {
    clearInterval(timer);
    isRunning = false;
    switchMode();
    startTimer(); // auto-start next session
  }
}

function startTimer() {
  if (!isRunning) {
    // Update durations from inputs
    workDuration = parseInt(workInput.value) * 60 || 1500;
    breakDuration = parseInt(breakInput.value) * 60 || 300;
    
    // If timer ended, reset timeLeft to current mode duration
    if (timeLeft <= 0) {
      timeLeft = isWork ? workDuration : breakDuration;
    }
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
  // Reset timeLeft to current mode duration based on inputs
  workDuration = parseInt(workInput.value) * 60 || 1500;
  breakDuration = parseInt(breakInput.value) * 60 || 300;
  timeLeft = isWork ? workDuration : breakDuration;
  updateTimer();
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

updateTimer();
