import { useEffect, useRef, useState } from "react";
import { loadInsurances } from "../../routes/doctor-search.js";
import { loadMedicalSpecialties } from "../../routes/specialties.js";
import type { InsuranceOption } from "../../routes/doctor-search.js";

export function useCatalog() {
  const [specialtyCatalog, setSpecialtyCatalog] = useState<string[]>([]);
  const [insurances, setInsurances] = useState<InsuranceOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const specialtyCatalogRef = useRef<string[] | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [catalog, insuranceOptions] = await Promise.all([
          loadMedicalSpecialties(),
          loadInsurances(),
        ]);
        setSpecialtyCatalog(catalog);
        specialtyCatalogRef.current = catalog;
        setInsurances(insuranceOptions);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar especialidades.");
      }
    }
    void load();
  }, []);

  return { specialtyCatalog, insurances, error, specialtyCatalogRef };
}
