const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function createBoard() {
  return Array(9).fill(null);
}

export function getResult(board) {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;

    if (board[a] !== null && board[a] === board[b] && board[a] === board[c]) {
      return {winner: board[a], line};
    }
  }

  if (board.every((cell) => cell !== null)) {
    return {winner: null, line: null};
  }

  return null;
}

export function getCurrentSign(board) {
  let crosses = 0;
  let noughts = 0;

  for (const cell of board) {
    if (cell === 'X') {
      crosses += 1;
    } else if (cell === 'O') {
      noughts += 1;
    }
  }

  return crosses === noughts ? 'X' : 'O';
}

function getOpponent(sign) {
  return sign === 'X' ? 'O' : 'X';
}

function getEmptyCells(board) {
  const cells = [];

  for (let index = 0; index < board.length; index += 1) {
    if (board[index] === null) {
      cells.push(index);
    }
  }

  return cells;
}

function minimax(board, currentSign, aiSign, depth) {
  const result = getResult(board);

  if (result !== null) {
    if (result.winner === aiSign) {
      return 10 - depth;
    }

    if (result.winner === null) {
      return 0;
    }

    return depth - 10;
  }

  const isAiTurn = currentSign === aiSign;
  let best = isAiTurn ? -Infinity : Infinity;

  for (const index of getEmptyCells(board)) {
    board[index] = currentSign;

    const score = minimax(board, getOpponent(currentSign), aiSign, depth + 1);

    board[index] = null;
    best = isAiTurn ? Math.max(best, score) : Math.min(best, score);
  }

  return best;
}

function getRandomMove(board) {
  const empty = getEmptyCells(board);

  if (empty.length === 0) {
    return null;
  }

  return empty[Math.floor(Math.random() * empty.length)];
}

function getBestMove(board, aiSign) {
  const empty = getEmptyCells(board);

  if (empty.length === 0) {
    return null;
  }

  const working = board.slice();
  let bestScore = -Infinity;
  let bestMove = empty[0];

  for (const index of empty) {
    working[index] = aiSign;

    const score = minimax(working, getOpponent(aiSign), aiSign, 0);

    working[index] = null;

    if (score > bestScore) {
      bestScore = score;
      bestMove = index;
    }
  }

  return bestMove;
}

export function getComputerMove(board, aiSign, difficulty) {
  if (difficulty === 'easy') {
    return getRandomMove(board);
  }

  return getBestMove(board, aiSign);
}
