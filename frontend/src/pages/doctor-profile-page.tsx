import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { readSession } from "../auth/session.js";
import {
  formControlClass,
  formDividerClass,
  formErrorClass,
  formFieldClass,
} from "../styles/form-classes.js";

type Profile = {
  name: string; email: string; role?: "paciente" | "medico"; specialty?: string | null; description?: string | null;
  appointmentPrice: number | null; remoteAppointments: boolean;
  street?: string; addressNumber?: number; addressComplement?: string | null;
  city: string | null; stateAddress: string; insurances?: number[] | null; insurance?: number | null;
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
    <main className="mx-auto my-8 mb-12 w-[min(760px,calc(100%-40px))]">
      <h2 className="mb-2 text-xl font-bold text-[#1f3d36]">seu perfil</h2>
      <p className="mb-5 text-sm text-[#64756f]">{session.email} — sessão ativa</p>
      {error ? <p className={`${formErrorClass} mb-4`} role="alert">{error}</p> : null}
      {profile ? (
        profile.role === "paciente" ? (
          <div>
            <p className="mb-3 text-lg font-semibold text-[#1f3d36]">Olá, {profile.name}!</p>
            <p className="text-[#64756f]">Sua conta de paciente está ativa.</p>
            <p className="mt-2 text-[#64756f]">
              {profile.insurance ? "Convênio cadastrado." : "Nenhum convênio cadastrado."}
            </p>
          </div>
        ) : (
        <form>
          <label className={formFieldClass}><span>Nome</span><input className={formControlClass} readOnly value={profile.name} /></label>
          <label className={formFieldClass}><span>Especialidade</span>
            <input className={formControlClass} readOnly value={profile.specialty ?? ""} /></label>
          <label className={formFieldClass}><span>Descrição</span>
            <textarea className={`${formControlClass} rounded-2xl`} readOnly rows={3} value={profile.description ?? ""} /></label>
          <label className={formFieldClass}><span>Preço da consulta</span>
            <input className={formControlClass} readOnly value={profile.appointmentPrice ?? ""} /></label>
          <p className="mb-4 text-sm text-[#64756f]">{profile.remoteAppointments ? "Atendo apenas remotamente" : "Atendimento presencial"}</p>
          <div className={formDividerClass}>seu consultório</div>
          <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
            <label className={formFieldClass}><span>Estado</span>
              <input className={formControlClass} readOnly value={profile.stateAddress} /></label>
            <label className={formFieldClass}><span>Cidade</span>
              <input className={formControlClass} readOnly value={profile.city ?? ""} /></label>
          </div>
          <label className={formFieldClass}><span>Logradouro</span>
            <input className={formControlClass} readOnly value={profile.street} /></label>
          <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
            <label className={formFieldClass}><span>Número</span>
              <input className={formControlClass} readOnly value={profile.addressNumber} /></label>
            <label className={formFieldClass}><span>Complemento</span>
              <input className={formControlClass} readOnly value={profile.addressComplement ?? ""} /></label>
          </div>
        </form>
        )
      ) : null}
      <p className="mt-5"><Link className="font-semibold text-dochub-teal underline" to="/">Voltar ao início</Link></p>
    </main>
  );
}
