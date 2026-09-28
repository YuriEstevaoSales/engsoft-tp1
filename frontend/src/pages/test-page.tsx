import { isRouteErrorResponse, useLoaderData, useRevalidator, useRouteError } from "react-router";
import type { TestData } from "../routes/test-data.js";

export function TestPage() {
  const data = useLoaderData<TestData>();
  const revalidator = useRevalidator();
  const isRefreshing = revalidator.state !== "idle";

  return (
    <main className="grid min-h-screen place-items-center px-5 py-8">
      <section className="w-full max-w-[760px] rounded-3xl border border-[#dce7e3] bg-white p-6 shadow-[0_24px_70px_rgb(29_71_59_/_8%)] md:p-12" aria-labelledby="page-title">
        <header className="flex items-start justify-between gap-6 max-[600px]:flex-col">
          <div>
            <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.12em] text-[#278067]">Verificação de integração</p>
            <h1 id="page-title" className="text-[clamp(1.8rem,5vw,2.6rem)] font-bold leading-tight tracking-tight">Convênios cadastrados</h1>
            <p className="mt-3.5 max-w-[560px] leading-relaxed text-[#64756f]">
              Estes dados vêm da tabela de convênios e são carregados pela API.
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#e8f6ef] px-3 py-2 text-[0.85rem] font-bold text-[#1d744e]">
            <span className="size-2 rounded-full bg-[#2eaa70]" aria-hidden="true" />
            Conectado
          </span>
        </header>

        <div className="my-8 mb-4 flex items-baseline gap-2.5 text-[#64756f]" role="status">
          <strong className="text-3xl font-bold tracking-tight text-[#17332d]">{data.count}</strong>
          <span>
            {data.count === 1 ? "registro retornado" : "registros retornados"} do banco
          </span>
        </div>

        {data.insurances.length > 0 ? (
          <ul className="m-0 grid list-none gap-2 p-0">
            {data.insurances.map((insurance) => (
              <li className="flex items-center gap-4 rounded-xl border border-[#e7eeeb] px-4 py-3.5 text-[#27423a]" key={insurance.id}>
                <span className="min-w-12 tabular-nums text-[#778780]">#{insurance.id}</span>
                <span>{insurance.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-xl bg-[#f5f8f7] p-[18px] text-[#64756f]">
            A consulta funcionou, mas não há convênios visíveis para exibir.
          </p>
        )}

        <footer className="mt-7 flex items-center justify-between gap-4 border-t border-[#e7eeeb] pt-5 text-sm text-[#778780] max-[600px]:items-start max-[600px]:flex-col">
          <span>Fonte: tabela de convênios</span>
          <button
            className="cursor-pointer rounded-[10px] bg-[#20765e] px-4 py-3 font-bold text-white hover:bg-[#185e4a] disabled:cursor-wait disabled:opacity-70"
            type="button"
            disabled={isRefreshing}
            onClick={() => void revalidator.revalidate()}
          >
            {isRefreshing ? "Atualizando..." : "Consultar novamente"}
          </button>
        </footer>
      </section>
    </main>
  );
}

export function TestPageError() {
  const error = useRouteError();
  const revalidator = useRevalidator();
  const status = isRouteErrorResponse(error) ? ` (HTTP ${error.status})` : "";

  return (
    <main className="grid min-h-screen place-items-center px-5 py-8">
      <section className="w-full max-w-[760px] rounded-3xl border border-[#f0d6d3] bg-white p-6 shadow-[0_24px_70px_rgb(29_71_59_/_8%)] md:p-12" role="alert">
        <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.12em] text-[#ad4b42]">Falha na verificação{status}</p>
        <h1 className="text-[clamp(1.8rem,5vw,2.6rem)] font-bold leading-tight tracking-tight">Não foi possível carregar os dados</h1>
        <p className="mt-3.5 max-w-[560px] leading-relaxed text-[#64756f]">
          Confira se o backend está ativo, se o banco está acessível e se a variável
          DATABASE_URL está configurada.
        </p>
        <button
          className="mt-6 cursor-pointer rounded-[10px] bg-[#20765e] px-4 py-3 font-bold text-white hover:bg-[#185e4a]"
          type="button"
          onClick={() => void revalidator.revalidate()}
        >
          Tentar novamente
        </button>
      </section>
    </main>
  );
}
