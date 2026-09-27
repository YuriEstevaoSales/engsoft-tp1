import { Controller, Get } from "@nestjs/common";
import { db } from "../prisma/db.js";

@Controller("api/doctors")
export class DoctorsController {
  @Get()
  async getDoctors() {
    const doctors = await db.orm.public.Doctors
      .select("id", "specialty", "appointmentPrice", "remoteAppointments")
      .orderBy((doctor) => doctor.id.asc())
      .limit(10)
      .all();

    return { count: doctors.length, doctors };
  }
}
