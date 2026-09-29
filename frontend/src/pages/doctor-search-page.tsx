import { type FormEvent, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { findMedicalSpecialty, filterMedicalSpecialties } from "../routes/specialties.js";
import {
  createMedicalSpecialtySlug,
  getVisiblePageNumbers,
  type SearchDoctor,
} from "../routes/doctor-search.js";
import { DoctorCard } from "./doctor-search/doctor-card.js";
import { SearchBar } from "./doctor-search/search-bar.js";
import { SearchHeader } from "./doctor-search/search-header.js";
import { FilterPanel } from "./doctor-search/filter-panel.js";
import { PaginationControls } from "./doctor-search/pagination-controls.js";
import { useCatalog } from "./doctor-search/use-catalog.js";
import { useDoctorSearch } from "./doctor-search/use-doctor-search.js";

export function DoctorSearchPage() {
  const navigate = useNavigate();
  const { specialty: specialtySlug = "" } = useParams();
  const [specialtyQuery, setSpecialtyQuery] = useState("");
  const [specialtySearchOpen, setSpecialtySearchOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [minRating, setMinRating] = useState("");

  const { specialtyCatalog, error: catalogError, specialtyCatalogRef } = useCatalog();
  const { specialty, doctors, loading, error: searchError } = useDoctorSearch({
    specialtySlug,
    minRating,
    specialtyCatalogRef,
  });

  const specialtyMatches = filterMedicalSpecialties(specialtyCatalog, specialtyQuery);
  const today = new Date();
  const itemsPerPage = 9;
  const startIdx = (currentPage - 1) * itemsPerPage;
  const visibleDoctors = doctors.slice(startIdx, startIdx + itemsPerPage);
  const totalPages = Math.ceil(doctors.length / itemsPerPage);
  const visiblePages = getVisiblePageNumbers(currentPage, totalPages);
  const error = catalogError || searchError;

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const exact = findMedicalSpecialty(specialtyCatalog, specialtyQuery);
    const first = filterMedicalSpecialties(specialtyCatalog, specialtyQuery)[0];
    const selected = exact ?? first;
    if (selected) {
      setSpecialtySearchOpen(false);
      void navigate(`/encontrar-medico-${createMedicalSpecialtySlug(selected)}`);
    }
  }

  return (
    <main className="mx-auto w-[min(1120px,calc(100%-40px))] flex-1 py-10 text-[#172b35]">
      <SearchBar
        query={specialtyQuery}
        onQueryChange={(q) => {
          setSpecialtyQuery(q);
          setSpecialtySearchOpen(true);
        }}
        isOpen={specialtySearchOpen}
        onOpenChange={setSpecialtySearchOpen}
        matches={specialtyMatches}
        onSubmit={handleSearchSubmit}
        onSelectSpecialty={(item) => {
          setSpecialtySearchOpen(false);
          void navigate(`/encontrar-medico-${createMedicalSpecialtySlug(item)}`);
        }}
      />
      <SearchHeader specialty={specialty} doctorCount={doctors.length} loading={loading} error={error} />
      <button
        type="button"
        onClick={() => setFiltersOpen(!filtersOpen)}
        className="mb-6 inline-flex items-center gap-2 rounded-xl border border-[#cbd8d4] bg-white px-4 py-2.5 text-sm font-semibold"
      >
        Filtros
      </button>
      <FilterPanel isOpen={filtersOpen} minRating={minRating} onMinRatingChange={setMinRating} />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleDoctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} today={today} />
        ))}
      </div>
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        visiblePages={visiblePages}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}
