// useState: tic tac toe
// 💯 useLocalStorageState
// http://localhost:3000/isolated/final/04.extra-2.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Board({ board, onClick }) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {board[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const emptyBoard = Array(9).fill(null)

  const [boardHistory, setBoardHistory] = useLocalStorageState('tic-tac-toe:history', [ emptyBoard ])

  const currentBoard = boardHistory[boardHistory.length - 1]
  const nextValue = calculateNextValue(currentBoard)
  const winner = calculateWinner(currentBoard)
  const status = calculateStatus(winner, currentBoard, nextValue)

  const selectSquare = (boardIdx) => {
    if (winner || currentBoard[boardIdx]) return

    const newBoard = [...currentBoard]
    newBoard[boardIdx] = nextValue
    setBoardHistory([...boardHistory, newBoard])
  }

  const restart = () => {
    setBoardHistory([emptyBoard])
  }

  const jumpToPreviousGameStatus = (index) => {
    const newBoardHistory = boardHistory
    setBoardHistory(newBoardHistory)
  }

  const moves = boardHistory.map((board, idx) => {
    const description = idx > 0 ? `Go to move #${idx}` : `Go to game start`
    return (
      <li key={idx}>
        <button onClick={(idx) => jumpToPreviousGameStatus(idx)}>
          {description}
        </button>
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board board={currentBoard} onClick={selectSquare} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
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
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
