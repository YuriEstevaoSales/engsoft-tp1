import { Body, Controller, HttpException, Post } from "@nestjs/common";
import { AuthService, RegisterDoctorInput } from "./auth.service.js";

@Controller("api/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register-doctor")
  async registerDoctor(@Body() body: RegisterDoctorInput) {
    try {
      return { user: await this.authService.registerDoctor(body) };
    } catch (error) {
      this.rethrow(error);
    }
  }

  @Post("login")
  async login(@Body() body: { email?: string; password?: string }) {
    try {
      return { user: await this.authService.login(body.email ?? "", body.password ?? "") };
    } catch (error) {
      this.rethrow(error);
    }
  }

  private rethrow(error: unknown): never {
    if (error instanceof HttpException) throw error;
    throw error;
  }
}
