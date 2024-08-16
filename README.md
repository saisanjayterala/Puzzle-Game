https://saisanjayterala.github.io/Puzzle-Game/
# Sliding Puzzle Game

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Installation](#installation)
5. [How to Play](#how-to-play)
6. [Game Logic](#game-logic)
7. [Customization](#customization)
8. [Performance Considerations](#performance-considerations)
9. [Accessibility](#accessibility)
10. [Future Enhancements](#future-enhancements)
11. [Contributing](#contributing)
12. [License](#license)

## Introduction

This Sliding Puzzle Game is a modern, interactive web-based implementation of the classic sliding tile puzzle. Players must rearrange scrambled tiles to form a complete image or sequence of numbers. The game features multiple difficulty levels, a timer, move counter, and leaderboard to enhance the gaming experience.

## Features

- Multiple difficulty levels (3x3, 4x4, 5x5)
- Real-time move counter and timer
- Leaderboard to track best performances
- Responsive design for various screen sizes
- Smooth animations for tile movements
- Dark/Light theme toggle
- Confetti celebration on puzzle completion
- Preview image display

## Technologies Used

- HTML5
- CSS3 (with CSS Variables for theming)
- JavaScript (ES6+)
- GSAP (GreenSock Animation Platform) for animations
- Font Awesome for icons
- Confetti library for win celebration

## Installation

1. Clone the repository:
2. 2. Navigate to the project directory:
3. Open `index.html` in a modern web browser.

## How to Play

1. Select a difficulty level from the dropdown menu.
2. Click the "Start Game" button to begin.
3. Click on tiles adjacent to the empty space to move them.
4. Arrange the tiles in the correct order to win the game.
5. Try to complete the puzzle in the least number of moves and shortest time.

## Game Logic

The game logic is implemented in JavaScript and includes the following key components:

1. **Puzzle Creation**: 
- The `createPuzzle()` function generates a 2D array representing the puzzle grid.
- Tiles are initially placed in order, with the last tile (bottom-right) set as empty.

2. **Shuffling**: 
- The `shufflePuzzle()` function randomizes the tile positions.
- It performs 1000 random valid moves to ensure the puzzle is solvable.

3. **Move Validation**:
- The `movePiece()` function checks if a clicked tile is adjacent to the empty space.
- If valid, it swaps the tile with the empty space and updates the game state.

4. **Win Condition**:
- After each move, `checkWin()` verifies if all tiles are in the correct position.
- If the puzzle is solved, it triggers the win celebration and updates the leaderboard.

5. **Animation**:
- Tile movements are animated using GSAP for a smooth user experience.

6. **Timer and Move Counter**:
- The game tracks the number of moves and time elapsed.
- These are updated in real-time and displayed to the player.

7. **Leaderboard**:
- Top 5 performances (based on moves) are stored and displayed.
- Entries are sorted and persistent across game sessions.

8. **Theme Switching**:
- The game supports both light and dark themes.
- CSS variables are used for easy color scheme updates.

## Customization

You can customize various aspects of the game:

- Modify the `themes` array in the JavaScript file to add new color schemes.
- Update the `images` array to use different preview images.
- Adjust CSS variables in the `:root` selector to change the default theme colors.

## Performance Considerations

- The game uses efficient DOM manipulation techniques to minimize reflows and repaints.
- Animations are optimized using GSAP for smooth performance across devices.
- The shuffling algorithm ensures a solvable puzzle while maintaining randomness.

## Accessibility

- The game uses semantic HTML elements for better screen reader compatibility.
- Color contrast ratios are maintained for readability in both light and dark themes.
- Keyboard navigation support can be added as a future enhancement.

## Future Enhancements

1. Implement keyboard controls for tile movement.
2. Add sound effects for moves and win conditions.
3. Introduce a hint system for players who get stuck.
4. Create a puzzle image upload feature for custom puzzles.
5. Implement online multiplayer functionality.

## Contributing

Contributions to improve the game are welcome. Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.
