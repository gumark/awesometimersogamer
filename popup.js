const workMinutesInput = document.getElementById('workTime');
const workSecondsInput = document.getElementById('workSeconds');
const breakMinutesInput = document.getElementById('breakTime');
const breakSecondsInput = document.getElementById('breakSeconds');

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');

let timer = null;
let isRunning = false;
let isWork = true;
let timeLeft = 0;

function getTimeFromInputs(minutesInput, secondsInput) {
  const minutes = parseFloat(minutesInput.value) || 0;
  const seconds = parseInt(secondsInput.value) || 0;
  return Math.floor(minutes) * 60 + seconds;
}

function updateTimeLeft() {
  timeLeft = isWork
    ? getTimeFromInputs(workMinutesInput, workSecondsInput)
    : getTimeFromInputs(breakMinutesInput, breakSecondsInput);
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
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
    updateTimeLeft();
    if (timeLeft <= 0) {
      alert("Please set a time greater than 0.");
      return;
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
  updateTimeLeft();
  updateTimerDisplay();
}

function switchMode() {
  isWork = !isWork;
  updateTimeLeft();
  alert(isWork ? "Work time! Let's focus." : "Break time! Relax a bit.");
  updateTimerDisplay();
  startTimer();
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

updateTimeLeft();
updateTimerDisplay();
