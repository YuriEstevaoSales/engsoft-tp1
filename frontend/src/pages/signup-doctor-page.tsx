import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { saveSession, SessionUser } from "../auth/session.js";
import { PasswordInput } from "../components/password-input.js";
import { loadMedicalSpecialties } from "../routes/specialties.js";
import { SIGNUP_DRAFT_KEY } from "../routes/signup-draft.js";
import {
  formButtonClass,
  formControlClass,
  formDividerClass,
  formErrorClass,
  formFieldClass,
} from "../styles/form-classes.js";

export function SignupDoctorPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [specialtiesLoading, setSpecialtiesLoading] = useState(true);
  const [specialtiesError, setSpecialtiesError] = useState("");

  useEffect(() => {
    void loadMedicalSpecialties()
      .then(setSpecialties)
      .catch((loadError: unknown) => {
        setSpecialtiesError(
          loadError instanceof Error ? loadError.message : "Não foi possível carregar as especialidades.",
        );
      })
      .finally(() => setSpecialtiesLoading(false));
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const draft = JSON.parse(sessionStorage.getItem(SIGNUP_DRAFT_KEY) ?? "null");
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
      const data = (await response.json()) as { message?: string; user?: SessionUser };
      if (!response.ok || !data.user) {
        setError(data.message ?? "Não foi possível cadastrar.");
        return;
      }
      sessionStorage.removeItem(SIGNUP_DRAFT_KEY);
      saveSession(data.user);
      void navigate("/perfil");
    } catch {
      setError("Falha de conexão com o servidor.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto my-8 mb-12 w-[min(760px,calc(100%-40px))]">
      <h2 className="mb-5 text-[1.05rem] font-semibold text-[#1f3d36]">Continue seu cadastro</h2>
      <form onSubmit={(event) => void onSubmit(event)}>
        <div className="mx-auto mb-2 size-14 rounded-full bg-dochub-teal" aria-hidden="true" />
        <label className={formFieldClass}>
          <span>Especialidade</span>
          <select className={formControlClass} name="specialty" required disabled={specialtiesLoading || Boolean(specialtiesError)}>
            <option value="">Selecione uma especialidade</option>
            {specialties.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        {specialtiesError ? <p className={formErrorClass} role="alert">{specialtiesError}</p> : null}
        <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
          <label className={formFieldClass}><span>CRM</span><input className={formControlClass} name="crm" required /></label>
          <label className={formFieldClass}><span>Data de formação</span><input className={formControlClass} name="formationDate" type="date" /></label>
        </div>
        <div className={formDividerClass}>Sobre seu local de atendimento</div>
        <label className={formFieldClass}><span>CEP</span><input className={formControlClass} name="cep" /></label>
        <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
          <label className={formFieldClass}><span>Estado</span><input className={formControlClass} name="clinicState" required /></label>
          <label className={formFieldClass}><span>Cidade</span><input className={formControlClass} name="clinicCity" /></label>
        </div>
        <label className={formFieldClass}><span>Logradouro</span><input className={formControlClass} name="street" required /></label>
        <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
          <label className={formFieldClass}><span>Número</span><input className={formControlClass} name="addressNumber" type="number" required /></label>
          <label className={formFieldClass}><span>Complemento</span><input className={formControlClass} name="addressComplement" /></label>
        </div>
        <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
          <label className={formFieldClass}><span>Telefone</span><input className={formControlClass} name="clinicPhone" /></label>
          <label className={formFieldClass}><span>Celular</span><input className={formControlClass} name="mobile" /></label>
        </div>
        <div className={formDividerClass}>Crie sua senha</div>
        <label className={formFieldClass}><span>Senha</span><PasswordInput className={formControlClass} name="password" required minLength={6} /></label>
        <label className={formFieldClass}><span>Confirmação da senha</span><PasswordInput className={formControlClass} name="confirm" required minLength={6} /></label>
        {error ? <p className={formErrorClass} role="alert">{error}</p> : null}
        <button className={formButtonClass} type="submit" disabled={pending}>
          {pending ? "Salvando..." : "Finalizar cadastro"}
        </button>
      </form>
    </main>
  );
}
