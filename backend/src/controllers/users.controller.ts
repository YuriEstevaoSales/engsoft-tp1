import { Controller, Get } from "@nestjs/common";
import { db } from "../prisma/db.js";

@Controller("api/users")
export class UsersController {
  @Get()
  async getUsers() {
    const users = await db.orm.public.Users
      .select("id", "name")
      .orderBy((user) => user.id.asc())
      .limit(10)
      .all();

    return { count: users.length, users };
  }
}
