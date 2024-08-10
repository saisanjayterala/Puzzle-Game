let puzzle = [];
let emptyTile = { row: 0, col: 0 };
let moves = 0;
let timer;
let seconds = 0;
let gameStarted = false;
let leaderboard = [];
let currentImageUrl = '';

const images = [
    'https://source.unsplash.com/400x400/?nature,water',
    'https://source.unsplash.com/400x400/?nature,forest',
    'https://source.unsplash.com/400x400/?nature,mountain',
    'https://source.unsplash.com/400x400/?nature,beach',
    'https://source.unsplash.com/400x400/?nature,sunset'
];

function initGame() {
    const difficultySelect = document.getElementById('difficulty');
    const size = parseInt(difficultySelect.value);
    createPuzzle(size);
    displayPuzzle();
    resetGameState();
    updatePreviewImage();
}

function createPuzzle(size) {
    puzzle = [];
    for (let i = 0; i < size; i++) {
        puzzle[i] = [];
        for (let j = 0; j < size; j++) {
            puzzle[i][j] = i * size + j + 1;
        }
    }
    emptyTile = { row: size - 1, col: size - 1 };
    puzzle[emptyTile.row][emptyTile.col] = 0;
    shufflePuzzle(size);
}

function shufflePuzzle(size) {
    for (let i = 0; i < 1000; i++) {
        const directions = [
            { dx: -1, dy: 0 },
            { dx: 1, dy: 0 },
            { dx: 0, dy: -1 },
            { dx: 0, dy: 1 }
        ];
        const validMoves = directions.filter(dir => {
            const newRow = emptyTile.row + dir.dx;
            const newCol = emptyTile.col + dir.dy;
            return newRow >= 0 && newRow < size && newCol >= 0 && newCol < size;
        });
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        const newRow = emptyTile.row + randomMove.dx;
        const newCol = emptyTile.col + randomMove.dy;
        puzzle[emptyTile.row][emptyTile.col] = puzzle[newRow][newCol];
        puzzle[newRow][newCol] = 0;
        emptyTile = { row: newRow, col: newCol };
    }
}

