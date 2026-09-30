import type { InsuranceOption, Municipality, SearchDoctor, SearchFilters } from "./doctor-search-types.js";
import { isInsuranceOption, isSearchDoctor } from "./doctor-search-validation.js";

export async function loadDoctorsBySpecialty(
  specialty: string | readonly string[],
  filters: SearchFilters = {},
): Promise<SearchDoctor[]> {
  const specialtyQuery = typeof specialty === "string" ? specialty : specialty.join(",");
  const params = new URLSearchParams({ specialty: specialtyQuery });
  if (filters.minRating) params.set("minRating", String(filters.minRating));
  if (filters.insuranceId) params.set("insuranceId", String(filters.insuranceId));
  if (filters.state) params.set("state", filters.state);
  if (filters.city) params.set("city", filters.city);
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

export async function loadMunicipalities(state: string): Promise<string[]> {
  const response = await fetch(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${encodeURIComponent(state)}/municipios`,
  );
  if (!response.ok) {
    throw new Error("Não foi possível carregar os municípios deste estado.");
  }
  const data: unknown = await response.json();
  if (!Array.isArray(data) || !data.every(isMunicipality)) {
    throw new Error("A resposta de municípios do IBGE é inválida.");
  }
  return data.map((municipality) => municipality.nome);
}

export async function loadUserLocation(userId: number): Promise<{ state: string; city: string | null } | null> {
  const response = await fetch(`/api/doctors/me?userId=${encodeURIComponent(String(userId))}`);
  if (!response.ok) return null;
  const data: unknown = await response.json();
  if (
    typeof data !== "object"
    || data === null
    || !("profile" in data)
    || typeof data.profile !== "object"
    || data.profile === null
    || !("stateAddress" in data.profile)
    || typeof data.profile.stateAddress !== "string"
    || !("city" in data.profile)
    || (data.profile.city !== null && typeof data.profile.city !== "string")
  ) {
    return null;
  }
  return { state: data.profile.stateAddress, city: data.profile.city };
}

function isMunicipality(value: unknown): value is Municipality {
  return typeof value === "object"
    && value !== null
    && "id" in value
    && typeof value.id === "number"
    && "nome" in value
    && typeof value.nome === "string";
}
