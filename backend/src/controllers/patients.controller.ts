import { Controller, Get } from "@nestjs/common";
import { db } from "../prisma/db.js";

@Controller("api/patients")
export class PatientsController {
  @Get()
  async getPatients() {
    const patients = await db.orm.public.Patients
      .select("id", "createdAt")
      .orderBy((patient) => patient.id.asc())
      .limit(10)
      .all();

    return { count: patients.length, patients };
  }
}
