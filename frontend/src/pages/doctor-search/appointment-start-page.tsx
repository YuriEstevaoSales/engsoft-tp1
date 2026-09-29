import { useParams, useSearchParams } from "react-router";

export function AppointmentStartPage() {
  const { doctorId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const selectedDate = searchParams.get("date");
  const isValidDate = selectedDate !== null && /^\d{4}-\d{2}-\d{2}$/.test(selectedDate);
  const formattedDate = isValidDate
    ? new Intl.DateTimeFormat("pt-BR").format(new Date(`${selectedDate}T00:00:00`))
    : null;

  return (
    <main className="mx-auto my-16 w-[min(720px,calc(100%-40px))] flex-1 rounded-3xl bg-white p-8 text-center shadow-sm">
      <h1 className="text-2xl font-bold text-[#1d635e]">Agendamento em breve</h1>
      <p className="mt-3 text-[#53625e]">
        A próxima etapa de agendamento está sendo preparada.
      </p>
      {formattedDate ? (
        <p className="text-sm text-[#53625e]">
          Médico {doctorId} · data selecionada: {formattedDate}
        </p>
      ) : null}
    </main>
  );
}
