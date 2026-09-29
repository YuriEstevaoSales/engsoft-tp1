export type DoctorSearchFilters = {
  minimumRating: number | null;
  insuranceId: number | null;
  state: string | null;
};

type FilterableDoctor = {
  averageRating: number | null;
  insurances: readonly number[] | null;
  user: { stateAddress: string } | null;
};

const brazilianStates = [
  ["AC", "Acre"], ["AL", "Alagoas"], ["AP", "Amapá"], ["AM", "Amazonas"],
  ["BA", "Bahia"], ["CE", "Ceará"], ["DF", "Distrito Federal"], ["ES", "Espírito Santo"],
  ["GO", "Goiás"], ["MA", "Maranhão"], ["MT", "Mato Grosso"],
  ["MS", "Mato Grosso do Sul"], ["MG", "Minas Gerais"], ["PA", "Pará"],
  ["PB", "Paraíba"], ["PR", "Paraná"], ["PE", "Pernambuco"], ["PI", "Piauí"],
  ["RJ", "Rio de Janeiro"], ["RN", "Rio Grande do Norte"], ["RS", "Rio Grande do Sul"],
  ["RO", "Rondônia"], ["RR", "Roraima"], ["SC", "Santa Catarina"],
  ["SP", "São Paulo"], ["SE", "Sergipe"], ["TO", "Tocantins"],
] as const;

function normalizeState(value: string) {
  const normalized = value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLocaleUpperCase("pt-BR");
  const match = brazilianStates.find(
    ([uf, name]) => normalized === uf || normalized === name.normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLocaleUpperCase("pt-BR"),
  );
  return match?.[0] ?? normalized;
}

export function matchesDoctorSearchFilters<T extends FilterableDoctor>(
  doctor: T,
  filters: DoctorSearchFilters,
) {
  return (
    (filters.minimumRating === null
      || (doctor.averageRating !== null && doctor.averageRating >= filters.minimumRating))
    && (filters.insuranceId === null
      || doctor.insurances?.includes(filters.insuranceId) === true)
    && doctor.user !== null
    && (filters.state === null
      || normalizeState(doctor.user.stateAddress) === normalizeState(filters.state))
  );
}
