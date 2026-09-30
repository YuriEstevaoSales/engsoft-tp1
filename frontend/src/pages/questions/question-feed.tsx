import { useEffect, useState } from "react";
import { Link } from "react-router";
import { readSession } from "../../auth/session.js";
import { loadQuestions, type PublicQuestion } from "../../routes/questions.js";
import { QuestionAnswerForm } from "./question-answer-form.js";

type QuestionFeedProps = {
  publishedQuestion?: PublicQuestion;
  refreshVersion: number;
  onAnswerCreated: () => void;
};

export function QuestionFeed({ publishedQuestion, refreshVersion, onAnswerCreated }: QuestionFeedProps) {
  const [questions, setQuestions] = useState<PublicQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const session = readSession();
  const accessToken = session?.role === "medico" ? session.accessToken : "";

  useEffect(() => {
    let active = true;
    setLoading(true);
    void loadQuestions()
      .then((items) => { if (active) setQuestions(items); })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "Erro ao carregar perguntas.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [retry, refreshVersion]);

  useEffect(() => {
    if (!publishedQuestion) return;
    setError("");
    setQuestions((current) => [
      publishedQuestion,
      ...current.filter((question) => question.id !== publishedQuestion.id),
    ].slice(0, 20));
  }, [publishedQuestion]);

  return (
    <section aria-labelledby="recent-questions-heading">
      <div className="flex items-end justify-between gap-3 border-b border-[#dce8e4] pb-3">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.1em] text-dochub-teal">Comunidade</p>
          <h2 className="m-0 text-xl font-bold text-[#173b38]" id="recent-questions-heading">
            Perguntas recentes
          </h2>
        </div>
        <span className="text-sm tabular-nums text-[#53625e]">{questions.length}</span>
      </div>
      {loading ? <p className="py-6 text-sm text-[#53625e]" role="status">Carregando perguntas...</p> : null}
      {error ? (
        <div className="py-6" role="alert">
          <p className="mb-3 mt-0 text-sm text-red-700">{error}</p>
          <button
            className="rounded-md border border-[#1a6b66] px-3 py-2 text-sm font-semibold text-[#1a6b66]"
            type="button"
            onClick={() => { setError(""); setRetry((version) => version + 1); }}
          >
            Tentar novamente
          </button>
        </div>
      ) : null}
      {!loading && !error && questions.length === 0 ? (
        <p className="py-6 text-sm text-[#53625e]">Ainda não há perguntas. Seja a primeira pessoa a perguntar.</p>
      ) : null}
      <div className="divide-y divide-[#dce8e4]">
        {questions.map((item) => (
          <article className="py-5" key={item.id}>
            <p className="my-0 whitespace-pre-wrap break-words leading-relaxed text-[#263d3a]">
              {item.question}
            </p>
            <time className="mt-3 block text-xs text-[#667873]" dateTime={item.createdAt}>
              {new Date(item.createdAt).toLocaleDateString("pt-BR", {
                day: "numeric", month: "long", year: "numeric",
              })}
            </time>
            {item.answers.length === 0 ? (
              <p className="mb-0 mt-4 text-sm text-[#667873]">Ainda sem respostas de médicos.</p>
            ) : (
              <div className="mt-4 grid gap-3 border-l-2 border-[#98c3b6] pl-4">
                {item.answers.map((answer) => (
                  <div key={answer.id}>
                    <p className="my-0 whitespace-pre-wrap break-words leading-relaxed text-[#244542]">
                      {answer.answer}
                    </p>
                    <p className="mb-0 mt-2 text-sm text-[#53625e]">
                      <strong>{answer.doctor.user.name}</strong>
                      {answer.doctor.specialty ? ` · ${answer.doctor.specialty}` : " · Médico"}
                    </p>
                    <time className="mt-1 block text-xs text-[#667873]" dateTime={answer.createdAt}>
                      {new Date(answer.createdAt).toLocaleDateString("pt-BR", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </time>
                  </div>
                ))}
              </div>
            )}
            {accessToken ? (
              <QuestionAnswerForm
                questionId={item.id}
                accessToken={accessToken}
                onAnswered={onAnswerCreated}
              />
            ) : (
              <p className="mb-0 mt-4 text-sm text-[#53625e]">
                É médico? <Link className="font-semibold text-dochub-teal underline" to="/entrar">Entre para responder</Link>.
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}