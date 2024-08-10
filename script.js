let puzzle = [];
let emptyTile = { row: 0, col: 0 };
let moves = 0;
let timer;
let seconds = 0;
let gameStarted = false;
let leaderboard = [];

const images = [
    'https://source.unsplash.com/300x300/?nature,water',
    'https://source.unsplash.com/300x300/?nature,forest',
    'https://source.unsplash.com/300x300/?nature,mountain',
    'https://source.unsplash.com/300x300/?nature,beach',
    'https://source.unsplash.com/300x300/?nature,sunset'
];

function initGame() {
    const difficultySelect = document.getElementById('difficulty');
    const size = parseInt(difficultySelect.value);
    createPuzzle(size);
    displayPuzzle();
    resetGameState();
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

    const imageIndex = Math.floor(Math.random() * images.length);
    const imageUrl = images[imageIndex];

    for (let i = 0; i < puzzle.length; i++) {
        for (let j = 0; j < puzzle[i].length; j++) {
            const piece = document.createElement('div');
            piece.classList.add('puzzle-piece');
            if (puzzle[i][j] !== 0) {
                piece.textContent = puzzle[i][j];
                const bgPositionX = ((puzzle[i][j] - 1) % puzzle.length) / (puzzle.length - 1) * 100;
                const bgPositionY = Math.floor((puzzle[i][j] - 1) / puzzle.length) / (puzzle.length - 1) * 100;
                piece.style.backgroundImage = `url(${imageUrl})`;
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
            checkWin();
            return;
        }
    }
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
    document.getElementById('start-button').textContent = 'Restart';
}

function endGame() {
    clearInterval(timer);
    const time = formatTime(seconds);
    const message = `Congratulations! You solved the puzzle in ${moves} moves and ${time}.`;
    document.getElementById('message').textContent = message;
    updateLeaderboard();
}

function resetGameState() {
    moves = 0;
    seconds = 0;
    gameStarted = false;
    clearInterval(timer);
    updateMoves();
    updateTimer();
    document.getElementById('message').textContent = '';
    document.getElementById('start-button').textContent = 'Start Game';
}

function updateMoves() {
    document.getElementById('moves').textContent = `Moves: ${moves}`;
}

function updateTimer() {
    const time = formatTime(seconds);
    document.getElementById('timer').textContent = `Time: ${time}`;
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
        li.textContent = `${index + 1}. ${entry.difficulty}x${entry.difficulty} - Moves: ${entry.moves}, Time: ${entry.time}`;
        leaderboardList.appendChild(li);
    });
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
}

document.getElementById('start-button').addEventListener('click', initGame);
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
document.getElementById('difficulty').addEventListener('change', initGame);

initGame();