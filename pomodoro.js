
var timer;
var isPaused = true;
var initialDuration = 60; // Default duration in minutes
var remainingTime = initialDuration * 60;
var sessionNumber;

let worker;

let audio;
audio = new Audio('alarm.wav');

//end time calculat logic starts

let InitialEndTimerInterval;
let isIntervalRunning = false;
let previousRemainingTime = null;


function calculateEndTime(secondsRemainings) {
  const now = new Date(); // Current time
  const endTime = new Date(now.getTime() + secondsRemainings * 1000); // Add remaining seconds
  return endTime;
}
function formatDateForEndtime(date) {
  // Format date in 12-hour format with AM/PM
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = (hours % 12 || 12); // Convert 24-hour time to 12-hour time
  return `${formattedHours}:${minutes}:${seconds} ${ampm}`;
}


function endTimeCalculator(remainingTimeEndTime){

  const endTime = calculateEndTime(parseInt(remainingTimeEndTime));
  document.getElementById('end-timer').textContent = formatDateForEndtime(endTime);
}


function endTimeIntervalFunction(remainingTime){
  //endTimeCalculator(remainingTime);
  isIntervalRunning = true;
  InitialEndTimerInterval = setInterval(()=>{
    endTimeCalculator(remainingTime);

  },300)
  //adjust interval second to achieve realtime timer end time 300 is perfect
}



//endtime calculator logic ends




var prom = new Promise((resolve,reject)=>{

  setTimeout(()=>{
    resolve('yes');
  },1000)

});


document.addEventListener('keydown', function(event) {
  if (event.key === ' ' || event.key === 'Spacebar') {


      event.preventDefault();
  }
});





