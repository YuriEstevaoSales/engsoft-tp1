interface SearchHeaderProps {
  specialty: string;
  doctorCount: number;
  loading: boolean;
  error: string | null;
}

export function SearchHeader({ specialty, doctorCount, loading, error }: SearchHeaderProps) {
  return (
    <div className="mb-5">
      <h1 className="m-0 text-2xl font-bold">{specialty ? `Médicos: ${specialty}` : "Encontrar médico"}</h1>
      <p className="mb-0 mt-1 text-sm" aria-live="polite">
        {loading ? "Buscando..." : `${doctorCount} encontrados`}
      </p>
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
