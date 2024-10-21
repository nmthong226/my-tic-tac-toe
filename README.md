# Tic-Tac-Toe Game

This is a responsive Tic-Tac-Toe game built with React. The game allows two players to play a classic Tic-Tac-Toe match with features like move history, ascending/descending move list sorting, and the ability to start a new game. The UI is styled with Tailwind CSS, and game logic is implemented using React hooks (`useState` and `useEffect`).

## Features

- **Responsive design**: Adjusts well to different screen sizes with buttons and board resizing accordingly.
- **Interactive board**: Players take turns clicking on the squares to place `X` or `O`. Visual feedback is provided for hover states.
- **Winner highlight**: The three squares that complete a win are visually highlighted.
- **Move history**: Players can view the history of moves and jump to any previous state in the game.
- **Move order toggle**: Players can toggle the move history between ascending and descending order.
- **New game**: A button to start a new game at any time.
- **Draw detection**: Detects when the game is a draw and displays an appropriate message.
- **Current Move Display**: For the current move, the history list will display a message like “You are at move #…” instead of a clickable button. This helps indicate the player's current position in the game history.
- **Highlight Winning Squares**: When a player wins, the three squares that caused the win are highlighted to show the winning line. If the game ends in a draw, a message will be displayed indicating the result.
- **Public Hosting**: The game is hosted publicly, allowing easy access to play the game online. Platforms like Vercel or Netlify can be used for deployment.

## Technologies Used

- **React**: Core framework for the game.
- **React Icons**: Used for rendering `X` and `O` symbols with `FaCircleNotch`, `FaXmark`, and others.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **JavaScript (ES6+)**: Core game logic.
