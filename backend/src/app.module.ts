import { Module } from "@nestjs/common";
import { AuthController } from "./auth/auth.controller.js";
import { AppointmentsController } from "./controllers/appointments.controller.js";
import { DoctorsController } from "./controllers/doctors.controller.js";
import { InsurancesController } from "./controllers/insurances.controller.js";
import { MedicalSpecialtiesController } from "./controllers/medical-specialties.controller.js";
import { MedicalRecordsController } from "./controllers/medical-records.controller.js";
import { PatientsController } from "./controllers/patients.controller.js";
import { QuestionsController } from "./controllers/questions.controller.js";
import { QuestionsService } from "./controllers/questions.service.js";
import { UsersController } from "./controllers/users.controller.js";

@Module({
  controllers: [
    AppointmentsController,
    AuthController,
    DoctorsController,
    InsurancesController,
    MedicalSpecialtiesController,
    MedicalRecordsController,
    PatientsController,
    QuestionsController,
    UsersController,
  ],
  providers: [QuestionsService],
})
export class AppModule {}
