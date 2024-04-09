let timer;
let isPaused = true;
let initialDuration = 0.1; // Default duration in minutes
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

function startTimer(remainingTime) {
    isPaused = false;

    timer = setInterval(function () {
        if (!isPaused) {
            remainingTime--;

            if (remainingTime < 0) {
                clearInterval(timer);
                isPaused = true;
                remainingTime = initialDuration * 60; // Reset remaining time to initial duration
                sessionNumber++;
                self.postMessage({key:'completed',value:{sessionNumber,remainingTime,isPaused}});
                // showNotification();
                

            } else {
                self.postMessage({key:'remainingTime',value:remainingTime});
            }
        }
    }, 1000);
}


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




