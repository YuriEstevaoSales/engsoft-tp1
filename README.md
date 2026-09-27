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

```bash
docker compose up --build
```

Na primeira execução, o Compose cria um PostgreSQL local, inicializa as tabelas
e inclui convênios de demonstração. Abra `http://localhost:5173/teste-banco`;
a API também fica disponível em `http://localhost:3001/api/insurances` somente
dentro da rede do Compose. Para encerrar, pressione `Ctrl+C` e execute
`docker compose down`. Os dados do banco permanecem no volume `postgres-data`
entre reinicializações. As credenciais definidas no Compose são apenas para
desenvolvimento local; não as use em produção.

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
