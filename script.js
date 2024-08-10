let startTime;
let timerInterval;

function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const now = new Date();
    const elapsedTime = Math.floor((now - startTime) / 1000);
    const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, '0');
    const seconds = String(elapsedTime % 60).padStart(2, '0');
    document.getElementById('timer').textContent = `Time: ${minutes}:${seconds}`;
}

function stopTimer() {
    clearInterval(timerInterval);
}

function onDragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
}

function onDrop(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text");
    const draggableElement = document.getElementById(id);
    const dropzone = event.target;
    if (dropzone.classList.contains('puzzle-slot') && !dropzone.hasChildNodes()) {
        dropzone.appendChild(draggableElement);
        if (document.querySelectorAll('.puzzle-slot .puzzle-piece').length === 4) {
            stopTimer();
            alert('Puzzle Completed!');
        }
    }
}

function onDragOver(event) {
    event.preventDefault();
}

document.querySelectorAll('.puzzle-piece').forEach(piece => {
    piece.addEventListener('dragstart', onDragStart);
});

document.querySelectorAll('.puzzle-slot').forEach(slot => {
    slot.addEventListener('dragover', onDragOver);
    slot.addEventListener('drop', onDrop);
});

startTimer();
