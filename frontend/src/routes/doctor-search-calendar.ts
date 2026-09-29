export function buildAppointmentPath(doctorId: number, date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `/agendar/${doctorId}?date=${year}-${month}-${day}`;
}

export function formatCalendarMonth(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(date).toLocaleLowerCase("pt-BR");
}

export function isWeekendDate(date: Date) {
  return date.getDay() === 0 || date.getDay() === 6;
}
