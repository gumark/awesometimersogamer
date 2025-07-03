let timer = null;
let timeLeft = 0;
let isWork = true;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === "start") {
    if (!timer && request.duration > 0) {
      timeLeft = request.duration;
      isWork = request.isWork;
      timer = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
          clearInterval(timer);
          timer = null;
          showNotification(
            isWork ? "Work session ended!" : "Break session ended!"
          );
          // Automatically switch mode and restart timer
          isWork = !isWork;
          timeLeft = request.workDuration; // default to workDuration
          if (!isWork) timeLeft = request.breakDuration;
          // Send message to popup to update UI
          chrome.runtime.sendMessage({
            command: "switchMode",
            isWork,
            timeLeft,
          });
          timer = setInterval(tick, 1000);
        }
      }, 1000);
    }
    sendResponse({ status: "started" });
  } else if (request.command === "pause") {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    sendResponse({ status: "paused" });
  } else if (request.command === "reset") {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    timeLeft = request.duration;
    isWork = request.isWork;
    sendResponse({ status: "reset" });
  } else if (request.command === "getTimeLeft") {
    sendResponse({ timeLeft, isWork });
  }
});

function tick() {
  timeLeft--;
  if (timeLeft <= 0) {
    clearInterval(timer);
    timer = null;
    showNotification(isWork ? "Work session ended!" : "Break session ended!");
    // Switching modes handled in message listener above for simplicity
  }
}

function showNotification(message) {
  chrome.notifications.create("", {
    type: "basic",
    iconUrl: "icon.png",
    title: "Pomodoro Timer",
    message,
  });
  
if (request.command === 'getTimeLeft') {
    sendResponse({ timeLeft, isWork });
  }
}
