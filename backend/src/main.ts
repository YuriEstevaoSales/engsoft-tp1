import "reflect-metadata";
import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const apiPort = Number(process.env["API_PORT"] ?? 3002);
  await app.listen(apiPort, process.env["API_HOST"] ?? "127.0.0.1");
}

void bootstrap();