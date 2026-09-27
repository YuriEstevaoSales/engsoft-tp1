import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { saveSession } from "../auth/session.js";

const DRAFT_KEY = "dochub.signupDraft";
const SPECIALTIES = ["Clínica Geral", "Cardiologia", "Dermatologia", "Pediatria", "Ortopedia"];

export function SignupDoctorPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem(DRAFT_KEY)) void navigate("/cadastro");
  }, [navigate]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const draft = JSON.parse(sessionStorage.getItem(DRAFT_KEY) ?? "null");
    if (!draft) return;
    const form = new FormData(event.currentTarget);
    const value = (name: string) => String(form.get(name) ?? "");
    if (value("password") !== value("confirm")) {
      setError("As senhas não coincidem.");
      return;
    }
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/auth/register-doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, ...Object.fromEntries(form), confirm: undefined }),
      });
      const data = (await response.json()) as { message?: string; user?: object };
      if (!response.ok || !data.user) {
        setError(data.message ?? "Não foi possível cadastrar.");
        return;
      }
      sessionStorage.removeItem(DRAFT_KEY);
      saveSession(data.user as never);
      void navigate("/perfil");
    } catch {
      setError("Falha de conexão com o servidor.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="signup-form-wrap">
      <h2>Continue seu cadastro</h2>
      <form onSubmit={(event) => void onSubmit(event)}>
        <div className="signup-photo" aria-hidden="true" />
        <label className="pill-field">
          <span>Especialidade</span>
          <select name="specialty" required>
            {SPECIALTIES.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <div className="pill-row">
          <label className="pill-field"><span>CRM</span><input name="crm" required /></label>
          <label className="pill-field"><span>Data de formação</span><input name="formationDate" type="date" /></label>
        </div>
        <div className="signup-divider">Sobre seu local de atendimento</div>
        <label className="pill-field"><span>CEP</span><input name="cep" /></label>
        <div className="pill-row">
          <label className="pill-field"><span>Estado</span><input name="clinicState" required /></label>
          <label className="pill-field"><span>Cidade</span><input name="clinicCity" /></label>
        </div>
        <label className="pill-field"><span>Logradouro</span><input name="street" required /></label>
        <div className="pill-row">
          <label className="pill-field"><span>Número</span><input name="addressNumber" type="number" required /></label>
          <label className="pill-field"><span>Complemento</span><input name="addressComplement" /></label>
        </div>
        <div className="pill-row">
          <label className="pill-field"><span>Telefone</span><input name="clinicPhone" /></label>
          <label className="pill-field"><span>Celular</span><input name="mobile" /></label>
        </div>
        <div className="signup-divider">Crie sua senha</div>
        <label className="pill-field"><span>Senha</span><input name="password" type="password" required minLength={6} /></label>
        <label className="pill-field"><span>Confirmação da senha</span><input name="confirm" type="password" required minLength={6} /></label>
        {error ? <p className="signup-error">{error}</p> : null}
        <button className="signup-submit" type="submit" disabled={pending}>
          {pending ? "Salvando..." : "Finalizar cadastro"}
        </button>
      </form>
    </main>
  );
}
