import { useState } from 'react';
import { FaCircleNotch } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { BsSortNumericDown, BsSortNumericUp } from "react-icons/bs";
import { FaClockRotateLeft } from "react-icons/fa6";
import './App.css';

const cx = (...classes) => classes.filter(Boolean).join(' ');

function Square({ value, onSquareClick, className, isWinningSquare, xIsNext, winner }) {
  return (
    <button className={cx("flex items-center justify-center square", className)} onClick={onSquareClick}>
      <div className={`w-[90%] h-[90%] flex items-center justify-center
        ${isWinningSquare ? "bg-white shadow-lg scale-110 transform transition-transform ease-out duration-200" : ""}
        hover:bg-white rounded-xl sm:rounded-3xl hover:scale-110 transform 
        transition-transform ease-out duration-200 group`}>
        {value === 'X' ? (
          <FaCircleNotch className="text-red-500 w-12 h-12 xsm:w-16 xsm:h-16 sm:w-20 sm:h-20" />
        ) : value === 'O' ? (
          <FaXmark className="text-blue-500 w-14 h-14 xsm:w-24 xsm:h-24 sm:w-28 sm:h-28" />
        ) :
          xIsNext ? (
            <FaCircleNotch className="group-hover:flex hidden text-zinc-500 w-12 h-12 xsm:w-16 xsm:h-16 sm:w-20 sm:h-20" />
          ) : (
            <FaXmark className="group-hover:flex hidden text-zinc-500 w-14 h-14 xsm:w-24 xsm:h-24 sm:w-28 sm:h-28" />
          )
        }
      </div>
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, winner }) {
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
    onPlay(nextSquares, i);
  }

  const result = calculateWinner(squares);
  const winningLine = result ? result.line : [];

  return (
    <>
      {Array(3).fill(null).map((_, rowIndex) => (
        <div className="board-row grid grid-cols-3 h-full w-full" key={rowIndex}>
          {Array(3).fill(null).map((_, colIndex) => {
            const index = rowIndex * 3 + colIndex;
            const isWinningSquare = winningLine.includes(index);
            return (
              <Square
                key={index}
                value={squares[index]}
                onSquareClick={() => handleClick(index)}
                className={`w-full h-full flex items-center justify-center bg-indigo-100 
                  ${rowIndex < 2 ? 'border-b-4' : ''} 
                  ${colIndex < 2 ? 'border-r-4' : ''}
                  ${rowIndex === 0 && colIndex === 0 ? 'rounded-tl-3xl' : ''}
                  ${rowIndex === 0 && colIndex === 2 ? 'rounded-tr-3xl' : ''}
                  ${rowIndex === 2 && colIndex === 0 ? 'rounded-bl-3xl' : ''}
                  ${rowIndex === 2 && colIndex === 2 ? 'rounded-br-3xl' : ''}
                  border-white rounded-none hover:border-white p-2 focus:outline-none`}
                isWinningSquare={isWinningSquare}
                xIsNext={xIsNext}
                winner={winner}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), location: null }]);
  const [showHistory, setShowHistory] = useState(true);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares, index) {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const location = `(${row + 1}, ${col + 1})`;

    const nextHistory = [...history.slice(0, currentMove + 1), { squares: nextSquares, location }];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    // Move the current player update here
    const nextPlayer = xIsNext ? 'O' : 'X';
    setCurrentPlayer(nextPlayer);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setCurrentPlayer(nextMove % 2 === 0 ? 'X' : 'O');
  }

  function handleNewGame() {
    setHistory([{ squares: Array(9).fill(null), location: null }]);
    setCurrentMove(0);
    setCurrentPlayer('X');
  }

  const moves = history.map((step, move) => {
    let description;
    if (move > 0) {
      description = `Go to move #${move} at ${step.location}`;
    } else {
      description = 'Go to game start';
    }

    return (
      <li key={move} className='flex flex-row items-center justify-between px-4 text-sm'>
        <p className='font-bold'>{move + 1}.</p>
        {move === currentMove ? (
          <p className='p-1 my-1 font-bold'>{description}</p>
        ) : (
          <button
            className='p-1 my-1 font-normal hover:bg-white'
            onClick={() => jumpTo(move)}>
            {description}
          </button>
        )}
      </li>
    );
  }).sort((a, b) => (isAscending ? a.key - b.key : b.key - a.key));

  return (
    <div className="game flex flex-col w-screen h-screen justify-center items-center">
      <h1 className="text-4xl font-bold mb-6">Tic Tac Toe</h1>
      <div className="game-board flex flex-col w-[300px] h-[300px] xsm:w-[400px] xsm:h-[400px] sm:w-[500px] sm:h-[500px] bg-indigo-100 items-center justify-center rounded-3xl border-[1px] border-white p-4 relative">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} winner={calculateWinner(currentSquares)?.winner} />
        <div className={`game-info absolute max-lg:hidden sm:-right-64 bg-indigo-50 h-[500px] w-56 rounded-3xl border ${showHistory ? 'animate-fade' : 'hidden'}`}>
          <button className="w-full h-16 bg-indigo-200 rounded-t-3xl rounded-b-none mb-2 group" onClick={() => setAscending(!isAscending)}>
            <div className='flex flex-row items-center justify-between'>
              <div className='flex flex-col items-start'>
                <p className='font-bold'>History List</p>
                <p className='text-xs'>{isAscending ? "Ascending Order" : "Descending Order"}</p>
              </div>
              <BsSortNumericDown className={`w-10 h-10 p-1 rounded-lg group-hover:bg-indigo-50 hover:bg-bg-indigo-50 ${isAscending ? '' : 'hidden'}`} onClick={() => setAscending(!isAscending)} />
              <BsSortNumericUp className={`w-10 h-10 p-1 rounded-lg group-hover:bg-indigo-50 hover:bg-indigo-50 ${isAscending ? 'hidden' : ''}`} onClick={() => setAscending(!isAscending)} />
            </div>
          </button>
          <ol className='flex flex-col'>{moves}</ol>
        </div>
      </div>
      <div className='flex justify-between w-[300px] xsm:w-[400px] sm:w-[500px] h-16 bg-indigo-200 mt-6 rounded-3xl p-2'>
        <div className='flex flex-row w-[45%] h-full bg-indigo-50 rounded-xl items-center justify-between px-2 sm:px-4'>
          <p className='text-xs xsm:text-base sm:text-lg font-bold text-nowrap'>Current Player: </p>
          {currentPlayer === 'X' ? (
            <FaCircleNotch className="text-red-500 w-4 h-4 xsm:w-6 xsm:h-6 sm:w-8 sm:h-8" />
          ) : (
            <FaXmark className="text-blue-500 w-6 h-6 xsm:w-8 xm:h-8 sm:w-10 sm:h-10" />
          )}
        </div>
        <button
          className='flex flex-row w-[25%] h-full bg-indigo-50 hover:bg-white rounded-xl items-center justify-center px-2'
          onClick={handleNewGame}>
          <p className='text-xs xsm:text-base sm:text-lg text-nowrap'>New Game </p>
        </button>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className='group flex flex-row w-[25%] h-full bg-indigo-50 hover:bg-white rounded-xl items-center justify-center px-2'>
          <FaClockRotateLeft className='max-xsm:hidden mr-2 w-4 h-4' />
          <p className='text-xs xsm:text-base sm:text-lg'>History </p>
        </button>
      </div>
      {/* Sidebar */}
      <aside className={`flex flex-col absolute ${showHistory ? '' : 'hidden'} lg:hidden right-0 w-16 lg:w-52 xlg:w-64 min-h-screen bg-indigo-50 transform ${showHistory ? 'translate-x-0 w-52' : 'translate-x-full'} transition-transform duration-300 z-50`}>
        <button className="w-full h-16 bg-indigo-200 rounded-none mb-2 group" onClick={() => setAscending(!isAscending)}>
          <div className='flex flex-row items-center justify-between'>
            <div className='flex flex-col items-start'>
              <p className='font-bold'>History List</p>
              <p className='text-xs'>{isAscending ? "Ascending Order" : "Descending Order"}</p>
            </div>
            <BsSortNumericDown className={`w-10 h-10 p-1 rounded-lg group-hover:bg-indigo-50 hover:bg-bg-indigo-50 ${isAscending ? '' : 'hidden'}`} onClick={() => setAscending(!isAscending)} />
            <BsSortNumericUp className={`w-10 h-10 p-1 rounded-lg group-hover:bg-indigo-50 hover:bg-indigo-50 ${isAscending ? 'hidden' : ''}`} onClick={() => setAscending(!isAscending)} />
          </div>
        </button>
        <ol className='flex flex-col'>{moves}</ol>
      </aside>
      {/* Overlay for closing the sidebar */}
      {showHistory && (
        <div
          className="fixed inset-0 bg-black lg:hidden opacity-50 z-10"
          onClick={() => setShowHistory(!showHistory)} // Close sidebar when clicking on the overlay
        ></div>
      )}
    </div>
  );
}


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6],            // diagonals
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] }; // return both winner and winning line
    }
  }
  return null;
}
