import { jwtVerify, SignJWT, type JWTPayload } from "jose";

const TOKEN_ISSUER = "dochub";
const TOKEN_AUDIENCE = "dochub-api";
const TOKEN_ALGORITHM = "HS256";

function getTokenSecret() {
  const secret = process.env["AUTH_TOKEN_SECRET"];
  if (!secret || new TextEncoder().encode(secret).byteLength < 32) {
    throw new Error("AUTH_TOKEN_SECRET deve conter ao menos 32 bytes.");
  }
  return new TextEncoder().encode(secret);
}

export function assertDoctorTokenConfiguration() {
  getTokenSecret();
}

export async function createAuthToken(userId: number, role: "medico" | "paciente"): Promise<string> {
  if (!Number.isSafeInteger(userId) || userId < 1) throw new Error("Identidade médica inválida.");
  return new SignJWT({ role })
    .setProtectedHeader({ alg: TOKEN_ALGORITHM })
    .setIssuedAt()
    .setSubject(String(userId))
    .setIssuer(TOKEN_ISSUER)
    .setAudience(TOKEN_AUDIENCE)
    .setExpirationTime("8h")
    .sign(getTokenSecret());
}

export async function createDoctorToken(userId: number): Promise<string> {
  return createAuthToken(userId, "medico");
}

export async function verifyDoctorToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, getTokenSecret(), {
    algorithms: [TOKEN_ALGORITHM],
    issuer: TOKEN_ISSUER,
    audience: TOKEN_AUDIENCE,
  });
  return payload;
}