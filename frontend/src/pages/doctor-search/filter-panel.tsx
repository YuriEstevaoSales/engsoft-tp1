interface FilterPanelProps {
  isOpen: boolean;
  minRating: string;
  onMinRatingChange: (rating: string) => void;
}

export function FilterPanel({ isOpen, minRating, onMinRatingChange }: FilterPanelProps) {
  if (!isOpen) return null;

  return (
    <section className="mb-6 rounded-xl border border-[#cbd8d4] bg-white p-4">
      <label className="block text-sm font-semibold">Avaliação mínima</label>
      <input
        type="number"
        min="0"
        max="5"
        step="0.5"
        value={minRating}
        onChange={(e) => onMinRatingChange(e.currentTarget.value)}
        className="mt-2 w-full rounded border border-[#cbd8d4] px-3 py-2"
      />
    </section>
  );
}
