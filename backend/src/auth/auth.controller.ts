import { Body, Controller, HttpException, Post } from "@nestjs/common";
import { AuthService, RegisterDoctorInput, RegisterPatientInput } from "./auth.service.js";

@Controller("api/auth")
export class AuthController {
  private readonly authService = new AuthService();

  @Post("register-doctor")
  async registerDoctor(@Body() body: RegisterDoctorInput) {
    try {
      return await this.authService.registerDoctor(body);
    } catch (error) {
      this.rethrow(error);
    }
  }

  @Post("register-patient")
  async registerPatient(@Body() body: RegisterPatientInput) {
    try {
      return { user: await this.authService.registerPatient(body) };
    } catch (error) {
      this.rethrow(error);
    }
  }

  @Post("login")
  async login(@Body() body: { email?: string; password?: string }) {
    try {
      return await this.authService.login(body.email ?? "", body.password ?? "");
    } catch (error) {
      this.rethrow(error);
    }
  }

  private rethrow(error: unknown): never {
    if (error instanceof HttpException) throw error;
    throw error;
  }
}
