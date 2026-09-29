import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { HomeProof } from "./home-proof.js";
import { HomeSearch } from "./home-search.js";
import { HomeSteps } from "./home-steps.js";
import { loadMedicalSpecialties } from "../routes/specialties.js";
import { createMedicalSpecialtySlug } from "../routes/doctor-search.js";

export function HomePage() {
  const navigate = useNavigate();
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");

  useEffect(() => {
    let active = true;
    void loadMedicalSpecialties()
      .then((items) => { if (active) setSpecialties(items); })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "Não foi possível carregar as especialidades.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  function selectSpecialty(value: string) {
    setSearch(value);
    setSelected(value);
  }

  return (
    <main className="text-[#1c3435]">
      <HomeSearch
        specialties={specialties}
        loading={loading}
        error={error}
        search={search}
        selected={selected}
        onSearchChange={(value) => { setSearch(value); setSelected(""); }}
        onSelect={selectSpecialty}
        onSearch={(specialty) => navigate(`/encontrar-medico-${createMedicalSpecialtySlug(specialty)}`)}
      />
      <HomeSteps />
      <HomeProof />
    </main>
  );
}

export function AboutPage() {
  return (
    <main className="mx-auto my-12 w-[min(760px,calc(100%-40px))] text-dochub-ink">
      <h1 className="text-4xl font-bold tracking-tight">Sobre a marca</h1>
      <p className="mt-4 leading-relaxed text-[#64756f]">O DocHub conecta pacientes e médicos em um só lugar.</p>
    </main>
  );
}
