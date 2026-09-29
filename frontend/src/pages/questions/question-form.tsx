import { type FormEvent, useState } from "react";
import { createQuestion, type PublicQuestion } from "../../routes/questions.js";

const MIN_LENGTH = 10;
const MAX_LENGTH = 1000;

type QuestionFormProps = {
  onPublished: (question: PublicQuestion) => void;
};

export function QuestionForm({ onPublished }: QuestionFormProps) {
  const [question, setQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = question.trim();
    if (normalized.length < MIN_LENGTH || normalized.length > MAX_LENGTH) {
      setError("Escreva uma pergunta entre 10 e 1000 caracteres.");
      return;
    }

    setSubmitting(true);
    setError("");
    setNotice("");
    try {
      const created = await createQuestion(normalized);
      onPublished(created);
      setQuestion("");
      setNotice("Sua pergunta foi publicada.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível publicar sua pergunta.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <h2 className="mb-2 text-xl font-bold text-[#173b38]">Faça uma pergunta</h2>
      <p className="mb-5 mt-0 text-sm leading-relaxed text-[#53625e]">
        Não inclua nome, telefone, endereço ou outros dados pessoais. A pergunta será publicada para todos.
      </p>
      <form className="grid gap-3" onSubmit={handleSubmit}>
        <label className="text-sm font-semibold" htmlFor="question-text">Sua dúvida</label>
        <textarea
          className="min-h-36 w-full resize-y rounded-lg border border-[#b9cbc5] bg-white p-3.5 text-base text-[#173b38] outline-none focus:border-[#1a6b66] focus:ring-2 focus:ring-[#1a6b66]/20"
          id="question-text"
          name="question"
          value={question}
          onChange={(event) => { setQuestion(event.currentTarget.value); setError(""); }}
          minLength={MIN_LENGTH}
          maxLength={MAX_LENGTH}
          required
          aria-describedby="question-guidance question-counter"
          placeholder="Escreva sua pergunta de forma clara e específica"
        />
        <div className="flex flex-wrap justify-between gap-3 text-xs text-[#53625e]">
          <p className="m-0 max-w-xl" id="question-guidance">
            O conteúdo é informativo e não substitui consulta ou atendimento de urgência.
          </p>
          <span className="shrink-0 tabular-nums" id="question-counter">
            {question.length}/{MAX_LENGTH}
          </span>
        </div>
        {error ? <p className="m-0 text-sm text-red-700" role="alert">{error}</p> : null}
        {notice ? <p className="m-0 text-sm font-semibold text-[#176b4d]" role="status">{notice}</p> : null}
        <button
          className="mt-1 min-h-11 w-fit rounded-lg bg-[#1a6b66] px-5 py-2.5 font-semibold text-white hover:bg-[#145651] disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Publicando..." : "Publicar pergunta"}
        </button>
      </form>
    </section>
  );
}