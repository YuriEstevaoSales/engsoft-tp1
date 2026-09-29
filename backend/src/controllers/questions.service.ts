import { BadRequestException, Injectable } from "@nestjs/common";
import { db } from "../prisma/db.js";

const QUESTIONS_PAGE_SIZE = 20;
const QUESTION_MIN_LENGTH = 10;
const QUESTION_MAX_LENGTH = 1000;

@Injectable()
export class QuestionsService {
  async listPublicQuestions() {
    const questions = await db.orm.public.Questions
      .select("id", "question", "createdAt")
      .orderBy([(question) => question.createdAt.desc(), (question) => question.id.desc()])
      .limit(QUESTIONS_PAGE_SIZE)
      .all();

    return { count: questions.length, questions };
  }

  async createAnonymousQuestion(input: unknown) {
    if (typeof input !== "string") {
      throw new BadRequestException("Escreva sua pergunta.");
    }

    const question = input.trim();
    if (question.length < QUESTION_MIN_LENGTH || question.length > QUESTION_MAX_LENGTH) {
      throw new BadRequestException("A pergunta deve ter entre 10 e 1000 caracteres.");
    }

    return db.orm.public.Questions
      .select("id", "question", "createdAt")
      .create({ question });
  }
}