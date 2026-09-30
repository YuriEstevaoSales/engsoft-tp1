import {
  BRAZILIAN_STATES,
  createMedicalSpecialtySlug,
  type InsuranceOption,
} from "../../routes/doctor-search.js";

export function toggleSpecialtySelection(slugs: readonly string[], slug: string): string[] {
  return slugs.includes(slug)
    ? slugs.filter((item) => item !== slug)
    : [...slugs, slug];
}

interface FilterPanelProps {
  isOpen: boolean;
  selectedSpecialtySlugs: string[];
  specialties: string[];
  onSpecialtyChange: (specialtySlugs: string[]) => void;
  minRating: string;
  onMinRatingChange: (rating: string) => void;
  state: string;
  onStateChange: (state: string) => void;
  city: string;
  onCityChange: (city: string) => void;
  municipalities: string[];
  municipalitiesLoading: boolean;
  insuranceId: string;
  onInsuranceChange: (insuranceId: string) => void;
  insurances: InsuranceOption[];
}

export function FilterPanel({
  isOpen,
  selectedSpecialtySlugs,
  specialties,
  onSpecialtyChange,
  minRating,
  onMinRatingChange,
  state,
  onStateChange,
  city,
  onCityChange,
  municipalities,
  municipalitiesLoading,
  insuranceId,
  onInsuranceChange,
  insurances,
}: FilterPanelProps) {
  if (!isOpen) return null;

  return (
    <section className="mb-6 rounded-xl border border-[#cbd8d4] bg-white p-4">
      <div className="grid gap-4 md:grid-cols-5">
        <fieldset className="text-sm font-semibold">
          <legend>Especialidade</legend>
          <div className="mt-2 max-h-40 space-y-2 overflow-y-auto rounded border border-[#cbd8d4] p-3 font-normal">
            {specialties.map((specialty) => {
              const specialtySlug = createMedicalSpecialtySlug(specialty);
              const checked = selectedSpecialtySlugs.includes(specialtySlug);
              return (
                <label key={specialty} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={checked && selectedSpecialtySlugs.length === 1}
                    onChange={() => onSpecialtyChange(toggleSpecialtySelection(selectedSpecialtySlugs, specialtySlug))}
                  />
                  {specialty}
                </label>
              );
            })}
          </div>
        </fieldset>
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
          Cidade
          <select
            value={city}
            onChange={(e) => onCityChange(e.currentTarget.value)}
            disabled={!state || municipalitiesLoading}
            className="mt-2 block w-full rounded border border-[#cbd8d4] px-3 py-2 font-normal disabled:bg-[#f3f6f5]"
          >
            <option value="">{state ? "Todas as cidades" : "Selecione o estado"}</option>
            {municipalities.map((municipality) => (
              <option key={municipality} value={municipality}>{municipality}</option>
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
