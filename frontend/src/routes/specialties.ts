function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("pt-BR");
}

export function filterMedicalSpecialties(specialties: readonly string[], query: string) {
  const normalizedQuery = normalizeSearch(query.trim());
  return specialties.filter((specialty) =>
    normalizeSearch(specialty).includes(normalizedQuery),
  );
}

export function getSuggestedMedicalSpecialties(specialties: readonly string[], limit = 12) {
  return specialties.slice(0, limit);
}

export function findMedicalSpecialty(specialties: readonly string[], query: string) {
  const normalizedQuery = normalizeSearch(query.trim());
  return specialties.find((specialty) => normalizeSearch(specialty) === normalizedQuery);
}

export async function loadMedicalSpecialties(): Promise<string[]> {
  const response = await fetch("/api/medical-specialties");
  if (!response.ok) {
    throw new Error("Não foi possível carregar as especialidades médicas.");
  }

  const data: unknown = await response.json();
  if (
    typeof data !== "object"
    || data === null
    || !("specialties" in data)
    || !Array.isArray(data.specialties)
    || !data.specialties.every((specialty) => typeof specialty === "string")
  ) {
    throw new Error("A resposta do catálogo de especialidades é inválida.");
  }

  return data.specialties;
}
