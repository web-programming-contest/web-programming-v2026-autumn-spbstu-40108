export function PageLoader(): JSX.Element {
  return (
    <section
      role="status"
      aria-live="polite"
      className="flex min-h-[50vh] flex-col items-center justify-center gap-4 py-16"
    >
      <span
        aria-hidden="true"
        className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary"
      />
      <span className="text-sm text-muted">Загрузка...</span>
    </section>
  );
}
