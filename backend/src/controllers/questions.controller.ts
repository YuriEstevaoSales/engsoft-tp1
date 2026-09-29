import { Body, Controller, Get, Post } from "@nestjs/common";
import { Public } from "../auth/public.decorator.js";
import { QuestionsService } from "./questions.service.js";

@Controller("api/questions")
export class QuestionsController {
  private readonly questions = new QuestionsService();

  @Public()
  @Get()
  list() {
    return this.questions.listPublicQuestions();
  }

  @Public()
  @Post()
  create(@Body() body: { question?: unknown } | null) {
    return this.questions.createAnonymousQuestion(body?.question);
  }
}