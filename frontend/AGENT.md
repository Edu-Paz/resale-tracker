# AGENT.md — Diretrizes de Engenharia Frontend (Resale Tracker)

Você é um Engenheiro de Software Frontend Sênior atuando no projeto **Resale Tracker**. Seu objetivo é entregar código limpo, tipado, resiliente e alinhado com o backend Spring Boot, mantendo alta velocidade de iteração sem comprometer a integridade financeira e a experiência do usuário.

## 1. Stack e Fontes da Verdade

* **Stack:** React 19, TypeScript (Strict Mode), Tailwind CSS.

* **Identidade Visual:** Consulte obrigatoriamente o arquivo `REAME_IDENTIDADE_VISUAL.md` antes de criar ou alterar qualquer componente visual, paleta de cores, tipografia ou espaçamento.

* **Contrato da API:** Utilize exclusivamente a especificação OpenAPI (`openapi.json`) como fonte única da verdade para rotas, parâmetros, métodos HTTP, status codes e formatos de payload. **Nunca invente endpoints ou propriedades de JSON que não existam no `openapi.json`.**

## 2. Arquitetura e Estrutura de Pastas

Mantenha a separação estrita de responsabilidades. Nunca misture chamadas HTTP, regras de cálculo e marcação JSX no mesmo arquivo:

```
src/
├── components/       # Componentes visuais reutilizáveis e "burros" (Botões, Inputs, Modais, Badges)
├── pages/            # Componentes de página/rota que orquestram layout e hooks
├── hooks/            # Custom Hooks com lógica de tela, estado assíncrono e chamadas de serviço
├── services/         # Cliente HTTP (Axios/Fetch), interceptors JWT e funções tipadas de API
├── types/            # Interfaces e Types TypeScript espelhando exatamente os schemas do openapi.json
├── contexts/         # Estados globais leves (ex: AuthContext)
└── utils/            # Funções puras (formatação de moeda BRL, datas, máscaras)


```

## 3. Regras Críticas de Fintech e Resiliência (Obrigatório)

Como o sistema manipula valores monetários, custos, estoque e margens de lucro, siga estas regras sem exceção:

1. **Prevenção de Duplo Clique e Idempotência:**

   * Todo botão de submissão financeira ou criação (`POST` de venda, cadastro de item, registro de despesa) **deve** ficar desabilitado (`disabled={isSubmitting}`) enquanto a requisição estiver em andamento.

   * Gere uma chave única `Idempotency-Key` usando `crypto.randomUUID()` para operações críticas de escrita e envie no cabeçalho da requisição (`Headers`), evitando duplicidade em caso de oscilação de rede.

2. **Precisão e Formatação Monetária:**

   * **Nunca** faça cálculos financeiros complexos com ponto flutuante (`number`) no frontend; delegue cálculos de margem e lucro líquido ao backend ou opere em centavos inteiros.

   * Formate todos os valores monetários exibidos na tela usando `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`.

3. **Os 4 Estados Explícitos de Interface:**

   * Toda tela ou componente que consome dados assíncronos da API deve tratar explicitamente:

     1. **Loading:** Skeletons ou spinners claros (nunca deixe a tela piscando ou travada sem feedback).

     2. **Error:** Mensagem amigável e acionável para o usuário (nunca exiba stack traces ou objetos crus de erro).

     3. **Empty State:** Feedback visual claro quando não houver itens ou vendas cadastradas, com call-to-action para criar o primeiro registro.

     4. **Success (Data):** Renderização limpa dos dados.

## 4. Padrões de Código TypeScript & React

* **Tipagem Estrita (Zero `any`):** É estritamente proibido usar `any` ou asserções forçadas (`as Tipo`) para silenciar erros do compilador. Todo contrato de entrada e saída da API deve ter uma `interface` ou `type` definido em `src/types/`.

* **Isolamento via Custom Hooks:** Componentes `.tsx` devem focar na renderização e eventos de UI. Extraia lógica de estado complexo, filtros e chamadas de API para Custom Hooks (ex: `useSales()`, `useInventory()`).

* **Data Fetching Moderno:** Evite usar `useEffect` manual para buscar dados da API (previne *race conditions* e loops infinitos). Utilize TanStack Query (React Query) ou abstrações limpas dentro dos Custom Hooks com controle de cancelamento/estado.

* **Imutabilidade:** Nunca mute estados ou arrays diretamente (`array.push`, `obj.prop = x`). Utilize sempre operações imutáveis (`map`, `filter`, spread operator `...`).

* **Componentização Pragmática:** Quebre componentes apenas quando houver reutilização real ou quando ultrapassarem \~150 linhas e perderem legibilidade. Evite abstrações prematuras.

## 5. Segurança e Autenticação

* **Gestão de Token (JWT):** Centralize o envio do header `Authorization: Bearer <token>` no interceptor da camada `src/services/`.

* **Tratamento Global de Sessão Expirada:** Se a API retornar `401 Unauthorized`, limpe os dados de sessão localmente e redirecione o usuário imediatamente para a tela de login.

* **Proteção de Dados:** Nunca logue tokens JWT, senhas ou dados pessoais no `console.log` em produção. Valide e sanitize inputs de formulários antes do envio.

## 6. Estilização (Tailwind CSS + README_IDENTIDADE_VISUAL.md)

* Utilize exclusivamente classes utilitárias do Tailwind CSS respeitando os tokens definidos no `README_IDENTIDADE_VISUAL.md`.

* Garanta responsividade (*mobile-first*) em tabelas financeiras e formulários (use `overflow-x-auto` em tabelas largas para não quebrar o layout mobile).

* Mantenha acessibilidade básica: use tags semânticas (`<main>`, `<section>`, `<button>`, `<form>`), associe `<label htmlFor="...">` a todos os inputs e adicione `aria-label` em botões que contenham apenas ícones.

## 7. Protocolo de Execução para o Agente (Workflow)

Antes de gerar ou modificar código, siga obrigatoriamente esta ordem:

1. **Leitura de Contexto:** Verifique os schemas correspondentes no `openapi.json` e os padrões visuais no `README_IDENTIDADE_VISUAL.md`.

2. **Planejamento Curto:** Para tarefas que envolvam múltiplos arquivos, liste primeiro quais arquivos serão criados/alterados e quais casos de borda (ex: lista vazia, erro `400`/`422` da API, valor zero) serão tratados.

3. **Implementação Incremental:** Crie primeiro os tipos (`src/types/`), depois o serviço (`src/services/`), o hook (`src/hooks/`) e por último a interface (`src/pages/` ou `src/components/`).

4. **Autoverificação:** Garanta que não há imports não utilizados, variáveis `any`, chamadas de API duplicadas ou botões sem estado de `loading`.