function displayPuzzle() {
    const container = document.getElementById('puzzle-container');
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${puzzle.length}, 1fr)`;

    for (let i = 0; i < puzzle.length; i++) {
        for (let j = 0; j < puzzle[i].length; j++) {
            const piece = document.createElement('div');
            piece.classList.add('puzzle-piece', 'fade-in');
            if (puzzle[i][j] !== 0) {
                piece.textContent = puzzle[i][j];
                const bgPositionX = ((puzzle[i][j] - 1) % puzzle.length) / (puzzle.length - 1) * 100;
                const bgPositionY = Math.floor((puzzle[i][j] - 1) / puzzle.length) / (puzzle.length - 1) * 100;
                piece.style.backgroundImage = `url(${currentImageUrl})`;
                piece.style.backgroundPosition = `${bgPositionX}% ${bgPositionY}%`;
                piece.addEventListener('click', () => movePiece(i, j));
            } else {
                piece.style.opacity = '0';
            }
            container.appendChild(piece);
        }
    }
}

function movePiece(row, col) {
    if (!gameStarted) {
        startGame();
    }

    const directions = [
        { dx: -1, dy: 0 },
        { dx: 1, dy: 0 },
        { dx: 0, dy: -1 },
        { dx: 0, dy: 1 }
    ];

    for (const dir of directions) {
        const newRow = row + dir.dx;
        const newCol = col + dir.dy;
        if (newRow === emptyTile.row && newCol === emptyTile.col) {
            puzzle[emptyTile.row][emptyTile.col] = puzzle[row][col];
            puzzle[row][col] = 0;
            emptyTile = { row, col };
            moves++;
            updateMoves();
            displayPuzzle();
            animateMove(row, col, newRow, newCol);
            checkWin();
            return;
        }
    }
}

function animateMove(fromRow, fromCol, toRow, toCol) {
    const pieces = document.querySelectorAll('.puzzle-piece');
    const fromIndex = fromRow * puzzle.length + fromCol;
    const toIndex = toRow * puzzle.length + toCol;

    const fromPiece = pieces[fromIndex];
    const toPiece = pieces[toIndex];

    const fromRect = fromPiece.getBoundingClientRect();
    const toRect = toPiece.getBoundingClientRect();

    const deltaX = toRect.left - fromRect.left;
    const deltaY = toRect.top - fromRect.top;

    fromPiece.style.zIndex = '10';
    fromPiece.style.transition = 'transform 0.3s ease-in-out';
    fromPiece.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

    setTimeout(() => {
        fromPiece.style.zIndex = '';
        fromPiece.style.transition = '';
        fromPiece.style.transform = '';
        displayPuzzle();
    }, 300);
}

function checkWin() {
    const size = puzzle.length;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (i === size - 1 && j === size - 1) {
                if (puzzle[i][j] !== 0) return;
            } else if (puzzle[i][j] !== i * size + j + 1) {
                return;
            }
        }
    }
    endGame();
}

function startGame() {
    gameStarted = true;
    timer = setInterval(updateTimer, 1000);
    document.getElementById('start-button').innerHTML = '<i class="fas fa-redo"></i> Restart';
}

function endGame() {
    clearInterval(timer);
    const time = formatTime(seconds);
    const message = `Congratulations! You solved the puzzle in ${moves} moves and ${time}.`;
    document.getElementById('message').textContent = message;
    document.getElementById('message').classList.add('slide-in');
    updateLeaderboard();
    showConfetti();
}

function resetGameState() {
    moves = 0;
    seconds = 0;
    gameStarted = false;
    clearInterval(timer);
    updateMoves();
    updateTimer();
    document.getElementById('message').textContent = '';
    document.getElementById('start-button').innerHTML = '<i class="fas fa-play"></i> Start Game';
}

function updateMoves() {
    document.getElementById('moves').innerHTML = `<i class="fas fa-shoe-prints"></i> Moves: ${moves}`;
}

function updateTimer() {
    const time = formatTime(seconds);
    document.getElementById('timer').innerHTML = `<i class="fas fa-clock"></i> Time: ${time}`;
    seconds++;
}

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateLeaderboard() {
    const difficulty = document.getElementById('difficulty').value;
    const entry = { difficulty, moves, time: formatTime(seconds) };
    leaderboard.push(entry);
    leaderboard.sort((a, b) => a.moves - b.moves);
    leaderboard = leaderboard.slice(0, 5);
    displayLeaderboard();
}

function displayLeaderboard() {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';
    leaderboard.forEach((entry, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${index + 1}. ${entry.difficulty}x${entry.difficulty} - <i class="fas fa-shoe-prints"></i> ${entry.moves}, <i class="fas fa-clock"></i> ${entry.time}`;
        li.classList.add('fade-in');
        leaderboardList.appendChild(li);
    });
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const themeIcon = document.querySelector('#theme-toggle i');
    themeIcon.classList.toggle('fa-moon');
    themeIcon.classList.toggle('fa-sun');
}

function updatePreviewImage() {
    const imageIndex = Math.floor(Math.random() * images.length);
    currentImageUrl = images[imageIndex];
    const previewImage = document.getElementById('preview-image');
    previewImage.src = currentImageUrl;
    previewImage.alt = `Nature Preview ${imageIndex + 1}`;
}

function showConfetti() {
    const confettiSettings = { target: 'confetti-container', max: 200, size: 2, animate: true, props: ['circle', 'square', 'triangle', 'line'], colors: [[165,104,246],[230,61,135],[0,199,228],[253,214,126]], clock: 25, rotate: true };
    const confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();
    
    setTimeout(() => {
        confetti.clear();
    }, 5000);
}

document.getElementById('start-button').addEventListener('click', initGame);
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
document.getElementById('difficulty').addEventListener('change', initGame);

// Initialize the game
initGame();