import {useCallback, useEffect, useState} from 'react';
import {ControlPanel} from './components/ControlPanel.jsx';
import {GameBoard} from './components/GameBoard.jsx';
import {ResultScreen} from './components/ResultScreen.jsx';
import {SplashScreen} from './components/SplashScreen.jsx';
import {
  createBoard,
  getComputerMove,
  getCurrentSign,
  getResult,
} from './game.js';

const STORAGE_KEY = 'lab5-tic-tac-toe';
const SPLASH_DELAY = 1500;
const COMPUTER_DELAY = 400;

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

    return true;
  } catch {
    return false;
  }
}

function readOption(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback;
}

function readScore(value) {
  const score = {X: 0, O: 0, draw: 0};

  for (const key of Object.keys(score)) {
    const count = value?.[key];

    if (Number.isInteger(count) && count >= 0) {
      score[key] = count;
    }
  }

  return score;
}

function getStatusText(mode, current, computerTurn, result) {
  if (result !== null) {
    return 'Партия завершена';
  }

  if (mode === 'pvp') {
    return `Ходят ${current === 'X' ? 'крестики' : 'нолики'}`;
  }

  return computerTurn ? 'Ходит компьютер' : 'Ваш ход';
}

export function App() {
  const [saved] = useState(loadSettings);
  const [splashVisible, setSplashVisible] = useState(true);
  const [storageReady, setStorageReady] = useState(true);
  const [mode, setMode] = useState(() =>
    readOption(saved?.mode, ['pvc', 'pvp'], 'pvc'),
  );
  const [difficulty, setDifficulty] = useState(() =>
    readOption(saved?.difficulty, ['easy', 'hard'], 'hard'),
  );
  const [humanSign, setHumanSign] = useState(() =>
    readOption(saved?.humanSign, ['X', 'O'], 'X'),
  );
  const [score, setScore] = useState(() => readScore(saved?.score));
  const [board, setBoard] = useState(createBoard);

  const result = getResult(board);
  const current = getCurrentSign(board);
  const computerTurn =
    mode === 'pvc' && result === null && current !== humanSign;

  useEffect(() => {
    const timer = setTimeout(() => setSplashVisible(false), SPLASH_DELAY);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setStorageReady(saveSettings({mode, difficulty, humanSign, score}));
  }, [mode, difficulty, humanSign, score]);

  const makeMove = useCallback(
    (index) => {
      if (result !== null || board[index] !== null) {
        return;
      }

      const next = board.slice();

      next[index] = current;

      const nextResult = getResult(next);

      setBoard(next);

      if (nextResult !== null) {
        setScore((previous) => {
          const key = nextResult.winner === null ? 'draw' : nextResult.winner;

          return {...previous, [key]: previous[key] + 1};
        });
      }
    },
    [board, current, result],
  );

  useEffect(() => {
    if (!computerTurn) {
      return undefined;
    }

    const timer = setTimeout(() => {
      const move = getComputerMove(board, current, difficulty);

      if (move !== null) {
        makeMove(move);
      }
    }, COMPUTER_DELAY);

    return () => clearTimeout(timer);
  }, [computerTurn, board, current, difficulty, makeMove]);

  const restart = useCallback(() => setBoard(createBoard()), []);

  const hideSplash = useCallback(() => setSplashVisible(false), []);

  const handleCellClick = useCallback(
    (index) => {
      if (computerTurn) {
        return;
      }

      makeMove(index);
    },
    [computerTurn, makeMove],
  );

  const handleModeChange = useCallback(
    (value) => {
      setMode(value);
      restart();
    },
    [restart],
  );

  const handleDifficultyChange = useCallback(
    (value) => {
      setDifficulty(value);
      restart();
    },
    [restart],
  );

  const handleSignChange = useCallback(
    (value) => {
      setHumanSign(value);
      restart();
    },
    [restart],
  );

  return (
    <div className="game">
      <h1 className="game-title">Крестики-нолики</h1>

      <dl className="score">
        <div className="score-item">
          <dt>Крестики</dt>
          <dd>{score.X}</dd>
        </div>
        <div className="score-item">
          <dt>Ничьи</dt>
          <dd>{score.draw}</dd>
        </div>
        <div className="score-item">
          <dt>Нолики</dt>
          <dd>{score.O}</dd>
        </div>
      </dl>

      <ControlPanel
        mode={mode}
        difficulty={difficulty}
        humanSign={humanSign}
        onModeChange={handleModeChange}
        onDifficultyChange={handleDifficultyChange}
        onSignChange={handleSignChange}
        onRestart={restart}
      />

      <p className="status">
        {getStatusText(mode, current, computerTurn, result)}
      </p>

      {storageReady ? null : (
        <p className="notice">Настройки не сохраняются: хранилище недоступно</p>
      )}

      <div className="stage">
        <GameBoard
          board={board}
          result={result}
          locked={computerTurn}
          onCellClick={handleCellClick}
        />
        {result === null ? null : (
          <ResultScreen result={result} mode={mode} humanSign={humanSign} />
        )}
      </div>

      {splashVisible ? <SplashScreen onStart={hideSplash} /> : null}
    </div>
  );
}
