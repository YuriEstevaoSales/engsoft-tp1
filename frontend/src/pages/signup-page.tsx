import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";

type Insurance = { id: number; name: string };

const DRAFT_KEY = "dochub.signupDraft";

export function SignupPage() {
  const navigate = useNavigate();
  const [insurances, setInsurances] = useState<Insurance[]>([]);

  useEffect(() => {
    void fetch("/api/insurances")
      .then((response) => response.json())
      .then((data: { insurances?: Insurance[] }) => setInsurances(data.insurances ?? []));
  }, []);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = (name: string) => String(form.get(name) ?? "");
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({
      email: value("email"), name: value("name"), cpf: value("cpf"),
      birthday: value("birthday"), phoneNumber: value("phoneNumber"),
      stateAddress: value("stateAddress"), city: value("city"),
      insuranceId: value("insuranceId"),
    }));
    void navigate("/cadastro/dados");
  }

  return (
    <>
      <section className="signup-hero-bar">
        <div className="signup-hero">
          <div>
            <h1>Que prazer ter você por aqui!</h1>
            <p>eif wepo wjcde qdf lorem</p>
          </div>
          <div className="signup-hero-art" aria-hidden="true" />
        </div>
      </section>
      <main className="signup-form-wrap">
        <div className="signup-head">
          <h2>Preencha seus dados abaixo para se cadastrar no DocHub</h2>
          <span className="signup-chat" aria-hidden="true">M</span>
        </div>
        <form onSubmit={onSubmit}>
          <label className="pill-field">
            <span>Eu sou</span>
            <select defaultValue="medico">
              <option value="paciente" disabled>Paciente</option>
              <option value="medico">Médico</option>
            </select>
          </label>
          <label className="pill-field"><span>E-mail</span><input name="email" type="email" required /></label>
          <label className="pill-field"><span>Nome completo</span><input name="name" required /></label>
          <div className="pill-row">
            <label className="pill-field"><span>CPF</span><input name="cpf" required /></label>
            <label className="pill-field"><span>Data de nascimento</span><input name="birthday" type="date" required /></label>
          </div>
          <label className="pill-field"><span>Telefone</span><input name="phoneNumber" required /></label>
          <label className="pill-field"><span>Estado</span><input name="stateAddress" required /></label>
          <label className="pill-field"><span>Cidade</span><input name="city" /></label>
          <label className="pill-field">
            <span>Convênio médico</span>
            <select name="insuranceId" defaultValue="">
              <option value="">Sem convênio</option>
              {insurances.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </label>
          <button className="signup-submit" type="submit">Continuar</button>
        </form>
      </main>
    </>
  );
}
