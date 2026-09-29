import { useEffect, useRef, useState } from "react";
import { loadMedicalSpecialties } from "../routes/specialties.js";

export function useCatalog() {
  const [specialtyCatalog, setSpecialtyCatalog] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const specialtyCatalogRef = useRef<string[] | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const catalog = await loadMedicalSpecialties();
        setSpecialtyCatalog(catalog);
        specialtyCatalogRef.current = catalog;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar especialidades.");
      }
    }
    void load();
  }, []);

  return { specialtyCatalog, error, specialtyCatalogRef };
}
