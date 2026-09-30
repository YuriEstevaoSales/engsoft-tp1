import { type FormEvent, useState } from "react";
import { createAnswer } from "../../routes/questions.js";

type QuestionAnswerFormProps = {
  questionId: number;
  accessToken: string;
  onAnswered: () => void;
};

export function QuestionAnswerForm({ questionId, accessToken, onAnswered }: QuestionAnswerFormProps) {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = answer.trim();
    if (normalized.length < 10 || normalized.length > 2000) {
      setError("A resposta deve ter entre 10 e 2000 caracteres.");
      return;
    }
    setPending(true);
    setError("");
    try {
      await createAnswer(questionId, normalized, accessToken);
      setAnswer("");
      onAnswered();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível enviar a resposta.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="mt-5 grid gap-2.5 border-t border-[#dce8e4] pt-4" onSubmit={(event) => void submit(event)}>
      <label className="text-sm font-semibold text-[#244542]" htmlFor={`answer-${questionId}`}>
        Sua resposta como médico
      </label>
      <textarea
        className="min-h-24 resize-y rounded-lg border border-[#b9cbc5] bg-white p-3 text-sm text-[#173b38] outline-none focus:border-[#1a6b66] focus:ring-2 focus:ring-[#1a6b66]/20"
        id={`answer-${questionId}`}
        value={answer}
        onChange={(event) => { setAnswer(event.currentTarget.value); setError(""); }}
        minLength={10}
        maxLength={2000}
        required
        placeholder="Escreva uma orientação informativa e responsável"
      />
      {error ? <p className="m-0 text-sm text-red-700" role="alert">{error}</p> : null}
      <button
        className="min-h-10 w-fit rounded-lg bg-[#1a6b66] px-4 py-2 text-sm font-semibold text-white hover:bg-[#145651] disabled:opacity-60"
        type="submit"
        disabled={pending}
      >
        {pending ? "Enviando..." : "Responder"}
      </button>
    </form>
  );
}