import { Controller, Get, Query } from "@nestjs/common";
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

  @Get("me")
  async getMe(@Query("userId") userId: string) {
    const id = Number(userId);
    if (!Number.isFinite(id) || id <= 0) return { profile: null };
    const user = await db.orm.public.Users
      .select("id", "name", "email", "city", "stateAddress")
      .where({ id }).first();
    const doctor = await db.orm.public.Doctors
      .select("specialty", "description", "appointmentPrice", "remoteAppointments",
        "street", "addressNumber", "addressComplement", "insurances")
      .where({ userId: id }).first();
    if (!user || !doctor) return { profile: null };
    return { profile: { ...user, ...doctor } };
  }
}
