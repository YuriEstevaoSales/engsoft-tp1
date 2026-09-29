export type PublicQuestion = {
  id: number;
  question: string;
  createdAt: string;
};

function isPublicQuestion(value: unknown): value is PublicQuestion {
  if (typeof value !== "object" || value === null) return false;
  const question = value as Record<string, unknown>;
  return Number.isInteger(question["id"])
    && typeof question["question"] === "string"
    && typeof question["createdAt"] === "string"
    && !Number.isNaN(Date.parse(question["createdAt"]));
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
  if (!isPublicQuestion(result)) throw new Error("A resposta de perguntas é inválida.");
  return result;
}