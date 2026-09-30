# Engenharia de Software - TP1

## Membros
Yuri Estevão Sales de Oliveira - Fullstack

Luiza de Paula Costa - Fullstack

Jean Berly Rivera Sarmiento - Fullstack

## Objetivo do sistema
Trata-se de uma plataforma semelhante ao Doctoralia, onde os pacientes podem procurar médicos de diferentes especialidades, marcar consultas, definir lembretes, ver avaliações e compartilhar suas próprias experiências. Da mesma forma, os médicos podem divulgar seu trabalho, atrair novos pacientes, simplificar a comunicação, organizar a agenda de atendimentos e responder a dúvidas dos usuários através de um "fórum". Nesse fórum, pacientes poderão enviar suas perguntas e dúvidas de forma anônima para que qualquer médico especialista possa responder e para que qualquer pessoa possa visualizar tanto a pergunta do paciente quanto a resposta do especialista.

## Tecnologias
Typescript, Javascript, React, Nest e Gemini.

## Página de teste do banco

Para testar a integração local, configure `DATABASE_URL` no arquivo `.env`, inicie
o PostgreSQL e execute:

```bash
npm run dev
```

Abra o endereço exibido pelo Vite no terminal, acrescentando `/teste-banco`
(normalmente `http://localhost:5173/teste-banco`). A página usa o loader do
React Router para buscar os dez primeiros convênios da tabela `insurances` pela
API Nest e exibe ID e nome. Uma lista vazia indica que a consulta funcionou, mas
não há convênios visíveis para a conexão atual. Se a API ou o banco não estiverem
acessíveis, a página mostra um aviso e permite tentar novamente.

A API tem controllers separados para cada tabela de domínio: `/api/insurances`,
`/api/users`, `/api/doctors`, `/api/patients`, `/api/appointments` e
`/api/medical-records`. Cada rota retorna até dez registros com campos limitados
para teste; a rota de prontuários não retorna dados clínicos.

## Executar com Docker

Com Docker e o plugin Docker Compose instalados, na raiz do projeto execute:

O login médico requer `AUTH_TOKEN_SECRET` no `.env`. Gere um segredo local com:

```bash
printf '\nAUTH_TOKEN_SECRET=%s\n' "$(openssl rand -hex 32)" >> .env
```

Não compartilhe esse valor nem o inclua no Git.

```bash
docker compose up --build
```

Na primeira execução, o Compose cria um PostgreSQL local, inicializa as tabelas
e inclui convênios de demonstração. A aplicação usa `DATABASE_URL` do `.env`
quando definida; sem ela, usa o PostgreSQL local do Compose. Abra `http://localhost:5173/teste-banco`;
a API usa a porta definida por `API_PORT` no `.env` (padrão `3002`) e fica
disponível como `http://app:${API_PORT}/api/insurances` somente dentro da rede
do Compose. Para encerrar, pressione `Ctrl+C` e execute
`docker compose down`. Os dados do banco permanecem no volume `postgres-data`
entre reinicializações. As credenciais definidas no Compose são apenas para
desenvolvimento local; não as use em produção.

Se o volume `postgres-data` foi criado antes da inclusão do catálogo de
especialidades, aplique a migração aditiva uma vez:

```bash
docker compose exec -T db psql -U dochub -d dochub < docker/postgres/migrations/002_medical_specialties.sql
```

Para incluir a tabela de perguntas em um volume existente, aplique também:

```bash
docker compose exec -T db psql -U dochub -d dochub < docker/postgres/migrations/004_questions.sql
```

Para habilitar respostas médicas em um volume existente, aplique a migração:

```bash
docker compose exec -T db psql -U dochub -d dochub < docker/postgres/migrations/005_answers.sql
```

No Supabase, aplique os arquivos `004_questions.sql` e `005_answers.sql` pelo
SQL Editor, nessa ordem, caso ainda não tenha aplicado a 004. A 005 ativa RLS
e remove acesso direto das roles `anon` e `authenticated`; o Nest acessa essas
tabelas pelo `DATABASE_URL` mantido somente no servidor. Aplique também
`006_user_role.sql` para instalar o default `patient` e classificar contas antigas
vinculadas a médicos como `doctor`.

A página pública de perguntas fica em `/perguntas-respostas`. Qualquer pessoa
pode publicar sem conta; as perguntas são exibidas imediatamente e ficam
anônimas. Médicos entram pela tela de login para responder. A API e as regras de validação estão descritas em
[`docs/api/questions.md`](docs/api/questions.md).

## Histórias de usuário

Como paciente, eu gostaria de achar médicos próximos de mim.

Como paciente, eu gostaria de filtrar médicos por especialidade.

Como paciente, eu gostaria de marcar consultas.

Como paciente, eu gostaria de receber lembretes das minhas consultas.

Como paciente, eu gostaria de poder avaliar o serviço e ver avaliações de outras pessoas.

Como paciente, eu gostaria de poder enviar perguntas para outros médicos.

Como médico, eu gostaria de me cadastrar na plataforma.

Como médico, eu gostaria de visualizar as datas das minhas consultas agendadas.

Como médico, eu gostaria de poder responder dúvidas de outros pacientes.

## Documentação Preliminar (UML)

### 1. Diagrama de Casos de Uso
*Visão geral das interações entre os diferentes tipos de usuários (Visitantes Anônimos, Pacientes e Médicos) e as funcionalidades da plataforma.*

```mermaid
flowchart LR
classDef wip fill:#f3f4f6,stroke:#9ca3af,stroke-width:2px,stroke-dasharray: 5 5,color:#6b7280;

    %% Atores
    Visitante([Visitante / Anônimo])
    Paciente([Paciente])
    Medico([Médico])

    %% Sistema
    subgraph DocHub [Plataforma DocHub]
        %% Casos de Uso - Públicos
        UC1(Buscar médicos por especialidade/local)
        UC2(Visualizar avaliações)
        UC3(Visualizar perguntas e respostas)
        UC4(Enviar pergunta anônima)
        
        %% Casos de Uso - Paciente
        UC5(Marcar consulta):::wip
        UC6(Receber lembretes):::wip
        UC7(Avaliar atendimento):::wip
        
        %% Casos de Uso - Médico
        UC8(Fazer login / Cadastrar-se)
        UC9(Gerenciar agenda):::wip
        UC10(Responder perguntas no fórum)
        UC11(Gerenciar prontuários):::wip
    end

    %% Relacionamentos Visitante
    Visitante --> UC1
    Visitante --> UC2
    Visitante --> UC3
    Visitante --> UC4

    %% Relacionamentos Paciente (herda ações do visitante, mas focamos nas exclusivas)
    Paciente --> UC5
    Paciente --> UC6
    Paciente --> UC7
    Paciente -. "Também pode" .-> UC1
    Paciente -. "Também pode" .-> UC4

    %% Relacionamentos Médico
    Medico --> UC8
    Medico --> UC9
    Medico --> UC10
    Medico --> UC11