worker = new Worker('timerWorker.js');
worker.onmessage = function (event) {
          if (event.data.key === 'completed') {
              // Handle timer completion
             // document.getElementById('timer').textContent = 'Session Completed';

                    //end time logic start
             //clearInterval(InitialEndTimerInterval);
             endTimeIntervalFunction(initialDuration * 60);
             //end time Logic end




              document.querySelector('#toggle').textContent = 'Play';
              updateSessionNumberUI(event.data.value.sessionNumber);
              sessionNumber = event.data.value.sessionNumber;
              remainingTime = event.data.value.remainingTime;


              isPaused = event.data.value.isPaused;

              var display = document.getElementById('timer');
            
              display.textContent = formatTime(remainingTime);


              document.getElementById('add').disabled = false;
              document.getElementById('sub').disabled = false;

              saveToLocalStorage();
              playAlarm();
              //showNotification();
              
       

  postMessageToServiceWorker({ key: 'showNotification' });





              if(sessionNumber > 1){

                document.getElementById('sessionCompleted').textContent = sessionNumber - 1;
              }else{
                document.getElementById('sessionCompleted').textContent  = "None";
              }


          } 
        else if(event.data.key=='remainingTime') {

          //old code start
              // Update timer display
              // console.log(event.data.value)
              // endTimeCalculator(event.data.value);
              // updateTimer(event.data.value);
              // remainingTime = event.data.value;
          //old code end

     //new code Starts
     // Get the current remaining time from the message data
        const currentRemainingTime = event.data.value;
        
        // Log the current remaining time
        //console.log(currentRemainingTime);
        
        // Check if previousRemainingTime is not null
        if (previousRemainingTime !== null) {
            // Compare with previousRemainingTime
            if (currentRemainingTime === previousRemainingTime) {
                console.log('Remaining time is the same as the previous value.');
            }
        }
        
        // Update previousRemainingTime to the current value
        previousRemainingTime = currentRemainingTime;
        
        // Perform other updates
        endTimeCalculator(currentRemainingTime);
        updateTimer(currentRemainingTime);
        remainingTime = event.data.value;
//new code ends



          } else if(event.data.key=='isPaused') {
            // Update timer display

           isPaused = event.data.value;
        

        }else{
          console.log('nothing')
        }
      };
  
      // Load state from localStorage on page load - starting point
      notificationPermission();
      // audio = new Audio('alarm.wav');
      loadFromLocalStorage();
      if (!isPaused) {
          resetTimer2();
      }
  


  function updateTimer(remainingTime_update) {
    const minutes = Math.floor(remainingTime_update / 60);
    const seconds = remainingTime_update % 60;
    document.getElementById('timer').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    // endTimeCalculator(remainingTime_update)
    saveToLocalStorageWorker(remainingTime_update);
  }



  


    function togglePlayPauseUI() {
      var playPauseButton = document.querySelector('#toggle');  
      if (isPaused) {
        playPauseButton.textContent = 'Pause'; 
        
        document.getElementById('add').disabled = true;
        document.getElementById('sub').disabled = true;

        //endtimer interval clear code
        isIntervalRunning = false;
        clearInterval(InitialEndTimerInterval);
        
      } else {
        playPauseButton.textContent = 'Play';
        document.getElementById('add').disabled = false;
        document.getElementById('sub').disabled = false;
        //console.log(remainingTime)
        endTimeIntervalFunction(remainingTime);

      }

    }


    function togglePlayPause() {





      togglePlayPauseUI();
      if (worker) {

        
        worker.postMessage({ key: 'toggle', value: remainingTime });

  

      }
  }





    function formatTime(seconds) {
      var minutes = parseInt(seconds / 60, 10);
      var remainingSeconds = seconds % 60;

      minutes = minutes < 10 ? "0" + minutes : minutes;
      remainingSeconds = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

      return minutes + ":" + remainingSeconds;
    }

    // function resetTimer() {
    //   stopAlarm();
      
    //   worker.postMessage({key:'clearInterval',value:isPaused},);
    //   var display = document.getElementById('timer');
    //   var remainingTime2 = initialDuration * 60;
    //   display.textContent = formatTime(remainingTime2);
    //   document.querySelector('#toggle').textContent = 'Play';
    //   document.getElementById('add').disabled = false;
    //   document.getElementById('sub').disabled = false;
    //   saveToLocalStorage();

    //   clearInterval(InitialEndTimerInterval);
    //   endTimeIntervalFunction(remainingTime);
  
    // }

    function resetTimerUI() {

      //
      remainingTime = initialDuration * 60;

      if(isIntervalRunning){
        console.log("yes Interval running");
        isIntervalRunning = false;
        clearInterval(InitialEndTimerInterval);
    
      }else{
        console.log("No Interval is not running");
        
      }
      

      endTimeIntervalFunction(initialDuration * 60);
 



      stopAlarm();
      isPaused = true;
      worker.postMessage({key:'clearInterval',value:isPaused});
      var display = document.getElementById('timer');

      display.textContent = formatTime(remainingTime);
      document.querySelector('#toggle').textContent = 'Play';
      document.getElementById('add').disabled = false;
      document.getElementById('sub').disabled = false;
      saveToLocalStorageWorker(remainingTime);

 
    }





    function resetTimer2() {
      stopAlarm();
      isPaused = true;
    
      worker.postMessage({key:'clearInterval',value:isPaused});
      var display = document.getElementById('timer');

      display.textContent = formatTime(remainingTime);

      document.querySelector('#toggle').textContent = 'Play';

      document.getElementById('add').disabled = false;
      document.getElementById('sub').disabled = false;
      // saveToLocalStorage();
    }



    function incrementSession() {
      var sessionNumberElement = document.getElementById("sessionNumber");
      sessionNumberElement.textContent = parseInt(sessionNumberElement.textContent) + 1;
      sessionNumber = parseInt(sessionNumberElement.textContent, 10);
      worker.postMessage({key:'updateSession',value:sessionNumber});
      saveToLocalStorage();
      resetTimerUI();

      if(sessionNumber > 1){

        document.getElementById('sessionCompleted').textContent = sessionNumber - 1;
      }else{
        document.getElementById('sessionCompleted').textContent  = "None";
      }

    }


    function decrementSession() {
      var sessionNumberElement = document.getElementById("sessionNumber");
   
      if (parseInt(sessionNumberElement.textContent) > 1) {

        sessionNumberElement.textContent = sessionNumber - 1;
        sessionNumber = parseInt(sessionNumberElement.textContent, 10);

        worker.postMessage({key:'updateSession',value:sessionNumber});
        saveToLocalStorage();
        
        resetTimerUI();


        if(sessionNumber > 1){

          document.getElementById('sessionCompleted').textContent = sessionNumber - 1;
        }else{
          document.getElementById('sessionCompleted').textContent  = "None";
        }

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

    function saveToLocalStorageWorker(remainingTime) {
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
                
        //end Timer Logic
        // endTimeCalculator(remainingTime);
        endTimeIntervalFunction(remainingTime);
        //end timer logic ends
     

        var display = document.getElementById('timer');
        display.textContent = formatTime(remainingTime);

        var playPauseButton = document.querySelector('#toggle');
        playPauseButton.textContent = isPaused ? 'Play' : 'Pause';
        console.log(isPaused);

        var sessionNumberDiv = document.getElementById('sessionNumber');
        sessionNumberDiv.textContent = sessionNumber;

        worker.postMessage({key:'updateSession',value:savedState.sessionNumber});

        if(savedState.sessionNumber > 1){

          document.getElementById('sessionCompleted').textContent = savedState.sessionNumber - 1;
        }else{
          document.getElementById('sessionCompleted').textContent  = "None";
        }



      

      }else{

        var display = document.getElementById('timer');
        display.textContent = formatTime(remainingTime);

        var sessionNumberDiv = document.getElementById('sessionNumber');
        sessionNumberDiv.textContent = 1;
        worker.postMessage({key:'updateSession',value:1});
        sessionNumber = 1;
   
          document.getElementById('sessionCompleted').textContent  = "None";

          endTimeCalculator(remainingTime);
          endTimeIntervalFunction(remainingTime);
       
        
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





    // Load state from localStorage on page load
    window.onload = function () {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(function (registration) {
                console.log('Service Worker registered with scope:', registration.scope);
               
                navigator.serviceWorker.addEventListener("controllerchange", (evt) => {
                  console.log("controller changed");
                  this.controller = navigator.serviceWorker.controller;
              });



            }).catch(function (error) {
                console.error('Service Worker registration failed:', error);
            });
      }

      navigator.serviceWorker.getRegistration().then(function(registration) {
        if (registration) {
        
            console.log('Service Worker state:', registration.active.state);
        } else {
            console.log('No service worker registered.');
        }
    }).catch(function(error) {
        console.error('Error while getting service worker registration:', error);
    });
      
      
    
    };



  //   function showNotification() {

  //     if (navigator.serviceWorker.controller) {
  //       navigator.serviceWorker.controller.postMessage({ key: 'showNotification' });
  //   } else {
  //       console.error('Service Worker controller is null.');
  //   }
    

  // }






  // Function to post message to service worker
  function postMessageToServiceWorker(message) {
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage(message);
    } else {
        console.warn('Service Worker controller is not available yet. Message will be delayed.');

        navigator.serviceWorker.addEventListener('controllerchange', function() {
          console.log('Service Worker controller changed. Posting delayed message...');
          
          // Now that the controller is available, post the message
          navigator.serviceWorker.controller.postMessage(message);
      });

    }
}


// Example usage: Post a message to the service worker


  
  function notificationPermission() {
  
    if (Notification.permission !== "granted") {
        Notification.requestPermission().then(function (permission) {
           console.log('user has given the notification permission');
        });
    } 
}