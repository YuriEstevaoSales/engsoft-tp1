import { BRAZILIAN_STATES, type InsuranceOption } from "../../routes/doctor-search.js";

interface FilterPanelProps {
  isOpen: boolean;
  minRating: string;
  onMinRatingChange: (rating: string) => void;
  state: string;
  onStateChange: (state: string) => void;
  insuranceId: string;
  onInsuranceChange: (insuranceId: string) => void;
  insurances: InsuranceOption[];
}

export function FilterPanel({
  isOpen,
  minRating,
  onMinRatingChange,
  state,
  onStateChange,
  insuranceId,
  onInsuranceChange,
  insurances,
}: FilterPanelProps) {
  if (!isOpen) return null;

  return (
    <section className="mb-6 rounded-xl border border-[#cbd8d4] bg-white p-4">
      <div className="grid gap-4 md:grid-cols-3">
        <label className="text-sm font-semibold">
          Avaliação
          <select
            value={minRating}
            onChange={(e) => onMinRatingChange(e.currentTarget.value)}
            className="mt-2 block w-full rounded border border-[#cbd8d4] px-3 py-2 font-normal"
          >
            <option value="">Todas as avaliações</option>
            <option value="3">Mais de 3</option>
            <option value="4">Mais de 4</option>
            <option value="5">5</option>
          </select>
        </label>
        <label className="text-sm font-semibold">
          Estado
          <select
            value={state}
            onChange={(e) => onStateChange(e.currentTarget.value)}
            className="mt-2 block w-full rounded border border-[#cbd8d4] px-3 py-2 font-normal"
          >
            <option value="">Todos os estados</option>
            {BRAZILIAN_STATES.map(([abbreviation, name]) => (
              <option key={abbreviation} value={abbreviation}>{name}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold">
          Convênio
          <select
            value={insuranceId}
            onChange={(e) => onInsuranceChange(e.currentTarget.value)}
            className="mt-2 block w-full rounded border border-[#cbd8d4] px-3 py-2 font-normal"
          >
            <option value="">Todos os convênios</option>
            {insurances.map((insurance) => (
              <option key={insurance.id} value={insurance.id}>{insurance.name}</option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
