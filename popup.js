const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');

const workMinutesInput = document.getElementById('workTime');
const workSecondsInput = document.getElementById('workSeconds');
const breakMinutesInput = document.getElementById('breakTime');
const breakSecondsInput = document.getElementById('breakSeconds');

const timerDisplay = document.getElementById('timer');

let isWork = true;

// Debounce helper function
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

function getDuration() {
  const workMinutes = parseInt(workMinutesInput.value) || 0;
  const workSeconds = parseInt(workSecondsInput.value) || 0;
  const breakMinutes = parseInt(breakMinutesInput.value) || 0;
  const breakSeconds = parseInt(breakSecondsInput.value) || 0;

  return {
    workDuration: workMinutes * 60 + workSeconds,
    breakDuration: breakMinutes * 60 + breakSeconds,
  };
}

function updateTimerDisplay(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function saveInputs() {
  chrome.storage.local.set({
    workMinutes: workMinutesInput.value,
    workSeconds: workSecondsInput.value,
    breakMinutes: breakMinutesInput.value,
    breakSeconds: breakSecondsInput.value,
  });
}

startBtn.addEventListener('click', () => {
  const durations = getDuration();
  const duration = isWork ? durations.workDuration : durations.breakDuration;

  if (duration <= 0) {
    alert('Please set a time greater than 0.');
    return;
  }

  chrome.runtime.sendMessage({ command: 'start', duration, isWork, ...durations });
});

pauseBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ command: 'pause' });
});

resetBtn.addEventListener('click', () => {
  const durations = getDuration();
  const duration = isWork ? durations.workDuration : durations.breakDuration;
  chrome.runtime.sendMessage({ command: 'reset', duration, isWork });
  updateTimerDisplay(duration);
});

// Listen for background messages to update timer or switch mode
chrome.runtime.onMessage.addListener((request) => {
  if (request.command === 'switchMode') {
    isWork = request.isWork;
    updateTimerDisplay(request.timeLeft);
    alert(isWork ? "Work time! Let's focus." : "Break time! Relax a bit.");
  }
});

function requestTimeLeft() {
  chrome.runtime.sendMessage({ command: 'getTimeLeft' }, (response) => {
    if (response && typeof response.timeLeft === 'number') {
      updateTimerDisplay(response.timeLeft);
      isWork = response.isWork;
    }
  });
}

const inputs = [
  workMinutesInput,
  workSecondsInput,
  breakMinutesInput,
  breakSecondsInput
];

const debouncedInputHandler = debounce(() => {
  const durations = getDuration();
  const duration = isWork ? durations.workDuration : durations.breakDuration;
  chrome.runtime.sendMessage({ command: 'reset', duration, isWork });
  updateTimerDisplay(duration);
  saveInputs();
}, 250);

inputs.forEach(input => {
  input.addEventListener('input', debouncedInputHandler);
});

// Load saved inputs when popup opens
chrome.storage.local.get(
  ['workMinutes', 'workSeconds', 'breakMinutes', 'breakSeconds'],
  (data) => {
    if (data.workMinutes !== undefined) workMinutesInput.value = data.workMinutes;
    if (data.workSeconds !== undefined) workSecondsInput.value = data.workSeconds;
    if (data.breakMinutes !== undefined) breakMinutesInput.value = data.breakMinutes;
    if (data.breakSeconds !== undefined) breakSecondsInput.value = data.breakSeconds;

    // Update timer display based on loaded values
    const durations = getDuration();
    const duration = isWork ? durations.workDuration : durations.breakDuration;
    updateTimerDisplay(duration);
  }
);

// Update timer display every second
setInterval(requestTimeLeft, 1000);

// Also request time immediately on popup load
requestTimeLeft();
