let workTime = 1;
let shortBreak = 5;
let longBreak = 15;

let currentCycle = 0;
let isWorking = true;
let timer;
let endTime;

let pomodoroCount = 0;

function updateDisplay(minutes, seconds) {
    document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
    document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
}

function startTimer(duration) {
    endTime = Date.now() + duration * 60 * 1000; // Thời gian kết thúc
    localStorage.setItem('endTime', endTime); // Lưu thời gian kết thúc vào localStorage

    timer = setInterval(() => {
        const timeRemaining = Math.floor((endTime - Date.now()) / 1000);
        
        if (timeRemaining >= 0) {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            updateDisplay(minutes, seconds);
        } else {
            clearInterval(timer);
            const alarm = new Audio('relaxing-guitar-loop-v6-248487.mp3');
            alarm.play();
            alert(isWorking ? 'Đã hết thời gian làm việc, Nghỉ ngơi thôi' : 'Đã hết thời gian nghỉ ngơi, làm việc thôi');
            nextCycle();
        }
    }, 1000);
}

function nextCycle() {
    if (currentCycle === 4) {
        pomodoroCount++;
        document.getElementById('pomodoroCount').innerText = pomodoroCount;
    }

    if (isWorking) {
        currentCycle++;
        if (currentCycle < 4) {
            startTimer(shortBreak);
        } else {
            startTimer(longBreak);
            currentCycle = 0;
        }
    } else {
        startTimer(workTime);
    }
    isWorking = !isWorking;
    document.getElementById('cycle').innerText = currentCycle;
}

document.getElementById('start').addEventListener('click', () => {
    clearInterval(timer);
    isWorking = true;
    currentCycle = 0;
    document.getElementById('cycle').innerText = currentCycle;
    startTimer(workTime);
});

document.getElementById('reset').addEventListener('click', () => {
    clearInterval(timer);
    updateDisplay(workTime, 0);
    document.getElementById('cycle').innerText = 0;
    currentCycle = 0;
    isWorking = true;
    localStorage.removeItem('endTime'); // Xóa thời gian kết thúc khi reset
});

// Khi tải lại trang, kiểm tra nếu có endTime trong localStorage
window.addEventListener('load', () => {
    const savedEndTime = localStorage.getItem('endTime');
    if (savedEndTime) {
        const timeRemaining = Math.floor((savedEndTime - Date.now()) / 1000);
        if (timeRemaining > 0) {
            startTimer(timeRemaining / 60); // Tiếp tục bộ đếm từ thời gian còn lại
        } else {
            localStorage.removeItem('endTime'); // Xóa thời gian kết thúc nếu đã hết hạn
            updateDisplay(workTime, 0);
            document.getElementById('cycle').innerText = 0;
        }
    }
});

document.getElementById('setTime').addEventListener('click', () => {
    workTime = parseInt(document.getElementById('workTimeInput').value);
    shortBreak = parseInt(document.getElementById('shortBreakInput').value);
    longBreak = parseInt(document.getElementById('longBreakInput').value);
    alert("Thiết lập thời gian thành công!");
    document.getElementById('minutes').innerText = workTime;
});

