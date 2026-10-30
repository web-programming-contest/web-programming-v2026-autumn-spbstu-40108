import {useEffect, useRef} from 'react';

const SIZE = 324;
const CELL = SIZE / 3;
const PADDING = 30;

const COLORS = {
  background: 'rgb(30 33 48)',
  grid: 'rgb(86 94 128)',
  cross: 'rgb(244 128 150)',
  nought: 'rgb(122 170 255)',
  line: 'rgb(126 214 150)',
};

function drawGrid(context) {
  context.fillStyle = COLORS.background;
  context.fillRect(0, 0, SIZE, SIZE);
  context.strokeStyle = COLORS.grid;
  context.lineWidth = 3;

  for (let index = 1; index < 3; index += 1) {
    context.beginPath();
    context.moveTo(index * CELL, 12);
    context.lineTo(index * CELL, SIZE - 12);
    context.stroke();

    context.beginPath();
    context.moveTo(12, index * CELL);
    context.lineTo(SIZE - 12, index * CELL);
    context.stroke();
  }
}

function drawCross(context, centerX, centerY) {
  const arm = CELL / 2 - PADDING;

  context.strokeStyle = COLORS.cross;
  context.lineWidth = 8;
  context.lineCap = 'round';
  context.beginPath();
  context.moveTo(centerX - arm, centerY - arm);
  context.lineTo(centerX + arm, centerY + arm);
  context.moveTo(centerX + arm, centerY - arm);
  context.lineTo(centerX - arm, centerY + arm);
  context.stroke();
}

function drawNought(context, centerX, centerY) {
  context.strokeStyle = COLORS.nought;
  context.lineWidth = 8;
  context.beginPath();
  context.arc(centerX, centerY, CELL / 2 - PADDING, 0, Math.PI * 2);
  context.stroke();
}

function drawWinLine(context, line) {
  const [start, , end] = line;
  const startX = (start % 3) * CELL + CELL / 2;
  const startY = Math.floor(start / 3) * CELL + CELL / 2;
  const endX = (end % 3) * CELL + CELL / 2;
  const endY = Math.floor(end / 3) * CELL + CELL / 2;

  context.strokeStyle = COLORS.line;
  context.lineWidth = 9;
  context.lineCap = 'round';
  context.beginPath();
  context.moveTo(startX, startY);
  context.lineTo(endX, endY);
  context.stroke();
}

function getCellLabel(sign, index) {
  if (sign === null) {
    return `Клетка ${index + 1}, пусто`;
  }

  return `Клетка ${index + 1}, ${sign}`;
}

export function GameBoard({board, result, locked, onCellClick}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas === null ? null : canvas.getContext('2d');

    if (context === null) {
      return;
    }

    const ratio = window.devicePixelRatio || 1;

    canvas.width = SIZE * ratio;
    canvas.height = SIZE * ratio;
    context.scale(ratio, ratio);
    drawGrid(context);

    for (let index = 0; index < board.length; index += 1) {
      const sign = board[index];

      if (sign !== null) {
        const centerX = (index % 3) * CELL + CELL / 2;
        const centerY = Math.floor(index / 3) * CELL + CELL / 2;

        if (sign === 'X') {
          drawCross(context, centerX, centerY);
        } else {
          drawNought(context, centerX, centerY);
        }
      }
    }

    if (result !== null && result.line !== null) {
      drawWinLine(context, result.line);
    }
  }, [board, result]);

  return (
    <div className="board" data-testid="game-board">
      <canvas className="board-canvas" ref={canvasRef} />
      <div className="board-cells">
        {board.map((sign, index) => (
          <button
            key={index}
            className="cell"
            type="button"
            data-testid="game-cell"
            aria-label={getCellLabel(sign, index)}
            disabled={locked || sign !== null || result !== null}
            onClick={() => onCellClick(index)}
          >
            <span className="cell-sign">{sign === null ? '' : sign}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
