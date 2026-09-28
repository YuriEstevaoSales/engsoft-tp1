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
    <main className="grid flex-1 place-items-center bg-[#0b1c28] px-5 pb-[72px] pt-12 text-white">
      <form className="w-full max-w-[460px] text-center" onSubmit={(event) => void onSubmit(event)}>
        <h1 className="mb-7 text-[clamp(1.6rem,4vw,2.1rem)] font-bold tracking-tight">Faça login para acessar sua conta</h1>
        <div className="mb-6 flex justify-center gap-7">
          <label className="flex cursor-not-allowed items-center gap-2 text-[#8f9aa3] opacity-45">
            <input className="accent-[#3dbe73]" type="radio" name="role" disabled />
            <span>sou paciente</span>
          </label>
          <label className="flex items-center gap-2 text-[#8f9aa3] has-[:checked]:text-[#3dbe73]">
            <input className="accent-[#3dbe73]" type="radio" name="role" defaultChecked />
            <span>sou médico</span>
          </label>
        </div>
        <label className="mb-4 block text-left">
          <span className="mb-1.5 ml-2 block text-[0.92rem] text-[#9aa7b0]">email</span>
          <input className="w-full rounded-full bg-white px-[18px] py-[13px] text-[#17332d] outline-none focus-visible:ring-2 focus-visible:ring-[#3dbe73]" type="email" required placeholder="insira seu email" value={email}
            onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label className="mb-4 block text-left">
          <span className="mb-1.5 ml-2 block text-[0.92rem] text-[#9aa7b0]">senha</span>
          <input className="w-full rounded-full bg-white px-[18px] py-[13px] text-[#17332d] outline-none focus-visible:ring-2 focus-visible:ring-[#3dbe73]" type="password" required placeholder="insira sua senha" value={password}
            onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error ? <p className="mb-3 text-[#ffb4ab]" role="alert">{error}</p> : null}
        <button className="my-3 mb-[22px] min-w-40 cursor-pointer rounded-lg bg-[#2ea86a] px-7 py-3 font-bold text-white hover:bg-[#238a57] disabled:cursor-wait disabled:opacity-70" type="submit" disabled={pending}>
          {pending ? "entrando..." : "entrar"}
        </button>
        <div className="flex items-center gap-3 text-[0.85rem] text-[#8f9aa3] before:h-px before:flex-1 before:bg-[#3a4d5a] after:h-px after:flex-1 after:bg-[#3a4d5a]">ou</div>
        <button className="my-[18px] mb-[22px] inline-flex cursor-not-allowed items-center gap-2.5 rounded-full bg-white px-[22px] py-2.5 font-semibold text-[#333] disabled:opacity-60" type="button" disabled>
          G entrar com Google
        </button>
        <p className="text-[#d7dee3]">
          É seu primeiro acesso? <Link className="font-bold text-[#3dbe73]" to="/cadastro">Crie uma conta</Link>
        </p>
      </form>
    </main>
  );
}
