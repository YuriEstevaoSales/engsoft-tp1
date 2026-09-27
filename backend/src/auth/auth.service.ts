import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { db } from "../prisma/db.js";
import { encryptPassword, passwordMatches } from "./password.js";

export type RegisterDoctorInput = {
  email: string; name: string; cpf: string; birthday: string;
  phoneNumber: string; stateAddress: string; city?: string; insuranceId?: string;
  password: string; specialty: string; crm: string; formationDate?: string;
  street: string; addressNumber: string; addressComplement?: string;
  clinicState?: string; clinicCity?: string;
};

@Injectable()
export class AuthService {
  async registerDoctor(input: RegisterDoctorInput) {
    if (!input.email || !input.password || input.password.length < 6) {
      throw new BadRequestException("Informe email e senha com pelo menos 6 caracteres.");
    }
    if (!input.name || !input.cpf || !input.crm || !input.street || !input.addressNumber) {
      throw new BadRequestException("Preencha todos os campos obrigatórios.");
    }
    const { uf, number } = this.parseCrm(input.crm, input.clinicState ?? input.stateAddress);
    const insurance = input.insuranceId ? Number(input.insuranceId) : null;
    try {
      const user = await db.transaction(async (tx) => {
        const created = await tx.orm.public.Users.select("id", "name", "email").create({
          email: input.email.trim().toLowerCase(), name: input.name.trim(),
          cpf: input.cpf.trim(), birthday: Temporal.PlainDate.from(input.birthday),
          phoneNumber: input.phoneNumber.trim(),
          stateAddress: (input.clinicState ?? input.stateAddress).trim(),
          city: (input.clinicCity ?? input.city)?.trim() || null,
          passwordEncrypted: await encryptPassword(input.password),
          photo: null, gender: null,
        });
        await tx.orm.public.Doctors.create({
          userId: created.id, crmUf: uf, crmNumber: number,
          street: input.street.trim(),
          addressNumber: Number(input.addressNumber),
          addressComplement: input.addressComplement?.trim() || null,
          specialty: input.specialty, experienceTime: input.formationDate || null,
          remoteAppointments: true,
          insurances: Number.isFinite(insurance) ? [insurance] : null,
        });
        return created;
      });
      return { id: user.id, name: user.name, email: user.email, role: "medico" as const };
    } catch (error) {
      throw this.mapWriteError(error);
    }
  }

  async login(email: string, password: string) {
    const user = await db.orm.public.Users
      .select("id", "name", "email", "passwordEncrypted")
      .where({ email: email.trim().toLowerCase() }).first();
    const doctor = user
      ? await db.orm.public.Doctors.select("id").where({ userId: user.id }).first() : null;
    if (!user || !doctor) throw new UnauthorizedException("Email ou senha inválidos.");
    if (!(await passwordMatches(password, user.passwordEncrypted))) {
      throw new UnauthorizedException("Email ou senha inválidos.");
    }
    return { id: user.id, name: user.name, email: user.email, role: "medico" as const };
  }

  private parseCrm(crm: string, fallbackUf: string) {
    const match = crm.trim().toUpperCase().match(/([A-Z]{2})?\s*[-.]?\s*(\d+)/);
    const uf = match?.[1] ?? fallbackUf.trim().slice(0, 2).toUpperCase() ?? "MG";
    const number = match?.[2] ?? crm.replace(/\D/g, "");
    if (!number) throw new BadRequestException("Informe um CRM válido.");
    return { uf, number };
  }

  private mapWriteError(error: unknown) {
    const text = error instanceof Error ? error.message : String(error);
    if (text.includes("users_email_key")) return new ConflictException("Este email já está cadastrado.");
    if (text.includes("users_cpf_key")) return new ConflictException("Este CPF já está cadastrado.");
    if (text.includes("users_phone_number_key")) return new ConflictException("Este telefone já está cadastrado.");
    if (text.includes("doctor_crm_number_key")) return new ConflictException("Este CRM já está cadastrado.");
    return error instanceof Error ? error : new Error(text);
  }
}
