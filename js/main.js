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

var isAnyFocussed = false;  // Is any task input text focussed / currently being edited?

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
            "--task-fg": ["white"]
        }
    }
}

document.getElementById("style").addEventListener("change", (event) => {
    if (timerIsRunning) styleRunning();
    else styleDefault();
})
let sounds = {"default": "Default (based on theme)", "retro": "Retro", "flower": "Flower"};

let presets = [
    {
        text: "25min work",
        timer: [25, 0]
    },
    {
        text: "5min pause",
        timer: [5, 0]
    }
];

presets.forEach((preset) => {
    let btn = document.createElement("div");
    btn.classList.add("preset");
    btn.addEventListener("click", (event) => {
        if (!timerIsRunning) {
            timeMinutes = parseInt(event.target.getAttribute("minutes"));
            timeSeconds = parseInt(event.target.getAttribute("seconds"));

            if (timeMinutes > 60) timeMinutes = 60;
            if (timeMinutes < 0) timeMinutes = 0;
            if (timeSeconds > 60) timeSeconds = 60;
            if (timeSeconds < 0) timeSeconds = 0;

            setTimeText(timeMinutes, timeSeconds);
        }
    });
    btn.setAttribute("minutes", preset.timer[0]);
    btn.setAttribute("seconds", preset.timer[1]);
    btn.innerText = preset.text;

    document.getElementById("main__presets").appendChild(btn);
});

/**
 * STYLES
 */
document.getElementById("style").addEventListener("change", (event) => {
    console.log("set style to", event.target.value);
    localStorage.setItem("style", event.target.value);
    if (timerIsRunning) styleRunning();
    else styleDefault();
});

Object.keys(styles).forEach((s) => {
    let opt = document.createElement("option");
    opt.value = s;
    opt.innerText = styles[s].name;
    document.getElementById("style").appendChild(opt);
});

document.getElementById("style").value = "daisy";

/**
 * SOUNDS
 */
document.getElementById("sound").addEventListener("change", (event) => {
    localStorage.setItem("sound", event.target.value);

    // Theme => Sound
    let LUT = {
        "retro": "retro.mp3",
        "cute": "cute.mp3",
        "daisy": "daisy.mp3",
        "contrast": "contrast.mp3"
    };

    if (event.target.value == "default") {
        // Find sound based on current theme
        let theme = document.getElementById("style").value;
        if (theme in LUT) doneAudio.src = "/res/sounds/" + LUT[theme];
        else doneAudio.src = "/res/sounds/default.mp3";
    } else {
        // Find sound based on selection
        doneAudio.src = "/res/sounds/" + event.target.value + ".mp3";
    }
});

Object.keys(sounds).forEach((sound) => {
    let opt = document.createElement("option");
    opt.value = sound;
    opt.innerText = sounds[sound];
    document.getElementById("sound").appendChild(opt);
});

function changeStyle(style, i) {
    Object.keys(style).forEach((s) => {
        let sss = style[s][i];
        if (sss == undefined || sss == null) sss = style[s][0];
        var rs = document.querySelector(":root").style.setProperty(s, sss);
    });
}

// Load default style and sound from local storage
document.getElementById("style").value = localStorage.getItem("style") || "contrast";
document.getElementById("sound").value = localStorage.getItem("sound") || "default";

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

// Prepare audio chime when timer ends
var doneAudio = document.createElement("audio");
doneAudio.src = "/res/sounds/default.mp3";

btnStart.addEventListener("click", (event) => {
    if (timerIsRunning) {
        // Pause timer and reset everything
        timerIsRunning = false;
        setTimeText(timeMinutes, timeSeconds);
        clearInterval(timeInterval);
        btnStart.children[0].src = "res/play-fill.svg";
        styleDefault();
    } else {
        // Start timer
        styleRunning();
        btnStart.children[0].src = "res/pause-fill.svg";
        timerIsRunning = true;
        t0 = Date.now();
        let timerLengthSeconds = timeMinutes * 60 + timeSeconds;

        // Interval for checking if timer is done
        timeInterval = setInterval(() => {
            let passedSeconds = (Date.now() - t0) / 1000;
            let secondsLeft = timerLengthSeconds - passedSeconds;
            if (secondsLeft <= 0) {
                // Play chime
                doneAudio.play();

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
    if (event.code == "Space" && !isAnyFocussed) {
        btnStart.click();
    }
});
