import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { formButtonClass, formControlClass, formFieldClass } from "../styles/form-classes.js";

type Insurance = { id: number; name: string };

import { SIGNUP_DRAFT_KEY } from "../routes/signup-draft.js";

async function loadInsurances() {
  for (let attempt = 0; attempt < 8; attempt++) {
    try {
      const response = await fetch("/api/insurances");
      if (!response.ok) throw new Error("unavailable");
      const data = (await response.json()) as { insurances?: Insurance[] };
      return data.insurances ?? [];
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
  }
  return [];
}

export function SignupPage() {
  const navigate = useNavigate();
  const [insurances, setInsurances] = useState<Insurance[]>([]);

  useEffect(() => {
    void loadInsurances().then(setInsurances);
  }, []);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = (name: string) => String(form.get(name) ?? "");
    sessionStorage.setItem(SIGNUP_DRAFT_KEY, JSON.stringify({
      email: value("email"), name: value("name"), cpf: value("cpf"),
      birthday: value("birthday"), phoneNumber: value("phoneNumber"),
      stateAddress: value("stateAddress"), city: value("city"),
      insuranceId: value("insuranceId"),
    }));
    void navigate("/cadastro/dados");
  }

  return (
    <>
      <section className="bg-dochub-teal">
        <div className="mx-auto grid min-h-[180px] w-[min(1120px,calc(100%-40px))] grid-cols-[1fr_auto] items-end gap-4 px-2 pt-6 text-white max-[640px]:grid-cols-1">
          <div>
            <h1 className="mb-2 text-[clamp(1.6rem,4vw,2.4rem)] font-bold">Que prazer ter você por aqui!</h1>
            <p className="mb-6 text-[#d7ece9]">eif wepo wjcde qdf lorem</p>
          </div>
          <div className="h-[180px] w-[180px] rounded-t-full bg-[linear-gradient(180deg,#f3d7c4_40%,#fff_40%)] max-[640px]:hidden" aria-hidden="true" />
        </div>
      </section>
      <main className="mx-auto my-8 mb-12 w-[min(760px,calc(100%-40px))]">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[1.05rem] font-semibold text-[#1f3d36]">Preencha seus dados abaixo para se cadastrar no DocHub</h2>
          <span className="grid size-[42px] place-items-center rounded-full bg-[#6b3fa0] font-extrabold text-white" aria-hidden="true">M</span>
        </div>
        <form onSubmit={onSubmit}>
          <label className={formFieldClass}>
            <span>Eu sou</span>
            <select className={formControlClass} defaultValue="medico">
              <option value="paciente" disabled>Paciente</option>
              <option value="medico">Médico</option>
            </select>
          </label>
          <label className={formFieldClass}><span>E-mail</span><input className={formControlClass} name="email" type="email" required /></label>
          <label className={formFieldClass}><span>Nome completo</span><input className={formControlClass} name="name" required /></label>
          <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
            <label className={formFieldClass}><span>CPF</span><input className={formControlClass} name="cpf" required /></label>
            <label className={formFieldClass}><span>Data de nascimento</span><input className={formControlClass} name="birthday" type="date" required /></label>
          </div>
          <label className={formFieldClass}><span>Telefone</span><input className={formControlClass} name="phoneNumber" required /></label>
          <label className={formFieldClass}><span>Estado</span><input className={formControlClass} name="stateAddress" required /></label>
          <label className={formFieldClass}><span>Cidade</span><input className={formControlClass} name="city" /></label>
          <label className={formFieldClass}>
            <span>Convênio médico</span>
            <select className={formControlClass} name="insuranceId" defaultValue="">
              <option value="">Sem convênio</option>
              {insurances.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </label>
          <button className={formButtonClass} type="submit">Continuar</button>
        </form>
      </main>
    </>
  );
}
