import { Controller, Get } from "@nestjs/common";
import { Public } from "../auth/public.decorator.js";
import { db } from "../prisma/db.js";

@Controller("api/medical-specialties")
export class MedicalSpecialtiesController {
  @Public()
  @Get()
  async list() {
    const rows = await db.orm.public.MedicalSpecialties
      .select("medicalSpecialty")
      .orderBy((specialty) => specialty.medicalSpecialty.asc())
      .all();

    return { specialties: rows.map(({ medicalSpecialty }) => medicalSpecialty) };
  }
}
