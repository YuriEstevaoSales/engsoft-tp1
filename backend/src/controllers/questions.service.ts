import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common";
import { db } from "../prisma/db.js";

const QUESTIONS_PAGE_SIZE = 20;
const QUESTION_MIN_LENGTH = 10;
const QUESTION_MAX_LENGTH = 1000;

export class QuestionsService {
  async listPublicQuestions() {
    const questions = await db.orm.public.Questions
      .select("id", "question", "createdAt")
      .include("answers", (answer) => answer
        .select("id", "answer", "createdAt")
        .include("doctor", (doctor) => doctor
          .select("specialty")
          .include("user", (user) => user.select("name"))))
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

  async createDoctorAnswer(questionId: number, doctorId: number, input: unknown) {
    if (!Number.isSafeInteger(questionId) || questionId < 1
      || !Number.isSafeInteger(doctorId) || doctorId < 1
      || typeof input !== "string") {
      throw new BadRequestException("Informe uma resposta válida.");
    }
    const answer = input.trim();
    if (answer.length < 10 || answer.length > 2000) {
      throw new BadRequestException("A resposta deve ter entre 10 e 2000 caracteres.");
    }
    if (!(await db.orm.public.Questions.first({ id: questionId }))) {
      throw new NotFoundException("Pergunta não encontrada.");
    }

    try {
      return await db.orm.public.Answers
        .select("id", "questionId", "doctorId", "answer", "createdAt")
        .create({ questionId, doctorId, answer });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes("answers_question_doctor_key")) {
        throw new ConflictException("Você já respondeu esta pergunta.");
      }
      throw error;
    }
  }
}