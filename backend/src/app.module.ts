import { Module } from "@nestjs/common";
import { AppointmentsController } from "./controllers/appointments.controller.js";
import { DoctorsController } from "./controllers/doctors.controller.js";
import { InsurancesController } from "./controllers/insurances.controller.js";
import { MedicalRecordsController } from "./controllers/medical-records.controller.js";
import { PatientsController } from "./controllers/patients.controller.js";
import { UsersController } from "./controllers/users.controller.js";

@Module({
  controllers: [
    AppointmentsController,
    DoctorsController,
    InsurancesController,
    MedicalRecordsController,
    PatientsController,
    UsersController,
  ],
})
export class AppModule {}
