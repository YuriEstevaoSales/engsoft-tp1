export type DoctorAnswer = {
  id: number;
  questionId: number;
  doctorId: number;
  answer: string;
  createdAt: string;
};

export type PublicAnswer = {
  id: number;
  answer: string;
  createdAt: string;
  doctor: { specialty: string | null; user: { name: string } };
};

export type PublicQuestion = {
  id: number;
  question: string;
  createdAt: string;
  answers: PublicAnswer[];
};

function isDoctorAnswer(value: unknown): value is DoctorAnswer {
  if (typeof value !== "object" || value === null) return false;
  const answer = value as Record<string, unknown>;
  return Number.isInteger(answer["id"])
    && Number.isInteger(answer["questionId"])
    && Number.isInteger(answer["doctorId"])
    && typeof answer["answer"] === "string"
    && typeof answer["createdAt"] === "string"
    && !Number.isNaN(Date.parse(answer["createdAt"]));
}

function isPublicAnswer(value: unknown): value is PublicAnswer {
  if (typeof value !== "object" || value === null) return false;
  const answer = value as Record<string, unknown>;
  const doctor = answer["doctor"];
  if (typeof doctor !== "object" || doctor === null) return false;
  const profile = doctor as Record<string, unknown>;
  const user = profile["user"];
  return Number.isInteger(answer["id"])
    && typeof answer["answer"] === "string"
    && typeof answer["createdAt"] === "string"
    && !Number.isNaN(Date.parse(answer["createdAt"]))
    && (typeof profile["specialty"] === "string" || profile["specialty"] === null)
    && typeof user === "object"
    && user !== null
    && typeof (user as Record<string, unknown>)["name"] === "string";
}

function isQuestionSummary(value: unknown): value is Omit<PublicQuestion, "answers"> {
  if (typeof value !== "object" || value === null) return false;
  const question = value as Record<string, unknown>;
  return Number.isInteger(question["id"])
    && typeof question["question"] === "string"
    && typeof question["createdAt"] === "string"
    && !Number.isNaN(Date.parse(question["createdAt"]));
}

function isPublicQuestion(value: unknown): value is PublicQuestion {
  if (!isQuestionSummary(value)) return false;
  const answers = (value as Record<string, unknown>)["answers"];
  return Array.isArray(answers) && answers.every(isPublicAnswer);
}

export async function loadQuestions(): Promise<PublicQuestion[]> {
  const response = await fetch("/api/questions");
  if (!response.ok) throw new Error("Não foi possível carregar as perguntas.");
  const result: unknown = await response.json();
  if (typeof result !== "object" || result === null) {
    throw new Error("A resposta de perguntas é inválida.");
  }
  const payload = result as Record<string, unknown>;
  if (!Array.isArray(payload["questions"]) || !payload["questions"].every(isPublicQuestion)) {
    throw new Error("A resposta de perguntas é inválida.");
  }
  return payload["questions"];
}

export async function createQuestion(question: string): Promise<PublicQuestion> {
  const response = await fetch("/api/questions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  if (!response.ok) throw new Error("Não foi possível publicar sua pergunta.");
  const result: unknown = await response.json();
  if (!isQuestionSummary(result)) throw new Error("A resposta de perguntas é inválida.");
  const answers = (result as Record<string, unknown>)["answers"];
  if (answers === undefined) return { ...result, answers: [] };
  if (!Array.isArray(answers) || !answers.every(isPublicAnswer)) {
    throw new Error("A resposta de perguntas é inválida.");
  }
  return { ...result, answers };
}

export async function createAnswer(
  questionId: number,
  answer: string,
  accessToken: string,
): Promise<DoctorAnswer> {
  const response = await fetch(`/api/questions/${questionId}/answers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ answer }),
  });
  const result: unknown = await response.json();
  if (!response.ok) {
    const message = typeof result === "object" && result !== null
      && typeof (result as Record<string, unknown>)["message"] === "string"
      ? String((result as Record<string, unknown>)["message"])
      : "Não foi possível enviar sua resposta.";
    throw new Error(message);
  }
  if (!isDoctorAnswer(result)) throw new Error("A resposta do servidor é inválida.");
  return result;
}