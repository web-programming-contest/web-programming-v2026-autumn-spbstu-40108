interface PriceRangeSliderProps {
  minBound: number;
  maxBound: number;
  minValue: string;
  maxValue: string;
  onChange: (next: { minPrice: string; maxPrice: string }) => void;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function PriceRangeSlider({
  minBound,
  maxBound,
  minValue,
  maxValue,
  onChange,
}: PriceRangeSliderProps): JSX.Element {
  const safeMinBound = Math.min(minBound, maxBound);
  const safeMaxBound = Math.max(minBound, maxBound);
  const range = Math.max(1, safeMaxBound - safeMinBound);

  const numericMin = Number(minValue);
  const numericMax = Number(maxValue);
  const resolvedMin =
    minValue.trim() === '' || !Number.isFinite(numericMin)
      ? safeMinBound
      : clamp(numericMin, safeMinBound, safeMaxBound);
  const resolvedMax =
    maxValue.trim() === '' || !Number.isFinite(numericMax)
      ? safeMaxBound
      : clamp(numericMax, safeMinBound, safeMaxBound);

  const displayMin = Math.min(resolvedMin, resolvedMax);
  const displayMax = Math.max(resolvedMin, resolvedMax);
  const minPercent = ((displayMin - safeMinBound) / range) * 100;
  const maxPercent = ((displayMax - safeMinBound) / range) * 100;

  const handleMinChange = (nextValue: number): void => {
    const nextMin = Math.min(nextValue, displayMax);
    onChange({
      minPrice: String(nextMin),
      maxPrice: maxValue,
    });
  };

  const handleMaxChange = (nextValue: number): void => {
    const nextMax = Math.max(nextValue, displayMin);
    onChange({
      minPrice: minValue,
      maxPrice: String(nextMax),
    });
  };

  return (
    <div className="relative mt-4 h-5">
      <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-line" />
      <div
        className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-mint"
        style={{
          left: `${minPercent}%`,
          width: `${Math.max(0, maxPercent - minPercent)}%`,
        }}
      />

      <input
        type="range"
        min={safeMinBound}
        max={safeMaxBound}
        step={10}
        value={displayMin}
        aria-label="Минимальная цена"
        onChange={(event) => handleMinChange(Number(event.target.value))}
        className="price-range-slider"
      />
      <input
        type="range"
        min={safeMinBound}
        max={safeMaxBound}
        step={10}
        value={displayMax}
        aria-label="Максимальная цена"
        onChange={(event) => handleMaxChange(Number(event.target.value))}
        className="price-range-slider"
      />
    </div>
  );
}
