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

let styles = {
    "retro": {
        name: "Retro",
        style: {
            "--background": ["#780000", "#600"],
            "--main": ["#C1121F", "#D1323F"],
            "--fg": ["#FDF0D5", "#fff"],
            "--task-button": ["#003049", "#023"],
            "--start-button": ["#780000", "#600"],
            "--start-button-filter": ["invert(1)", "invert(1)"],
            "--task-bg": ["#780000"],
            "--task-fg": ["#ddd"]
        }
    },
    "cute": {
        name: "Cute 🌟",
        style: {
            "--background": ["#A2D2FF", "#A2B2DF"],
            "--main": ["#BDE0FE", "#CDF9FF"],
            "--fg": ["#7292BF"],
            "--task-button": ["#82A2CF"],
            "--task-button-fg": ["white"],
            "--start-button": ["white", "#A2B2DF"],
            "--start-button-filter": ["invert(0)", "invert(1.0)"],
            "--task-bg": ["#82A2CF"],
            "--task-fg": ["white"]
        }
    },
    "contrast": {
        name: "Contrast",
        style: {
            "--background": ["white", "#CCC"],
            "--main": ["#ddd", "#AAA"],
            "--fg": ["black"],
            "--task-button": ["#222"],
            "--task-button-fg": ["white"],
            "--start-button": ["#555"],
            "--start-button-filter": ["invert(1)", "invert(0.7)"],
            "--task-bg": ["#bbb"],
            "--task-fg": ["#333"]
        }
    },
    "daisy": {
        name: "🌼",
        style: {
            "--background": ["#ffd", "#ddb"],
            "--main": ["#f0f051", "#ff3"],
            "--fg": ["#cb99d9"],
            "--task-button": ["#cb99d9"],
            "--task-button-fg": ["white"],
            "--start-button": ["#cb99d9"],
            "--start-button-filter": ["invert(1.0)", "invert(0.8)"],
            "--task-bg": ["#cb99d9"],
            "--task-fg": ["#cb99d9"]
        }
    }
}

document.getElementById("style").addEventListener("change", (event) => {
    if (timerIsRunning) styleRunning();
    else styleDefault();
})

Object.keys(styles).forEach((s) => {
    let opt = document.createElement("option");
    opt.value = s;
    opt.innerText = styles[s].name;
    document.getElementById("style").appendChild(opt);
});

document.getElementById("style").value = "daisy";

function changeStyle(style, i) {
    Object.keys(style).forEach((s) => {
        let sss = style[s][i];
        if (sss == undefined || sss == null) sss = style[s][0];
        var rs = document.querySelector(":root").style.setProperty(s, sss);
    });
}

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
    changeStyle(styles[document.getElementById("style").value].style, 1);
}

// Reset page style when timer is not running
function styleDefault() {
    changeStyle(styles[document.getElementById("style").value].style, 0);
}

styleDefault();

setTimeText(timeMinutes, timeSeconds);

btnStart.addEventListener("click", (event) => {
    if (timerIsRunning) {
        timerIsRunning = false;
        setTimeText(timeMinutes, timeSeconds);
        clearInterval(timeInterval);
        btnStart.children[0].src = "res/play-fill.svg";
        styleDefault();
    } else {
        styleRunning();
        btnStart.children[0].src = "res/pause-fill.svg";
        timerIsRunning = true;
        t0 = Date.now();
        let timerLengthSeconds = timeMinutes * 60 + timeSeconds;
        timeInterval = setInterval(() => {
            let passedSeconds = (Date.now() - t0) / 1000;
            let secondsLeft = timerLengthSeconds - passedSeconds;
            if (secondsLeft <= 0) {
                
                // Play chime
                let audio = document.createElement("audio");
                audio.src = "res/done.mp3";
                audio.autoplay = true;

                // Reset timer
                setTimeText(timeMinutes, timeSeconds);

                timerIsRunning = false;

                btnStart.children[0].src = "res/play-fill.svg";
                styleDefault();

                clearInterval(timeInterval);
                return;
            }

            let showMinutes = Math.floor(secondsLeft / 60);
            let showSeconds = Math.floor(secondsLeft - showMinutes * 60);
            if (showSeconds % 2 == 0) {
                document.getElementById("colon").style.opacity = "1";
            } else {
                document.getElementById("colon").style.opacity = "0.6";
            }
            setTimeText(showMinutes, showSeconds);
        }, 50);
    }
});

window.addEventListener("keydown", (event) => {
    if (event.code == "Space") {
        btnStart.click();
    }
});
