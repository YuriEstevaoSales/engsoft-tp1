import { Controller, Get, Query } from "@nestjs/common";
import { Public } from "../auth/public.decorator.js";
import { db } from "../prisma/db.js";
import { matchesDoctorSearchFilters } from "./doctor-search-filters.js";

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

  @Public()
  @Get("search")
  async searchBySpecialty(
    @Query("specialty") specialty: string,
    @Query("minRating") minRating?: string,
    @Query("insuranceId") insuranceId?: string,
    @Query("state") state?: string,
    @Query("city") city?: string,
  ) {
    if (typeof specialty !== "string" || !specialty.trim()) {
      return { count: 0, doctors: [] };
    }
    const selectedSpecialties = [...new Set(specialty.split(",").map((item) => item.trim()).filter(Boolean))];
    for (const selectedSpecialty of selectedSpecialties) {
      const incrementFrequency = db.raw.sql`
        UPDATE public.medical_specialties
        SET access_frequency = access_frequency + 1
        WHERE medical_specialty = ${selectedSpecialty}
      `.affectedCount().build();
      await db.runtime().execute(incrementFrequency);
    }

    const minimumRating = minRating && ["3", "4", "5"].includes(minRating)
      ? Number(minRating)
      : null;
    const selectedInsuranceId = insuranceId && /^\d+$/.test(insuranceId)
      ? Number(insuranceId)
      : null;
    const selectedState = state?.trim().toLocaleUpperCase("pt-BR") || null;
    const selectedCity = city?.trim() || null;
    const filters = {
      minimumRating,
      insuranceId: selectedInsuranceId,
      state: selectedState,
      city: selectedCity,
    };

    const doctors = (await Promise.all(selectedSpecialties.map((selectedSpecialty) =>
      db.orm.public.Doctors
        .where({ specialty: selectedSpecialty })
        .select(
          "id",
          "specialty",
          "crmNumber",
          "crmUf",
          "street",
          "addressNumber",
          "addressComplement",
          "insurances",
        )
        .include("user", (user) =>
          user.select("name", "photo", "city", "stateAddress"),
        )
        .orderBy((doctor) => doctor.id.asc())
        .all(),
    ))).flat().filter((doctor, index, all) =>
      all.findIndex((candidate) => candidate.id === doctor.id) === index,
    ).sort((left, right) => left.id - right.id);

    if (doctors.length === 0) return { count: 0, doctors: [] };

    const doctorIds = doctors.map(({ id }) => id);
    const ratings = await db.orm.public.Appointments
      .where((appointment) => appointment.doctorId.in(doctorIds))
      .groupBy("doctorId")
      .aggregate((aggregate) => ({
        averageRating: aggregate.avg("rate"),
      }));
    const ratingsByDoctor = new Map(
      ratings.map(({ doctorId, averageRating }) => [doctorId, averageRating]),
    );
    const insuranceCatalog = await db.orm.public.Insurances
      .select("id", "name")
      .all();
    const insuranceNamesById = new Map(
      insuranceCatalog.map(({ id, name }) => [id, name]),
    );

    const matchingDoctors = doctors.map((doctor) => ({
        ...doctor,
        averageRating: ratingsByDoctor.get(doctor.id) ?? null,
        acceptedInsurances: (doctor.insurances ?? [])
          .map((id) => insuranceNamesById.get(id))
          .filter((name): name is string => name !== undefined),
      }))
      .filter((doctor) => matchesDoctorSearchFilters(doctor, filters));

    return { count: matchingDoctors.length, doctors: matchingDoctors };
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
    if (!user) return { profile: null };
    if (!doctor) {
      const patient = await db.orm.public.Patients
        .select("insurance")
        .where({ userId: id }).first();
      if (!patient) return { profile: null };
      return { profile: { ...user, role: "paciente" as const, insurance: patient.insurance } };
    }
    return { profile: { ...user, ...doctor, role: "medico" as const } };
  }
}
