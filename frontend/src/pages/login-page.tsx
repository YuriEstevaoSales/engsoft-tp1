import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router";
import { saveSession } from "../auth/session.js";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json()) as { message?: string; user?: object };
      if (!response.ok || !data.user) {
        setError(data.message ?? "Não foi possível entrar.");
        return;
      }
      saveSession(data.user as never);
      void navigate("/perfil");
    } catch {
      setError("Falha de conexão com o servidor.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={(event) => void onSubmit(event)}>
        <h1>Faça login para acessar sua conta</h1>
        <div className="login-roles">
          <label className="login-role-disabled">
            <input type="radio" name="role" disabled />
            <span>sou paciente</span>
          </label>
          <label>
            <input type="radio" name="role" defaultChecked />
            <span>sou médico</span>
          </label>
        </div>
        <label className="login-field">
          <span>email</span>
          <input type="email" required placeholder="insira seu email" value={email}
            onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label className="login-field">
          <span>senha</span>
          <input type="password" required placeholder="insira sua senha" value={password}
            onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error ? <p className="login-error">{error}</p> : null}
        <button className="login-submit" type="submit" disabled={pending}>
          {pending ? "entrando..." : "entrar"}
        </button>
        <div className="login-divider">ou</div>
        <button className="login-google" type="button" disabled>
          G entrar com Google
        </button>
        <p className="login-hint">
          É seu primeiro acesso? <Link to="/cadastro">Crie uma conta</Link>
        </p>
      </form>
    </main>
  );
}
