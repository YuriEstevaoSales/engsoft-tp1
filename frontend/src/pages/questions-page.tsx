import { useState } from "react";
import type { PublicQuestion } from "../routes/questions.js";
import { QuestionFeed } from "./questions/question-feed.js";
import { QuestionForm } from "./questions/question-form.js";

export function QuestionsPage() {
  const [publishedQuestion, setPublishedQuestion] = useState<PublicQuestion>();

  return (
    <main className="mx-auto w-[min(1080px,calc(100%-40px))] flex-1 py-10 text-dochub-ink">
      <header className="max-w-3xl border-b border-[#dce8e4] pb-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-dochub-teal">
          Comunidade DocHub
        </p>
        <h1 className="m-0 text-3xl font-bold text-[#173b38]">Perguntas e respostas</h1>
        <p className="mb-0 mt-3 max-w-2xl leading-relaxed text-[#53625e]">
          Compartilhe sua dúvida de saúde com a comunidade. Você não precisa criar uma conta.
        </p>
      </header>

      <section className="grid gap-10 py-8 md:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
        <QuestionForm onPublished={setPublishedQuestion} />
        <QuestionFeed publishedQuestion={publishedQuestion} />
      </section>
    </main>
  );
}