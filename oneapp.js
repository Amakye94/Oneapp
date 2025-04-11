let timer;
let isWorking = true;
let currentTime = 0;

const timerDisplay = document.getElementById("timerDisplay");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");

startButton.addEventListener("click", () => {
  const workInput = parseInt(document.getElementById("workInput").value) * 60;
  const breakInput = parseInt(document.getElementById("breakInput").value) * 60;

  currentTime = isWorking ? workInput : breakInput;

  startButton.disabled = true;

  if (timer) clearInterval(timer);

  timer = setInterval(() => {
    currentTime--;
    updateTimerDisplay(currentTime);

    if (currentTime <= 0) {
      clearInterval(timer);
      isWorking = !isWorking;

      playBeep();
      sendNotification(isWorking ? "Break over! Let's get back to work." : "Time for a break!");

      startButton.disabled = false;
    }
  }, 1000);
});

stopButton.addEventListener("click", () => {
  clearInterval(timer);
  startButton.disabled = false;
});

function updateTimerDisplay(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  timerDisplay.textContent = `${formatTime(minutes)}:${formatTime(seconds)}`;
}

function formatTime(time) {
  return time < 10 ? `0${time}` : time;
}

function playBeep() {
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(880, context.currentTime); // A5 note
  gainNode.gain.setValueAtTime(0.1, context.currentTime); // Low volume

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start();
  oscillator.stop(context.currentTime + 0.5); // Beep for 0.5s
}

function sendNotification(message) {
  if (Notification.permission === "granted") {
    new Notification(message);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification(message);
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  Notification.requestPermission();
});
