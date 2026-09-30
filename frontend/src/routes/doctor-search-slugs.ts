export function createMedicalSpecialtySlug(specialty: string) {
  return specialty
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("pt-BR")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function createMedicalSpecialtiesSlug(specialties: readonly string[]) {
  return specialties.map(createMedicalSpecialtySlug).join(",");
}

export function resolveMedicalSpecialtySlug(
  specialties: readonly string[],
  slug: string,
) {
  return specialties.find(
    (specialty) => createMedicalSpecialtySlug(specialty) === slug,
  ) ?? null;
}

export function resolveMedicalSpecialtiesSlugs(
  specialties: readonly string[],
  slugs: string,
) {
  return slugs.split(",")
    .map((slug) => resolveMedicalSpecialtySlug(specialties, slug))
    .filter((specialty): specialty is string => specialty !== null);
}

export function extractMedicalSpecialtySlug(segment: string) {
  const prefix = "encontrar-medico-";
  if (!segment.startsWith(prefix)) return null;
  const slug = segment.slice(prefix.length);
  return slug || null;
}
