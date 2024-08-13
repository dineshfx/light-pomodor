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


//time drift adjustment code start

function startTimer(remainingTime) {
    isPaused = false;
    const startTime = Date.now();

    timer = setInterval(function () {
        if (!isPaused) {
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            const timeLeft = remainingTime - elapsedTime;

            if (timeLeft <= 0) {
                clearInterval(timer);
                isPaused = true;
                remainingTime = initialDuration * 60; // Reset remaining time to initial duration
                sessionNumber++;
                self.postMessage({ key: 'completed', value: { sessionNumber, remainingTime, isPaused } });
            } else {
                self.postMessage({ key: 'remainingTime', value: timeLeft });
            }
        }
    }, 1000);
}



//time drift adjustment code ends




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




