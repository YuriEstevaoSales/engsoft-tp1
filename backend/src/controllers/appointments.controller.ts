import { Controller, Get } from "@nestjs/common";
import { db } from "../prisma/db.js";

@Controller("api/appointments")
export class AppointmentsController {
  @Get()
  async getAppointments() {
    const appointments = await db.orm.public.Appointments
      .select("id", "date", "startTime", "endTime", "rate")
      .orderBy((appointment) => appointment.id.asc())
      .limit(10)
      .all();

    return { count: appointments.length, appointments };
  }
}
