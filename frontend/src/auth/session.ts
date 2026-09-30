const SESSION_KEY = "dochub.session";

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: "medico" | "paciente";
  accessToken?: string;
};

export function saveSession(user: SessionUser) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function readSession(): SessionUser | null {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? (JSON.parse(raw) as SessionUser) : null;
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function getNameInitial(name: string) {
  return name.trim().charAt(0).toLocaleUpperCase("pt-BR") || "?";
}

export function getFirstName(name: string) {
  return name.trim().split(/\s+/)[0] || "?";
}
