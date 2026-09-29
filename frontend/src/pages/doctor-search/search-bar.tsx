import { type FormEvent, useEffect, useRef } from "react";
import { createMedicalSpecialtySlug } from "../../routes/doctor-search.js";
import { filterMedicalSpecialties } from "../../routes/specialties.js";

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  matches: string[];
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onSelectSpecialty: (specialty: string) => void;
}

export function SearchBar({
  query,
  onQueryChange,
  isOpen,
  onOpenChange,
  matches,
  onSubmit,
  onSelectSpecialty,
}: SearchBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) onOpenChange(false);
    }
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [onOpenChange]);

  return (
    <div className="relative z-10 mb-5" ref={containerRef}>
      <form className="flex items-center gap-3 rounded-full bg-[#b4b4b4] px-5 py-2" onSubmit={onSubmit} role="search">
        <label className="sr-only" htmlFor="search-input">Buscar especialidade</label>
        <span aria-hidden="true">⌕</span>
        <input
          id="search-input"
          autoComplete="off"
          className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-[#59615f]"
          onChange={(e) => onQueryChange(e.currentTarget.value)}
          onFocus={() => onOpenChange(true)}
          placeholder="Buscar outra especialidade"
          type="search"
          value={query}
        />
        <button type="submit" className="rounded-full bg-[#1d635e] px-5 py-2 text-sm font-semibold text-white">
          Buscar
        </button>
      </form>
      {isOpen && matches.length > 0 && (
        <div className="absolute inset-x-4 top-[calc(100%+6px)] max-h-64 overflow-y-auto rounded-2xl bg-white shadow-lg">
          {matches.slice(0, 8).map((item) => (
            <button
              key={item}
              type="button"
              className="block w-full px-3 py-2.5 text-left text-sm hover:bg-[#eaf5f1]"
              onClick={() => onSelectSpecialty(item)}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
