import { useNavigate } from "react-router";
import { buildAppointmentPath, formatCalendarMonth, isWeekendDate } from "../../routes/doctor-search.js";

const weekdays = ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"];

export function DoctorCalendar({ doctorId, today }: { doctorId: number; today: Date }) {
  const navigate = useNavigate();
  const [monthOffset, setMonthOffset] = useState(0);
  const month = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const mondayOffset = (month.getDay() + 6) % 7;
  const monthLabel = formatCalendarMonth(month);

  return (
    <section className="rounded-[28px] bg-[#d9d9d9] p-5 max-[720px]:p-4" aria-label="Calendário de consulta">
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          aria-label="Mês anterior"
          className="grid size-9 place-items-center rounded-full border border-[#1d635e]/30 bg-white text-lg text-[#1d635e] disabled:cursor-not-allowed disabled:opacity-40"
          disabled={monthOffset === 0}
          onClick={() => setMonthOffset((offset) => offset - 1)}
          type="button"
        >
          ‹
        </button>
        <h3 className="m-0 text-center text-base font-bold text-[#1d635e]">{monthLabel}</h3>
        <button
          aria-label="Próximo mês"
          className="grid size-9 place-items-center rounded-full border border-[#1d635e]/30 bg-white text-lg text-[#1d635e]"
          onClick={() => setMonthOffset((offset) => offset + 1)}
          type="button"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {weekdays.map((weekday) => (
          <span className="pb-1 text-center text-xs font-semibold text-[#435653]" key={weekday}>
            {weekday}
          </span>
        ))}
        {Array.from({ length: mondayOffset }, (_, index) => (
          <span aria-hidden="true" key={`blank-${index}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1;
          const date = new Date(month.getFullYear(), month.getMonth(), day);
          const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const isWeekend = isWeekendDate(date);
          return (
            <button
              aria-label={`${day} de ${monthLabel}`}
              className={`min-h-10 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d635e] ${
                isPast || isWeekend
                  ? "cursor-not-allowed bg-[#a1a1a1] text-white/80"
                  : "bg-[#1d635e] text-white hover:bg-[#164d49]"
              }`}
              disabled={isPast || isWeekend}
              key={day}
              onClick={() => navigate(buildAppointmentPath(doctorId, date))}
              type="button"
            >
              {day}
            </button>
          );
        })}
      </div>
      <p className="mb-0 mt-3 text-center text-xs leading-relaxed text-[#465450]">
        A disponibilidade será confirmada na próxima etapa.
      </p>
    </section>
  );
}
