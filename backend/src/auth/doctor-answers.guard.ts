import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import type { Request } from "express";
import { db } from "../prisma/db.js";
import { verifyDoctorToken } from "./doctor-token.js";

export type DoctorRequest = Request & { doctorId?: number };

@Injectable()
export class DoctorAnswersGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<DoctorRequest>();
    const token = /^Bearer\s+(.+)$/i.exec(request.headers.authorization ?? "")?.[1];
    if (!token) throw new UnauthorizedException("Entre como médico para responder.");

    let claims;
    try {
      claims = await verifyDoctorToken(token);
    } catch {
      throw new UnauthorizedException("Sessão inválida ou expirada. Entre novamente.");
    }

    const userId = Number(claims.sub);
    if (claims.role !== "medico" || !Number.isSafeInteger(userId) || userId < 1) {
      throw new ForbiddenException("Somente médicos podem responder.");
    }

    const doctor = await db.orm.public.Doctors
      .select("id")
      .where({ userId })
      .first();
    if (!doctor) throw new ForbiddenException("Somente médicos cadastrados podem responder.");

    request.doctorId = doctor.id;
    return true;
  }
}