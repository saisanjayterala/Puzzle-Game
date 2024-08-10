let startTime;
let timerInterval;
let hintUsed = false;
let hintsRemaining = 3;
let timeLimit = 120;
let score = 0;
let originalPieces = [];
let difficulty = 'medium';
let leaderboard = [];
let playerProfile = { name: 'Player', highScore: 0 };

function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const now = new Date();
    const elapsedTime = Math.floor((now - startTime) / 1000);
    const remainingTime = timeLimit - elapsedTime;
    if (remainingTime <= 0) {
        clearInterval(timerInterval);
        alert('Time\'s up! Game over.');
        return;
    }
    const minutes = String(Math.floor(remainingTime / 60)).padStart(2, '0');
    const seconds = String(remainingTime % 60).padStart(2, '0');
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
    }, 3000);
}

function onDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
}

function onDragOver(event) {
    event.preventDefault();
}

function onDrop(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData('text/plain');
    const piece = document.getElementById(id);
    const slot = event.target;
    if (slot.classList.contains('puzzle-slot') && !slot.hasChildNodes()) {
        slot.appendChild(piece);
        piece.classList.add('correct');
        updateScore();
        checkCompletion();
    }
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
        const finalScore = score;
        showMessage(`Puzzle Completed! Your score: ${finalScore}`);
        updateLeaderboard(finalScore);
        displayLeaderboard();
        savePlayerProfile(finalScore);
        displayProfile();
    }
}

function startLevel(level) {
    const gameArea = document.getElementById('game-area');
    const puzzleBoard = document.querySelector('.puzzle-board');
    const dropZone = document.querySelector('.drop-zone');
    const levelSelect = document.getElementById('level-select');

    puzzleBoard.innerHTML = '';
    dropZone.innerHTML = '';

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

    originalPieces = [];
    for (let i = 1; i <= pieceCount; i++) {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.id = `piece${i}`;
        piece.textContent = i;
        piece.draggable = true;
        piece.addEventListener('dragstart', onDragStart);

        if (difficulty === 'hard' && i % 3 === 0) {
            piece.classList.add('triangle');
            piece.textContent = '';
        } else if (difficulty === 'medium' && i % 2 === 0) {
            piece.classList.add('circle');
        }

        puzzleBoard.appendChild(piece);
        originalPieces.push(piece.id);

        const slot = document.createElement('div');
        slot.className = 'puzzle-slot';
        slot.id = `slot${i}`;
        slot.addEventListener('dragover', onDragOver);
        slot.addEventListener('drop', onDrop);
        dropZone.appendChild(slot);
    }

    levelSelect.style.display = 'none';
    gameArea.style.display = 'block';

    hintUsed = false;
    hintsRemaining = 3;
    document.getElementById('hint-button').textContent = `Hint (${hintsRemaining})`;

    score = 0;
    document.getElementById('score').textContent = `Score: ${score}`;

    stopTimer();
    startTimer();
}

function showHint() {
    if (hintUsed || hintsRemaining <= 0) return;
    hintUsed = true;
    hintsRemaining--;
    const hintButton = document.getElementById('hint-button');
    hintButton.textContent = `Hint (${hintsRemaining})`;
    hintButton.disabled = hintsRemaining <= 0;

    const slots = document.querySelectorAll('.puzzle-slot');
    slots.forEach(slot => {
        if (!slot.hasChildNodes()) {
            slot.style.borderColor = '#ff5722';
        }
    });

    setTimeout(() => {
        slots.forEach(slot => {
            slot.style.borderColor = '#999';
        });
        hintUsed = false;
    }, 2000);
}

function shufflePieces() {
    const puzzleBoard = document.querySelector('.puzzle-board');
    for (let i = puzzleBoard.children.length; i >= 0; i--) {
        puzzleBoard.appendChild(puzzleBoard.children[Math.random() * i | 0]);
    }
}

function resetPuzzle() {
    const puzzleBoard = document.querySelector('.puzzle-board');
    const dropZone = document.querySelector('.drop-zone');

    puzzleBoard.innerHTML = '';
    dropZone.innerHTML = '';

    originalPieces.forEach(id => {
        const piece = document.getElementById(id);
        puzzleBoard.appendChild(piece);
    });

    document.querySelectorAll('.puzzle-slot').forEach(slot => {
        slot.style.borderColor = '#999';
        slot.classList.remove('correct');
        slot.classList.remove('occupied');
    });

    score = 0;
    document.getElementById('score').textContent = `Score: ${score}`;

    stopTimer();
    startTimer();
}

function updateScore() {
    const timeElapsed = Math.floor((new Date() - startTime) / 1000);
    score = Math.max(0, 1000 - timeElapsed); // Example scoring formula
    document.getElementById('score').textContent = `Score: ${score}`;
}

function setTheme(theme) {
    document.body.className = theme + '-mode';
}

function startMultiplayer() {
    alert('Multiplayer mode is not implemented yet.');
}

function setDifficulty(level) {
    difficulty = level;
    alert(`Difficulty set to ${level}`);
}

function updateLeaderboard(finalScore) {
    leaderboard.push({ score: finalScore });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 5); // Keep top 5 scores
}

function displayLeaderboard() {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';
    leaderboard.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `Score: ${entry.score}`;
        leaderboardList.appendChild(li);
    });
    document.getElementById('leaderboard').style.display = 'block';
}

function savePlayerProfile(finalScore) {
    if (finalScore > playerProfile.highScore) {
        playerProfile.highScore = finalScore;
    }
}

function displayProfile() {
    const profileInfo = document.getElementById('profile-info');
    profileInfo.innerHTML = `<p>Name: ${playerProfile.name}</p><p>High Score: ${playerProfile.highScore}</p>`;
    document.getElementById('profile').style.display = 'block';
}
