function OptionGroup({label, options, value, onChange}) {
  return (
    <div className="option-group">
      <span className="option-label">{label}</span>
      <div className="option-buttons">
        {options.map((option) => (
          <button
            key={option.value}
            className={
              option.value === value
                ? 'button button-option is-active'
                : 'button button-option'
            }
            type="button"
            aria-pressed={option.value === value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ControlPanel({
  mode,
  difficulty,
  humanSign,
  onModeChange,
  onDifficultyChange,
  onSignChange,
  onRestart,
}) {
  return (
    <div className="controls">
      <OptionGroup
        label="Режим"
        value={mode}
        onChange={onModeChange}
        options={[
          {value: 'pvc', label: 'Против компьютера'},
          {value: 'pvp', label: 'Два игрока'},
        ]}
      />

      {mode === 'pvc' ? (
        <OptionGroup
          label="Сложность"
          value={difficulty}
          onChange={onDifficultyChange}
          options={[
            {value: 'easy', label: 'Лёгкая'},
            {value: 'hard', label: 'Непобедимая'},
          ]}
        />
      ) : null}

      {mode === 'pvc' ? (
        <OptionGroup
          label="Ваш знак"
          value={humanSign}
          onChange={onSignChange}
          options={[
            {value: 'X', label: 'X'},
            {value: 'O', label: 'O'},
          ]}
        />
      ) : null}

      <button
        className="button button-primary"
        type="button"
        data-testid="game-restart"
        onClick={onRestart}
      >
        Новая игра
      </button>
    </div>
  );
}
