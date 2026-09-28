import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  advanceTestimonialIndex,
  TESTIMONIAL_ROTATION_INTERVAL_MS,
  testimonials,
} from "./home-content.js";

export function HomeProof() {
  const [index, setIndex] = useState(0);
  const testimonial = testimonials[index]!;

  useEffect(() => {
    const interval = window.setInterval(
      () => setIndex((current) => advanceTestimonialIndex(current, testimonials.length)),
      TESTIMONIAL_ROTATION_INTERVAL_MS,
    );
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="flex min-h-screen items-center bg-white py-12 text-center" aria-labelledby="home-proof-title">
      <div className="mx-auto w-[min(1120px,calc(100%-40px))]">
        <h2 id="home-proof-title" className="mb-8 text-[clamp(1.4rem,3vw,1.8rem)] font-bold text-[#26383a]">
          Por que utilizar o <span className="text-[#36a34b]">DocHub</span>?
        </h2>
        <div className="grid grid-cols-2 items-center gap-4 md:grid-cols-4 md:gap-[18px]">
          {[
            ["+10.000", "médicos associados"],
            ["+1.000", "acessos mensais"],
            ["+150.000", "consultas realizadas"],
            ["5", "anos no mercado"],
          ].map(([value, label]) => (
            <article className="grid min-h-[82px] content-center gap-2 rounded-2xl border border-transparent text-sm text-[#6d7c7d] transition duration-150 hover:-translate-y-1 hover:border-[#8cbdb7] hover:shadow-[0_5px_18px_rgb(33_80_73_/_17%)]" key={label}>
              <strong className="text-[1.4rem] tracking-tight text-[#21383a]">{value}</strong>
              <span>{label}</span>
            </article>
          ))}
        </div>
        <div className="relative mx-auto mt-11 grid min-h-[158px] w-full max-w-[780px] grid-cols-1 items-center gap-2.5 rounded-[30px] border border-[#e3e8e6] px-4 py-6 pb-8 text-left shadow-[0_5px_0_#1e343b,0_10px_18px_rgb(26_47_51_/_12%)] sm:grid-cols-[42px_minmax(0,1fr)_42px] sm:gap-[15px] sm:px-6" aria-live="polite">
          <span className="absolute -top-4 left-5 grid size-9 place-items-center rounded-full bg-[#071a29] text-3xl font-bold text-white" aria-hidden="true">“</span>
          <button className="hidden cursor-pointer bg-transparent p-0 text-4xl leading-none text-[#243c42] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-amber-400 sm:block" type="button" onClick={() => setIndex((current) => (current + testimonials.length - 1) % testimonials.length)} aria-label="Depoimento anterior">‹</button>
          <blockquote className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2.5 sm:gap-[22px]">
            <p className="m-0 leading-relaxed text-[#435253]">{testimonial.quote}</p>
            <footer className="flex items-center justify-end gap-2.5">
              <img className="size-16 shrink-0 rounded-full object-cover" src={testimonial.avatar} alt="" loading="lazy" />
              <span className="min-w-max"><strong className="block text-sm text-[#293b3c]">{testimonial.name}</strong><small className="mt-0.5 block text-xs text-[#71807e]">{testimonial.role}</small></span>
            </footer>
          </blockquote>
          <button className="hidden cursor-pointer bg-transparent p-0 text-4xl leading-none text-[#243c42] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-amber-400 sm:block" type="button" onClick={() => setIndex((current) => advanceTestimonialIndex(current, testimonials.length))} aria-label="Próximo depoimento">›</button>
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5" aria-label={`Depoimento ${index + 1} de ${testimonials.length}`}>
            {testimonials.map((item, dotIndex) => (
              <span className={`h-0.5 w-[22px] ${dotIndex === index ? "bg-[#263f45]" : "bg-[#c5cecc]"}`} key={item.name} />
            ))}
          </div>
        </div>
        <Link className="mt-9 inline-block text-sm text-[#536765] no-underline hover:[&_span]:underline" to="/cadastro">
          É profissional de saúde? <span className="font-bold text-[#187269]">Conheça o DocHub</span>
        </Link>
      </div>
    </section>
  );
}
