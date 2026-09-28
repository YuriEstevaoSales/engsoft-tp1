import { getSuggestedMedicalSpecialties } from "../routes/specialties.js";

type Props = {
  specialties: string[];
  loading: boolean;
  error: string;
  selected: string;
  onSelect: (value: string) => void;
};

export function HomeSpecialtySuggestions({ specialties, loading, error, selected, onSelect }: Props) {
  const suggestions = getSuggestedMedicalSpecialties(specialties);

  if (loading) {
    return <p className="my-3 text-sm text-[#405e5a]" role="status">Carregando especialidades...</p>;
  }
  if (error) {
    return <p className="my-3 text-sm text-[#9b3535]" role="alert">{error}</p>;
  }
  if (!suggestions.length) {
    return <p className="my-3 text-sm text-[#405e5a]">Nenhuma especialidade disponível.</p>;
  }

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {suggestions.map((specialty) => (
        <button
          className={`rounded-full border px-4 py-2 text-[0.79rem] font-semibold text-white transition hover:-translate-y-px hover:bg-[#155650] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-amber-400 ${selected === specialty ? "border-white bg-[#2e9a50]" : "border-transparent bg-[#1b6964]"}`}
          key={specialty}
          type="button"
          aria-pressed={selected === specialty}
          onClick={() => onSelect(specialty)}
        >
          {specialty}
        </button>
      ))}
    </div>
  );
}
