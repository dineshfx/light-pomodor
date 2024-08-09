let timer;
let isPaused = true;
let initialDuration = 60; // Default duration in minutes
let remainingTime = initialDuration * 60;
let sessionNumber = 1;


self.addEventListener('message', function (e) {
    switch (e.data.key) {
    

            case 'toggle':
                togglePause(e.data.value);
                break;
                case 'clearInterval':
                clean(e.data.value);
                break;

                case 'updateSession':
                    sessionNumber = e.data.value;
                    break;
      
        default:
            break;
    }
});

// function startTimer(remainingTime) {
//     isPaused = false;

//     timer = setInterval(function () {
//         if (!isPaused) {
//             remainingTime--;

//             if (remainingTime < 0) {
//                 clearInterval(timer);
//                 isPaused = true;
//                 remainingTime = initialDuration * 60; // Reset remaining time to initial duration
//                 sessionNumber++;
//                 self.postMessage({key:'completed',value:{sessionNumber,remainingTime,isPaused}});
//                 // showNotification();
                

//             } else {
//                 self.postMessage({key:'remainingTime',value:remainingTime});
//             }
//         }
//     }, 1000);
// }

//new logic start
function startTimer(remainingTime) {
    isPaused = false;
    const startTime = performance.now(); // Get the start time in milliseconds
    let lastUpdateTime = startTime; // Track the last time the timer was updated

    function updateTimer() {
        if (!isPaused) {
            const currentTime = performance.now(); // Get the current time in milliseconds
            const elapsedTime = Math.floor((currentTime - startTime) / 1000); // Calculate elapsed time in seconds
            const timeSinceLastUpdate = currentTime - lastUpdateTime; // Calculate time since last update

            if (timeSinceLastUpdate >= 1000) { // Check if 1 second has passed
                remainingTime--; // Decrement remaining time by 1 second
                lastUpdateTime = currentTime; // Update the last update time

                if (remainingTime < 0) {
                    isPaused = true;
                    remainingTime = initialDuration * 60; // Reset remaining time to initial duration
                    sessionNumber++;
                    self.postMessage({key: 'completed', value: {sessionNumber, remainingTime, isPaused}});
                    return; // Stop the update loop by returning from the function

                } else {
                    self.postMessage({key: 'remainingTime', value: remainingTime});
                }
            }

            requestAnimationFrame(updateTimer); // Schedule the next update
        }
    }

    requestAnimationFrame(updateTimer); // Start the update loop
}


//new logic ends



function togglePause(remainingTime){
   
    if(isPaused){
        startTimer(remainingTime);
        self.postMessage({key:'isPaused', value:isPaused})
    }else{

        isPaused = true;
        clearInterval(timer);
        self.postMessage({key:'isPaused', value:isPaused})
    }
}




function clean(pauseState){

    isPaused = pauseState;

    clearInterval(timer);
}


function showNotification(){

    var notification = new Notification("Pomodoro Timer", {
        body: "Your timer has finished!",
    });
}




