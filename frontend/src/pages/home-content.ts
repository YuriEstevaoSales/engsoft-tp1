export const TESTIMONIAL_ROTATION_INTERVAL_MS = 4000;

export const testimonials = [
  {
    quote:
      "Encontrei uma médica perto de casa em poucos minutos. Foi muito fácil marcar minha consulta.",
    name: "Laura Batista",
    role: "Paciente DocHub",
    avatar: "/images/opinion-pictures/Screenshot_2026-09-28_15-54-55.png",
  },
  {
    quote:
      "O DocHub deixou mais simples encontrar um especialista e comparar os horários disponíveis.",
    name: "Marina Costa",
    role: "Paciente DocHub",
    avatar: "/images/opinion-pictures/Screenshot_2026-09-28_15-55-15.png",
  },
  {
    quote:
      "Uma experiência prática do começo ao fim. Agora consigo organizar meus cuidados com mais calma.",
    name: "Renata Alves",
    role: "Paciente DocHub",
    avatar: "/images/opinion-pictures/Screenshot_2026-09-28_15-55-40.png",
  },
  {
    quote:
      "Consegui encontrar um profissional atencioso e um horário que funciona para a minha rotina.",
    name: "Gabriel Souza",
    role: "Paciente DocHub",
    avatar: "/images/opinion-pictures/Screenshot_2026-09-28_15-56-14.png",
  },
];

export function advanceTestimonialIndex(index: number, count: number) {
  return (index + 1) % count;
}
