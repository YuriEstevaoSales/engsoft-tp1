import { useEffect, useState } from "react";
import { loadDoctorsBySpecialty, resolveMedicalSpecialtySlug, type SearchDoctor } from "../../routes/doctor-search.js";
import { loadMedicalSpecialties } from "../../routes/specialties.js";

interface UseDoctorSearchParams {
  specialtySlug: string;
  minRating: string;
  state: string;
  insuranceId: string;
  specialtyCatalogRef: React.MutableRefObject<string[] | null>;
}

export function useDoctorSearch({
  specialtySlug,
  minRating,
  state,
  insuranceId,
  specialtyCatalogRef,
}: UseDoctorSearchParams) {
  const [specialty, setSpecialty] = useState("");
  const [doctors, setDoctors] = useState<SearchDoctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!specialtySlug) {
      setDoctors([]);
      return;
    }
    let active = true;
    setLoading(true);
    setError(null);
    async function search() {
      const catalog = specialtyCatalogRef.current ?? await loadMedicalSpecialties();
      if (!active) return;
      const selected = resolveMedicalSpecialtySlug(catalog, specialtySlug);
      if (!selected) throw new Error("Especialidade não encontrada.");
      const results = await loadDoctorsBySpecialty(selected, {
        minRating: minRating ? Number(minRating) : undefined,
        state: state || undefined,
        insuranceId: insuranceId ? Number(insuranceId) : undefined,
      });
      if (active) {
        setSpecialty(selected);
        setDoctors(results);
      }
    }
    void search().catch((err) => {
      if (active) setError(err instanceof Error ? err.message : "Erro ao carregar médicos.");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [specialtySlug, minRating, state, insuranceId, specialtyCatalogRef]);

  return { specialty, doctors, loading, error };
}
