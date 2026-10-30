function getTitle(result, mode, humanSign) {
  if (result.winner === null) {
    return 'Ничья';
  }

  if (mode === 'pvp') {
    return result.winner === 'X' ? 'Победили крестики' : 'Победили нолики';
  }

  return result.winner === humanSign ? 'Вы победили' : 'Победил компьютер';
}

export function ResultScreen({result, mode, humanSign}) {
  return (
    <div className="result">
      <h2 className="result-title">{getTitle(result, mode, humanSign)}</h2>
      <p className="result-text">
        {result.winner === null
          ? 'Поле заполнено, победителя нет'
          : 'Три знака в ряд'}
      </p>
    </div>
  );
}
