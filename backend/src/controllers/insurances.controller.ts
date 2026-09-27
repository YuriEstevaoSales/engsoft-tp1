import { Controller, Get } from "@nestjs/common";
import { db } from "../prisma/db.js";

@Controller("api/insurances")
export class InsurancesController {
  @Get()
  async getInsurances() {
    const insurances = await db.orm.public.Insurances
      .select("id", "name")
      .orderBy((insurance) => insurance.id.asc())
      .all();

    return {
      source: "insurances",
      count: insurances.length,
      insurances,
    };
  }
}
