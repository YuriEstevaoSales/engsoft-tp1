import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { readSession } from "../auth/session.js";

type Profile = {
  name: string; email: string; specialty: string | null; description: string | null;
  appointmentPrice: number | null; remoteAppointments: boolean;
  street: string; addressNumber: number; addressComplement: string | null;
  city: string | null; stateAddress: string; insurances: number[] | null;
};

export function DoctorProfilePage() {
  const navigate = useNavigate();
  const session = readSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session) {
      void navigate("/entrar");
      return;
    }
    void fetch(`/api/doctors/me?userId=${session.id}`)
      .then((response) => response.json())
      .then((data: { profile?: Profile | null }) => {
        if (!data.profile) setError("Não encontramos seus dados no banco.");
        else setProfile(data.profile);
      })
      .catch(() => setError("Falha ao carregar o perfil."));
  }, [navigate, session]);

  if (!session) return null;
  return (
    <main className="signup-form-wrap">
      <h2>seu perfil</h2>
      <p>{session.email} — sessão ativa</p>
      {error ? <p className="signup-error">{error}</p> : null}
      {profile ? (
        <form>
          <label className="pill-field"><span>Nome</span><input readOnly value={profile.name} /></label>
          <label className="pill-field"><span>Especialidade</span>
            <input readOnly value={profile.specialty ?? ""} /></label>
          <label className="pill-field"><span>Descrição</span>
            <textarea readOnly rows={3} value={profile.description ?? ""} /></label>
          <label className="pill-field"><span>Preço da consulta</span>
            <input readOnly value={profile.appointmentPrice ?? ""} /></label>
          <p>{profile.remoteAppointments ? "Atendo apenas remotamente" : "Atendimento presencial"}</p>
          <div className="signup-divider">seu consultório</div>
          <div className="pill-row">
            <label className="pill-field"><span>Estado</span>
              <input readOnly value={profile.stateAddress} /></label>
            <label className="pill-field"><span>Cidade</span>
              <input readOnly value={profile.city ?? ""} /></label>
          </div>
          <label className="pill-field"><span>Logradouro</span>
            <input readOnly value={profile.street} /></label>
          <div className="pill-row">
            <label className="pill-field"><span>Número</span>
              <input readOnly value={profile.addressNumber} /></label>
            <label className="pill-field"><span>Complemento</span>
              <input readOnly value={profile.addressComplement ?? ""} /></label>
          </div>
        </form>
      ) : null}
      <p><Link to="/">Voltar ao início</Link></p>
    </main>
  );
}
