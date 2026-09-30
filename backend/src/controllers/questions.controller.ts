import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from "@nestjs/common";
import { DoctorAnswersGuard, type DoctorRequest } from "../auth/doctor-answers.guard.js";
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

  @UseGuards(DoctorAnswersGuard)
  @Post(":questionId/answers")
  answer(
    @Param("questionId", ParseIntPipe) questionId: number,
    @Body() body: { answer?: unknown } | null,
    @Req() request: DoctorRequest,
  ) {
    return this.questions.createDoctorAnswer(questionId, request.doctorId!, body?.answer);
  }
}