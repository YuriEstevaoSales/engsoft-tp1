import { isRouteErrorResponse, useLoaderData, useRevalidator, useRouteError } from "react-router";
import type { TestData } from "../routes/test-data.js";

export function TestPage() {
  const data = useLoaderData<TestData>();
  const revalidator = useRevalidator();
  const isRefreshing = revalidator.state !== "idle";

  return (
    <main className="page">
      <section className="panel" aria-labelledby="page-title">
        <header className="panel-header">
          <div>
            <p className="eyebrow">Verificação de integração</p>
            <h1 id="page-title">Convênios cadastrados</h1>
            <p className="description">
              Estes dados vêm da tabela de convênios e são carregados pela API.
            </p>
          </div>
          <span className="status">
            <span className="status-dot" aria-hidden="true" />
            Conectado
          </span>
        </header>

        <div className="summary" role="status">
          <strong>{data.count}</strong>
          <span>
            {data.count === 1 ? "registro retornado" : "registros retornados"} do banco
          </span>
        </div>

        {data.insurances.length > 0 ? (
          <ul className="user-list">
            {data.insurances.map((insurance) => (
              <li className="user-row" key={insurance.id}>
                <span className="user-id">#{insurance.id}</span>
                <span>{insurance.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-state">
            A consulta funcionou, mas não há convênios visíveis para exibir.
          </p>
        )}

        <footer className="panel-footer">
          <span>Fonte: tabela de convênios</span>
          <button
            className="refresh-button"
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
    <main className="page">
      <section className="panel error-panel" role="alert">
        <p className="eyebrow">Falha na verificação{status}</p>
        <h1>Não foi possível carregar os dados</h1>
        <p className="description">
          Confira se o backend está ativo, se o banco está acessível e se a variável
          DATABASE_URL está configurada.
        </p>
        <button
          className="refresh-button"
          type="button"
          onClick={() => void revalidator.revalidate()}
        >
          Tentar novamente
        </button>
      </section>
    </main>
  );
}
