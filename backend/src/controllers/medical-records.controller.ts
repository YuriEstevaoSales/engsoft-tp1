import { Controller, Get } from "@nestjs/common";
import { db } from "../prisma/db.js";

@Controller("api/medical-records")
export class MedicalRecordsController {
  @Get()
  async getMedicalRecords() {
    const medicalRecords = await db.orm.public.MedicalRecords
      .select("id", "createdAt")
      .orderBy((record) => record.id.asc())
      .limit(10)
      .all();

    return { count: medicalRecords.length, medicalRecords };
  }
}
