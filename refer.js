var isPaused = true;
var initialDuration = 60; // Default duration in minutes
var remainingTime = initialDuration * 60;
var sessionNumber = 1;
var audio = new Audio('supermario.wav');





function togglePlayPause() {
  var playPauseButton = document.querySelector('#toggle');


  if (isPaused) {
    playPauseButton.textContent = 'Pause';
    startTimer();
    
    document.getElementById('add').disabled = true;
    document.getElementById('sub').disabled = true;
  } else {
    playPauseButton.textContent = 'Play';
    document.getElementById('add').disabled = false;
    document.getElementById('sub').disabled = false;
  
    isPaused = true;

    


    clearInterval(timer);
    saveToLocalStorage();

  }
}

function startTimer() {
  stopAlarm();
  isPaused = false;
  var display = document.getElementById('timer');



  clearInterval(timer);
  timer = setInterval(function () {
    if (!isPaused) {

    

      remainingTime--;

      if (remainingTime < 0) {
        clearInterval(timer);
        display.textContent = 'Session ' + sessionNumber + ' Completed';
        playAlarm();
        //showNotification();
        isPaused = true;
        document.querySelector('#toggle').textContent = 'Play';
        remainingTime = initialDuration * 60; // Reset remaining time to initial duration
        sessionNumber++;
        updateSessionNumberUI(sessionNumber);
        saveToLocalStorage();
       
      } else {
        display.textContent = formatTime(remainingTime);
        saveToLocalStorage();
      }
    }
  }, 1000);
}

function formatTime(seconds) {
  var minutes = parseInt(seconds / 60, 10);
  var remainingSeconds = seconds % 60;

  minutes = minutes < 10 ? "0" + minutes : minutes;
  remainingSeconds = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

  return minutes + ":" + remainingSeconds;
}

function resetTimer() {
  stopAlarm();
  isPaused = true;
  clearInterval(timer);
  var display = document.getElementById('timer');
  remainingTime = initialDuration * 60;
  display.textContent = formatTime(remainingTime);
  document.querySelector('#toggle').textContent = 'Play';
  document.getElementById('add').disabled = false;
  document.getElementById('sub').disabled = false;
  saveToLocalStorage();
}

function resetTimer2() {
  stopAlarm();
  isPaused = true;
  clearInterval(timer);
  var display = document.getElementById('timer');

  display.textContent = formatTime(remainingTime);

  document.querySelector('#toggle').textContent = 'Play';
  saveToLocalStorage();
}



function incrementSession() {
  var sessionNumberElement = document.getElementById("sessionNumber");
  sessionNumberElement.textContent = parseInt(sessionNumberElement.textContent) + 1;
  sessionNumber = parseInt(sessionNumberElement.textContent, 10);
  saveToLocalStorage();
   resetTimer();

}


function decrementSession() {
  var sessionNumberElement = document.getElementById("sessionNumber");

  if (parseInt(sessionNumberElement.textContent) > 1) {

    sessionNumberElement.textContent = sessionNumber - 1;
    sessionNumber = parseInt(sessionNumberElement.textContent, 10);
    saveToLocalStorage();
    
    resetTimer();
  }
}


function updateSessionNumberUI(ssno) {


  document.getElementById('sessionNumber').textContent = ssno;
  saveToLocalStorage();
}

function saveToLocalStorage() {
  localStorage.setItem('pomodoroTimerState', JSON.stringify({
    isPaused: isPaused,
    remainingTime: remainingTime,
    sessionNumber: sessionNumber
  }));
}

function loadFromLocalStorage() {
  var savedState = localStorage.getItem('pomodoroTimerState');
  if (savedState) {
    savedState = JSON.parse(savedState);
    isPaused = savedState.isPaused;
    remainingTime = savedState.remainingTime;
    sessionNumber = savedState.sessionNumber;

    var display = document.getElementById('timer');
    display.textContent = formatTime(remainingTime);

    var playPauseButton = document.querySelector('#toggle');
    playPauseButton.textContent = isPaused ? 'Play' : 'Pause';

    var sessionNumberDiv = document.getElementById('sessionNumber');
    sessionNumberDiv.textContent = sessionNumber;
  }
}

function playAlarm() {
  // Replace 'path_to_alarm_sound.mp3' with the actual path to your alarm sound file
  audio.play();
}

function stopAlarm() {
  audio.pause();
  audio.currentTime = 0; // Reset the playback to the beginning
}


// Function to show a notification
function showNotification() {
// Check if the browser supports notifications
if (!("Notification" in window)) {
console.log("This browser does not support desktop notification");
return;
}

// Check if notifications are allowed, if not, request permission
if (Notification.permission !== "granted") {
Notification.requestPermission().then(function (permission) {
  if (permission === "granted") {
    // If permission is granted, show the notification
    var notification = new Notification("Pomodoro Timer", {
      body: "Your timer has finished!",
    });
  }
});
} else {
// If permission is already granted, show the notification
var notification = new Notification("Pomodoro Timer", {
  body: "Your timer has finished!",
});

console.log('sending...')
}
}


// Load state from localStorage on page load
window.onload = function () {

  
  loadFromLocalStorage();
  if (!isPaused) {
    resetTimer2();
  
  }
};