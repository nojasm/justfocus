let btnStart = document.getElementById("button-start");
let timeEl = document.getElementById("main__time");
let timeEditEl = document.getElementById("main__time");

let editMinutes = document.getElementById("edit-min");
let editSeconds = document.getElementById("edit-sec");

let timeMinutesEl = document.getElementById("minutes");
let timeSecondsEl = document.getElementById("seconds");

let timeMinutes = 0;
let timeSeconds = 30;
let timerIsRunning = false;
let t0 = null;

let timeInterval = null;

timeMinutesEl.addEventListener("change", (event) => {
    timeMinutes = parseInt(event.target.value);

    if (timeMinutes > 60) timeMinutes = 60;
    if (timeMinutes < 0) timeMinutes = 0;

    setTimeText(timeMinutes, timeSeconds);
});

timeSecondsEl.addEventListener("change", (event) => {
    timeSeconds = parseInt(event.target.value);

    if (timeSeconds > 60) timeSeconds = 60;
    if (timeSeconds < 0) timeSeconds = 0;

    setTimeText(timeMinutes, timeSeconds);
});

function setTimeText(min, sec) {
    if (min.toString().length == 1) min = "0" + min;
    if (sec.toString().length == 1) sec = "0" + sec;
    
    timeEl.children[0].value = min;
    timeEl.children[2].value = sec;
}

// Change page colors when timer is running
function styleRunning() {
    document.body.style.backgroundColor = "rgb(140, 115, 120)";
    document.getElementById("main").style.backgroundColor = "rgb(170, 127, 135)";
    document.getElementById("main").style.filter = "contrast(0.8)";
}

// Reset page style when timer is not running
function styleDefault() {
    document.body.style.backgroundColor = "rgb(192, 84, 105)";
    document.getElementById("main").style.backgroundColor = "rgb(218, 119, 139)";
    document.getElementById("main").style.filter = "contrast(1.0)";
}

setTimeText(timeMinutes, timeSeconds);

btnStart.addEventListener("click", (event) => {
    if (timerIsRunning) {
        timerIsRunning = false;
        setTimeText(timeMinutes, timeSeconds);
        clearInterval(timeInterval);
        btnStart.children[0].src = "/res/play-fill.svg";
        styleDefault();
    } else {
        styleRunning();
        btnStart.children[0].src = "/res/pause-fill.svg";
        timerIsRunning = true;
        t0 = Date.now();
        let timerLengthSeconds = timeMinutes * 60 + timeSeconds;
        timeInterval = setInterval(() => {
            let passedSeconds = (Date.now() - t0) / 1000;
            let secondsLeft = timerLengthSeconds - passedSeconds;
            if (secondsLeft <= 0) {
                
                // Play chime
                let audio = document.createElement("audio");
                audio.src = "/res/done.mp3";
                audio.autoplay = true;

                // Reset timer
                setTimeText(timeMinutes, timeSeconds);

                timerIsRunning = false;

                btnStart.children[0].src = "/res/play-fill.svg";
                styleDefault();

                clearInterval(timeInterval);
                return;
            }

            let showMinutes = Math.floor(secondsLeft / 60);
            let showSeconds = Math.floor(secondsLeft - showMinutes * 60);
            setTimeText(showMinutes, showSeconds);
        }, 50);
    }
});
