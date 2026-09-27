import { redirect } from "react-router";

export const SIGNUP_DRAFT_KEY = "dochub.signupDraft";

export function hasSignupDraft() {
  try {
    const draft = JSON.parse(sessionStorage.getItem(SIGNUP_DRAFT_KEY) ?? "null");
    return Boolean(draft?.email && draft?.name && draft?.cpf);
  } catch {
    return false;
  }
}

export function requireSignupDraft() {
  if (!hasSignupDraft()) throw redirect("/cadastro");
  return null;
}
