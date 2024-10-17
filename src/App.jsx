import { useState } from 'react';
import { FaCircleNotch } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import './App.css';

const cx = (...classes) => classes.filter(Boolean).join(' ');

function Square({ value, onSquareClick, className }) {
  return (
    <button className={cx("flex items-center justify-center square", className)} onClick={onSquareClick}>
      <div className="w-[90%] h-[90%] flex items-center justify-center hover:bg-white rounded-3xl hover:scale-110 transform transition-transform ease-out duration-200">
        {value === 'X' ?
          <FaCircleNotch className="text-red-500 w-20 h-20" /> :
          value === 'O' ?
            <FaXmark className="text-blue-500 w-28 h-28" /> : null
        }
      </div>
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      {Array(3).fill(null).map((_, rowIndex) => (
        <div className="board-row grid grid-cols-3 h-full w-full" key={rowIndex}>
          {Array(3).fill(null).map((_, colIndex) => {
            const index = rowIndex * 3 + colIndex;
            return (
              <Square
                key={index}
                value={squares[index]}
                onSquareClick={() => handleClick(index)}
                className={`w-full h-full flex items-center justify-center bg-indigo-100 
                  ${rowIndex < 2 ? 'border-b-4' : ''} 
                  ${colIndex < 2 ? 'border-r-4' : ''}
                  ${rowIndex == 0 && colIndex == 0 ? 'rounded-tl-3xl' : ''}
                  ${rowIndex == 0 && colIndex == 2 ? 'rounded-tr-3xl' : ''} 
                  ${rowIndex == 2 && colIndex == 0 ? 'rounded-bl-3xl' : ''} 
                  ${rowIndex == 2 && colIndex == 2 ? 'rounded-br-3xl' : ''} 
                  border-white rounded-none hover:border-white p-2 focus:outline-none`} />
            );
          })}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move, currentMove) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    const checkMove = currentMove.length == move + 1;
    return (
      <li key={move}>
        {checkMove ? (
          <p>{description}</p>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  return (
    <div className="game flex flex-row w-screen h-screen justify-center items-center">
      <div className="game-board flex flex-col w-[500px] h-[500px] bg-indigo-100 items-center justify-center rounded-3xl border-[1px] border-white p-4 relative">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        <div className="game-info absolute -right-64 bg-indigo-50 h-[500px] w-56 rounded-3xl">
          <button className="mb-4">Ascending order</button>
          <ol>{moves}</ol>
        </div>
      </div>
    </div>

  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
