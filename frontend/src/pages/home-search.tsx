import type { FormEvent } from "react";
import {
  filterMedicalSpecialties,
  findMedicalSpecialty,
} from "../routes/specialties.js";
import { HomeSpecialtySuggestions } from "./home-specialty-suggestions.js";
type HomeSearchProps = {
  specialties: string[];
  loading: boolean;
  error: string;
  search: string;
  selected: string;
  onSearchChange: (value: string) => void;
  onSelect: (value: string) => void;
};
function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4.2 4.2" />
    </svg>
  );
}
export function HomeSearch({
  specialties, loading, error, search, selected, onSearchChange, onSelect,
}: HomeSearchProps) {
  const matching = filterMedicalSpecialties(specialties, search);
  const searchIsOpen = search.trim().length > 0 && !selected;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const match = findMedicalSpecialty(specialties, search);
    if (match) onSelect(match);
  }
  return (
    <section
      className="relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#b1ddd3] via-[#d9e8df] to-[#d8d6cb] px-5 pb-14 pt-32"
      aria-labelledby="home-title"
    >
      <div className="pointer-events-none absolute -left-[8%] top-[22%] size-64 rounded-full bg-white/25 blur-2xl" />
      <div className="pointer-events-none absolute -right-[5%] top-[23%] size-80 rounded-full bg-[#346f67]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-[20%] left-[25%] size-[36rem] rounded-full bg-white/45 blur-3xl" />
      <div className="relative z-10 w-full max-w-[760px] text-center">
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.14em] text-[#247a6c]">Saúde mais perto de você</p>
        <h1 id="home-title" className="mx-auto max-w-[720px] text-[clamp(2.2rem,5.3vw,3.9rem)] font-extrabold leading-[1.08] tracking-[-0.045em] text-[#1e6261]">
          Encontre o cuidado que você precisa.
        </h1>
        <p className="mx-auto mb-7 mt-[18px] max-w-[550px] text-base leading-relaxed text-[#304546]">
          Encontre profissionais de saúde e marque sua consulta de um jeito simples e seguro.
        </p>
        <div className="relative z-20 mx-auto w-full max-w-[630px]">
          <form
            className="flex w-full items-center gap-3 rounded-full border border-[#195d8629] bg-white/90 py-1.5 pl-5 pr-2 shadow-[0_9px_30px_rgb(25_73_66_/_12%)]"
            onSubmit={submit}
            role="search"
          >
            <label className="sr-only" htmlFor="specialty-search-input">Buscar especialidade médica</label>
            <span className="size-5 shrink-0 [&>svg]:size-5 [&>svg]:fill-none [&>svg]:stroke-[#68827e] [&>svg]:stroke-[1.8]">
              <SearchIcon />
            </span>
            <input
              id="specialty-search-input"
              className="w-full min-w-0 border-0 bg-transparent py-3 text-[#1c3435] outline-none placeholder:text-[#71817e]"
              type="search"
              value={search}
              onChange={(event) => onSearchChange(event.currentTarget.value)}
              placeholder="Qual especialidade você procura?"
              autoComplete="off"
              aria-autocomplete="list"
              aria-expanded={searchIsOpen}
              aria-controls="specialty-search-results"
            />
            <button className="shrink-0 rounded-full bg-[#1f7168] px-5 py-3 font-bold text-white transition-colors hover:bg-[#185d56] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-amber-400" type="submit" aria-label="Buscar especialidade">
              Buscar
            </button>
          </form>
          {searchIsOpen && !loading && !error ? (
            <div className="absolute inset-x-0 top-[calc(100%+8px)] z-30 max-h-[min(280px,40vh)] overflow-y-auto rounded-[18px] border border-[#dce8e4] bg-white p-1.5 text-left shadow-[0_14px_35px_rgb(25_73_66_/_20%)]" id="specialty-search-results" role="listbox" aria-label="Resultados da busca">
              {matching.length ? matching.slice(0, 8).map((specialty) => (
                <button className="block w-full rounded-xl bg-transparent px-3.5 py-3 text-left text-[#244542] hover:bg-[#eaf5f1] focus-visible:bg-[#eaf5f1] focus-visible:outline-none" id={`specialty-result-${specialties.indexOf(specialty)}`} key={specialty} type="button" role="option" aria-selected={false} onClick={() => onSelect(specialty)}>
                  {specialty}
                </button>
              )) : (
                <p className="m-0 px-3.5 py-3 text-sm text-[#64756f]">Nenhuma especialidade encontrada.</p>
              )}
            </div>
          ) : null}
        </div>
        <div className="mx-auto mt-4 min-h-16" aria-label="Especialidades médicas">
          <HomeSpecialtySuggestions specialties={specialties} loading={loading} error={error} selected={selected} onSelect={onSelect} />
        </div>
        {selected ? (
          <p className="mt-2 text-sm text-[#315a53]" role="status">
            Especialidade selecionada: <strong>{selected}</strong>
          </p>
        ) : null}
      </div>
    </section>
  );
}
