let mode = "clock";
let fakeNow = Date.now();
let speedFactor = 24;
let running = false;
let swStartTime = 0;
let swElapsed = 0;
let alarmTime = null;
let alarmEnabled = false;

const display = document.getElementById("display");
const speedSlider = document.getElementById("speedSlider");
const sliderValue = document.getElementById("sliderValue");
const startStopBtn = document.getElementById("startStopBtn");
const resetBtn = document.getElementById("resetBtn");
const alarmToggle = document.getElementById("alarmToggle");
const alarmInput = document.getElementById("alarmTime");

speedSlider.addEventListener("input", () => {
    speedFactor = speedSlider.value;
    sliderValue.textContent = `${speedFactor}h/day`;
});

function update() {
    const realNow = Date.now();
    fakeNow += (realNow - lastReal) * (24 / speedFactor);
    lastReal = realNow;

    const date = new Date(fakeNow);

    if (mode === "clock") {
        display.textContent = date.toLocaleTimeString("ja-JP", { hour12: false });
    }

    if (mode === "stopwatch") {
        if (running) swElapsed = realNow - swStartTime;
        const t = new Date(swElapsed);
        display.textContent =
            t.getUTCMinutes().toString().padStart(2, "0") + ":" +
            t.getUTCSeconds().toString().padStart(2, "0");
    }

    if (mode === "alarm" && alarmEnabled) {
        const nowStr = date.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit", hour12: false });
        if (alarmTime === nowStr) {
            alert("⏰ アラーム！");
            alarmEnabled = false;
            alarmToggle.checked = false;
        }
    }

    requestAnimationFrame(update);
}

let lastReal = Date.now();
update();

// Stopwatch buttons
startStopBtn.addEventListener("click", () => {
    if (!running) {
        running = true;
        swStartTime = Date.now() - swElapsed;
        startStopBtn.textContent = "STOP";
    } else {
        running = false;
        startStopBtn.textContent = "START";
    }
});

resetBtn.addEventListener("click", () => {
    running = false;
    swElapsed = 0;
    startStopBtn.textContent = "START";
});

// Alarm
alarmInput.addEventListener("change", () => {
    alarmTime = alarmInput.value + ":00";
});
alarmToggle.addEventListener("click", () => {
    alarmEnabled = alarmToggle.checked;
});

// tab switching
document.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        mode = btn.dataset.target;

        document.getElementById("stopwatchControls").classList.add("hidden");
        document.getElementById("alarmControls").classList.add("hidden");

        if (mode === "stopwatch") document.getElementById("stopwatchControls").classList.remove("hidden");
        if (mode === "alarm") document.getElementById("alarmControls").classList.remove("hidden");
    });
});
