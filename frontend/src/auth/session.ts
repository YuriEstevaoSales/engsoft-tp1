const SESSION_KEY = "dochub.session";

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: "medico";
};

export function saveSession(user: SessionUser) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function readSession(): SessionUser | null {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? (JSON.parse(raw) as SessionUser) : null;
}
