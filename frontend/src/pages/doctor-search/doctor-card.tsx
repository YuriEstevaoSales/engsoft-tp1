import { useEffect, useState } from "react";
import type { SearchDoctor } from "../../routes/doctor-search.js";
import { loadRandomDoctorAvatar } from "../../routes/doctor-avatar.js";
import { DoctorCalendar } from "./doctor-calendar.js";

export function DoctorCard({ doctor, today }: { doctor: SearchDoctor; today: Date }) {
  const [randomAvatar, setRandomAvatar] = useState<string | null>(null);
  const location = [
    doctor.street,
    doctor.addressNumber,
    doctor.user.city,
    doctor.user.stateAddress,
  ].filter(Boolean).join(", ");
  const roundedRating = doctor.averageRating === null
    ? 0
    : Math.max(0, Math.min(5, Math.round(doctor.averageRating)));

  useEffect(() => {
    if (doctor.user.photo) return;
    let active = true;
    void loadRandomDoctorAvatar()
      .then((avatar) => {
        if (active) setRandomAvatar(avatar);
      })
      .catch(() => {
        // Keep the initials fallback when the external avatar service is unavailable.
      });
    return () => {
      active = false;
    };
  }, [doctor.user.photo]);

  const avatar = doctor.user.photo ?? randomAvatar;

  return (
    <article className="grid grid-cols-[minmax(220px,0.8fr)_minmax(0,1.2fr)] items-center gap-8 overflow-hidden rounded-[34px] bg-[#e8eeee] p-8 max-[800px]:grid-cols-1 max-[800px]:gap-5 max-[720px]:rounded-[26px] max-[720px]:p-5">
      <div className="flex flex-col items-center text-center">
        {avatar ? (
          <img alt={`Foto de ${doctor.user.name}`} className="mb-3 size-24 rounded-full object-cover" src={avatar} />
        ) : (
          <div aria-hidden="true" className="mb-3 grid size-24 place-items-center rounded-full bg-[#c7ddd7] text-3xl font-bold text-[#1d635e]">
            {doctor.user.name.trim().charAt(0).toLocaleUpperCase("pt-BR")}
          </div>
        )}
        <h2 className="m-0 text-lg font-semibold text-[#172b35]">{doctor.user.name}</h2>
        <p className="mb-0 mt-2 text-sm text-[#263b43]">{doctor.specialty}</p>
        <p className="mb-0 mt-1 text-sm text-[#263b43]">CRM {doctor.crmNumber}-{doctor.crmUf}</p>
        <p className="mb-0 mt-1 text-sm text-[#263b43]">
          <span className="font-semibold">Convênios: </span>
          {doctor.acceptedInsurances.length
            ? doctor.acceptedInsurances.join(", ")
            : "apenas consultas particulares"}
        </p>
        <div
          aria-label={doctor.averageRating === null
            ? "Este médico ainda não tem avaliações"
            : `Avaliação média: ${doctor.averageRating.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} de 5`}
          className="mt-2 flex items-center gap-1 text-[1.65rem] leading-none"
          role="img"
        >
          {Array.from({ length: 5 }, (_, index) => (
            <span className={index < roundedRating ? "text-[#c5cf00]" : "text-[#b9c0b9]"} key={index}>
              ★
            </span>
          ))}
          {doctor.averageRating !== null ? (
            <span className="ml-1 text-sm font-semibold text-[#394c49]">
              {doctor.averageRating.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}
            </span>
          ) : null}
        </div>
        <p className="mb-0 mt-3 text-sm text-[#263b43]">
          <span aria-hidden="true" className="mr-2 text-lg text-[#1d635e]">●</span>
          {location}
        </p>
      </div>
      <DoctorCalendar doctorId={doctor.id} today={today} />
    </article>
  );
}
