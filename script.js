let startTime;
let timerInterval;
let hintUsed = false;
let hintsRemaining = 3;

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

function showMessage(message) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    setTimeout(() => {
        messageElement.textContent = '';
    }, 2000);
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
        draggableElement.classList.add('correct');
        showMessage('Piece placed correctly!');
        checkCompletion();
    }
}

function onDragOver(event) {
    event.preventDefault();
}

function checkCompletion() {
    const slots = document.querySelectorAll('.puzzle-slot');
    let completed = true;
    slots.forEach(slot => {
        if (!slot.hasChildNodes()) {
            completed = false;
        }
    });
    if (completed) {
        stopTimer();
        alert('Puzzle Completed!');
    }
}

function startLevel(level) {
    const gameArea = document.getElementById('game-area');
    const puzzleBoard = document.querySelector('.puzzle-board');
    const dropZone = document.querySelector('.drop-zone');
    const levelSelect = document.getElementById('level-select');

    // Clear previous puzzle pieces and slots
    puzzleBoard.innerHTML = '';
    dropZone.innerHTML = '';

    // Set up pieces and slots based on the level
    let pieceCount;
    switch (level) {
        case 1:
            pieceCount = 4;
            break;
        case 2:
            pieceCount = 6;
            break;
        case 3:
            pieceCount = 9;
            break;
        case 4:
            pieceCount = 12;
            break;
    }

    for (let i = 1; i <= pieceCount; i++) {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.id = `piece${i}`;
        piece.textContent = i;
        piece.draggable = true;
        piece.addEventListener('dragstart', onDragStart);
        puzzleBoard.appendChild(piece);

        const slot = document.createElement('div');
        slot.className = 'puzzle-slot';
        slot.id = `slot${i}`;
        slot.addEventListener('dragover', onDragOver);
        slot.addEventListener('drop', onDrop);
        dropZone.appendChild(slot);
    }

    // Hide level selection and show game area
    levelSelect.style.display = 'none';
    gameArea.style.display = 'block';

    hintUsed = false;
    hintsRemaining = 3;
    startTimer();
}

function showHint() {
    if (hintsRemaining <= 0) {
        showMessage('No more hints available.');
        return;
    }

    hintUsed = true;
    hintsRemaining--;
    const pieces = document.querySelectorAll('.puzzle-piece');
    const slots = document.querySelectorAll('.puzzle-slot');
    pieces.forEach((piece, index) => {
        if (!slots[index].hasChildNodes()) {
            slots[index].style.borderColor = '#FF5722';
            setTimeout(() => {
                slots[index].style.borderColor = '#999';
            }, 1000);
        }
    });
    showMessage(`Hint used! ${hintsRemaining} hints remaining.`);
}
