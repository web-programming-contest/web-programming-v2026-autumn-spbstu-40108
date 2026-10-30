export function SplashScreen({onStart}) {
  return (
    <div className="splash">
      <p className="splash-mark">X O</p>
      <h2 className="splash-title">Крестики-нолики</h2>
      <p className="splash-text">
        Классическая игра на поле три на три. Против компьютера или вдвоём.
      </p>
      <button className="button button-primary" type="button" onClick={onStart}>
        Начать игру
      </button>
    </div>
  );
}
