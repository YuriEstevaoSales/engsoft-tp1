import type { InsuranceOption, SearchDoctor, SearchFilters } from "./doctor-search-types.js";
import { isInsuranceOption, isSearchDoctor } from "./doctor-search-validation.js";

export async function loadDoctorsBySpecialty(
  specialty: string,
  filters: SearchFilters = {},
): Promise<SearchDoctor[]> {
  const params = new URLSearchParams({ specialty });
  if (filters.minRating) params.set("minRating", String(filters.minRating));
  if (filters.insuranceId) params.set("insuranceId", String(filters.insuranceId));
  if (filters.state) params.set("state", filters.state);
  const response = await fetch(`/api/doctors/search?${params}`);
  if (!response.ok) {
    throw new Error("Não foi possível carregar os médicos desta especialidade.");
  }

  const data: unknown = await response.json();
  if (
    typeof data !== "object"
    || data === null
    || !("count" in data)
    || typeof data.count !== "number"
    || !("doctors" in data)
    || !Array.isArray(data.doctors)
    || !data.doctors.every(isSearchDoctor)
    || data.count !== data.doctors.length
  ) {
    throw new Error("A resposta da busca de médicos é inválida.");
  }
  return data.doctors;
}

export async function loadInsurances(): Promise<InsuranceOption[]> {
  const response = await fetch("/api/insurances");
  if (!response.ok) {
    throw new Error("Não foi possível carregar a lista de convênios.");
  }

  const data: unknown = await response.json();
  if (
    typeof data !== "object"
    || data === null
    || !("insurances" in data)
    || !Array.isArray(data.insurances)
    || !data.insurances.every(isInsuranceOption)
  ) {
    throw new Error("A resposta da lista de convênios é inválida.");
  }

  return data.insurances;
}
