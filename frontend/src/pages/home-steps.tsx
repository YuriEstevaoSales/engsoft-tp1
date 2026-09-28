const steps = [
  ["Encontre médicos", "Busque por especialidade e encontre o profissional certo para você."],
  ["Conheça o profissional", "Confira o perfil, o local de atendimento e as informações do médico."],
  ["Escolha um horário", "Veja os horários disponíveis e escolha o melhor para sua rotina."],
  ["Cuide da sua saúde", "Agende sua consulta de forma simples e acompanhe tudo pelo DocHub."],
];

export function HomeSteps() {
  return (
    <section className="flex min-h-screen items-center bg-[#071a29] py-14 text-[#f6f8f7] md:py-16" aria-labelledby="home-steps-title">
      <div className="mx-auto w-[min(1120px,calc(100%-40px))]">
        <h2 id="home-steps-title" className="mb-8 text-left text-[clamp(1.55rem,3.2vw,2.05rem)] font-bold leading-snug md:text-right">
          Marcar consultas médicas<br />nunca foi tão fácil!
        </h2>
        <ol className="grid gap-6">
          {steps.map(([title, description], index) => (
            <li className="relative grid min-h-[116px] grid-cols-[28px_1fr] items-start md:min-h-[132px] md:grid-cols-2 md:items-center" key={title}>
              <span className="absolute left-[14px] top-[14px] z-10 grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#32a64c] text-sm font-extrabold text-white md:left-1/2 md:top-1/2 md:size-[30px]">
                {index + 1}
              </span>
              <span className="absolute bottom-0 left-[14px] top-0 w-px bg-[#244454] md:left-1/2" />
              <div className={`col-start-2 row-start-1 pl-3 text-left ${index % 2 === 0 ? "md:col-start-1 md:pr-12 md:text-right" : "md:col-start-2 md:pl-12 md:text-left"}`}>
                <h3 className="mb-1.5 text-lg font-semibold text-[#43bf58]">{title}</h3>
                <p className={`m-0 max-w-[390px] text-sm leading-relaxed text-[#d2dcde] ${index % 2 === 0 ? "md:ml-auto" : ""}`}>{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
