# Roadmap — Próximos Passos do Backend (Resale Tracker)

> Notas preparadas para entrevista técnica (Tech Lead / Staff Backend).
> Organizado por frentes: performance, integridade financeira, segurança,
> arquitetura & qualidade e infra/operação.

---

## ✅ Etapas Já Implementadas

- __Correção do N+1 no resumo financeiro__ — query dedicada com `@EntityGraph`
  (`findAllWithExpensesByUserId`): eliminou o carregamento da coleção LAZY
  `expense` dentro de laço (de 1+N queries para 1).
- __Agregação financeira empurrada para o PostgreSQL__ (Seção 4.2 do `AGENT.md`) —
  nova query agregada única `ItemRepository.summarizeFinancialSummaryByUserId`
  (`SUM` + `COALESCE` + `CASE WHEN` + subquery correlacionada) retornando a projeção
  `FinancialSummaryProjectionDTO`. O `BalanceService` agora só deriva `balance`,
  `totalInvested`, `netProfit` e `averageMargin`, sempre com `RoundingMode.HALF_UP`.
- __Fonte única de verdade no cálculo financeiro__ — removidos códigos
  duplicados/mortos: `calculateBalanceByUserId` (query nunca usada),
  `findAllWithExpensesByUserId` (superada pela agregação) e `valueOrZero`.
- __Testes de integração do resumo financeiro__ — `BalanceServiceIntegrationTests`
  (perfil `dev`/H2 + seed) com 4 cenários: usuário 1, usuário 2, usuário sem
  itens (retorna zeros) e escopo cross-user (anti-IDOR).
- __Ajuste de infra dev__ — variáveis do `docker-compose.yaml` passaram a usar a
  sintaxe `${VAR:-default}` para defaults corretos de ambiente.

### Validação das etapas

- `./mvnw -o compile` → **BUILD SUCCESS**
- `./mvnw -o test -Dtest=BalanceServiceIntegrationTests` → **4/4 PASS**
- SQL gerado pelo Hibernate: **1 única query** (`tb_item JOIN tb_category ...
  WHERE user_id = ?`) — sem N+1, sem materialização de itens/despesas na JVM.

---

## 🚀 Performance & Banco de Dados

- __(✅ Implementado) Agregação financeira no PostgreSQL__ — ver seção **Etapas Já Implementadas** acima.

- __Cache com Redis do `FinancialSummaryDTO` por `userId`.__

  - *Por quê:* o resumo é o endpoint mais lido do dashboard e raramente muda.
  - *Como:* TTL curto / invalidação explícita nas escritas (create/sell/update/delete de item e despesa).

- __Paginação (`Pageable`) nas listagens__ (`GET /items`, `GET /categories`, `GET /expense`).
  - *Por quê:* hoje todos os `findAll` retornam lista completa; cresce a memória/DB indefinidamente.

- __Definir `FetchType` explícito__ nas associações `@ManyToOne` (hoje default `EAGER`).
  - *Por quê:* `Item.category`, `Category.user`, `Expense.item` carregam cadeias extras mesmo sem uso. Decidir caso a caso, usando `@EntityGraph`/`JOIN FETCH` quando precisar.

- __`SecurityFilter` consulta o banco em toda requisição__ (`findByUsername`).
  - *Trade-off:* garante revogação por exclusão, mas é 1 query/request. Avaliar em alto throughput (achando o equilíbrio entre segurança e cache do principal).

---

## 💰 Integridade Financeira (Foco Fintech)

- __Idempotência em escritas financeiras (`Idempotency-Key`).__

  - *Por quê:* `POST /items`, `POST /expense` e `PATCH /items/{id}/sell` alteram dinheiro; retry/duplo clique pode gravar 2 vendas ou 2 despesas.
  - *Como:* persistir hash `(userId + chave + payload)` e rejeitar duplicatas com `409/422` reaproveitando a resposta original.

- __Unificar o cálculo de lucro/margem (fonte única).__

  - *Por quê:* `profit`/`margin` __denormalizados__ na `Item` e o `FinancialSummaryDTO` recalculam o mesmo lucro __em paralelo__ → risco de divergência se um fluxo esquecer de recalcular.
  - *Como:* calcular a partir das __fontes primárias__ (`sellPrice - buyPrice - expenses`, on-the-fly no banco) e tratar `profit`/`margin` como cache/derivados.

- __Guardar de negócio para venda abaixo do custo__ (opcional/explícita).
  - *Por quê:* hoje `sellItem` permite vender a prejuízo sem alerta — vira __política de negócio documentada__ (aceitar perda vs bloquear após aprovação).

- __Eliminar NPE latente em `recalculateItemMetrics`__ (`item.getBuyPrice().add(...)` assume `buyPrice != null`).
  - *Como:* validar nullability no contrato/entidade ou tratar com `valueOrZero`.

- __Envolver todo o fluxo de recálculo em uma transação/consistência clara__ — hoje `recalculateItemMetrics` é chamado dentro de transações escritas; ao escalar, desacoplar via __evento/fila__ (mas décidse com cuidado por causa da consistência do summary).

---

## 🔐 Segurança & AppSec

- __Rate limiting no `/auth/login`__ (antibrute-force).
  - *Como:* bucket/Redis (ex.: N tentativas/min por IP+username).

- __Rotação/segredo JWT seguro sem default hardcoded.__

  - *Por quê:* `api.jwt.secret` tem valor default em `application.properties`; se `PROD_JWT_SECRET` não setado, usa chave fraca.
  - *Como:* falhar no *startup* se o default for detectado em `prod`; usar variável de ambiente/secret manager + rotação.

- __Revogação/refresh de JWT (`jti`/blocklist).__

  - *Por quê:* token stateless não tem logout real; validade de 24h.
  - *Como:* `jti` no token + cache de revogados no Redis + refresh token.

- __Trocar `System.out.println` do `SecurityFilter` por SLF4J (`@Slf4j`)__ com níveis corretos.

- __Limpeza do cast `(User) auth.getPrincipal()`__ em `AuthService` — criar um `UserPrincipal` desacoplado da entidade JPA (mais seguro contra vazamento e acoplamento ao `UserDetails`/JPA).

- __Endpoints `/users/me` como padrão:__ prefira `me` no lugar de receber `id` no path (reduz superfície de IDOR), mantendo a checagem atual.

---

## 🧱 Arquitetura & Qualidade

- __Cobertura de testes (hoje quase zero).__

  - *Por quê:* só há o smoke test de contexto; lógica financeira (N+1, `BigDecimal`, regras de venda) está sem teste.
  - *Como:* unit (services/BalanceService) + integração com __Testcontainers__ (PostgreSQL real, não H2) + testes de segurança/IDOR.

- __Mover validação de posse para dentro da query/repository (defense-in-depth).__
  - *Ex.:* já existe `findByIdAndUserId`; padronizar todas as buscas escopadas por dono em vez de carregar e comparar em memória.

- __`@ControllerAdvice` cobrindo `401`/validação (`MethodArgumentNotValidException`) e `DatabaseException`__ — hoje mapeia `400/404/422`, mas faltam `401` e contract validation com payload padronizado.

- __Observabilidade real:__ logs estruturados + métricas (Micrometer) + tracing; hoje só log.

- __API versionamento / documentação OpenAPI já existente (springdoc)__ — manter e adicionar testes de contrato.

---

## 🧪 Infra & Operação (Escala / Produção)

- __Mover credenciais default (`docker-compose.yaml`) e segredos para variáveis/secret manager.__
  - `POSTGRES_USER/PASSWORD` default fracos e `version: '3.8'` obsoleto.
- __Migrações de schema versionadas (Flyway/Liquibase)__ — em `prod` usa `ddl-auto=validate`, mas não há controle de evolução do schema.
- __Limites/validações de payload e tamanho de listas__ (evitar payloads gigantes nos endpoints de listagem).
- __Processamento assíncrono/fila para recálculo de métricas e notificações__ (Spring Events/Outbox → Kafka/SQS), mantendo a escrita principal de baixa latência.
- __Health checks, readiness/liveness e profiles__ já existem — evoluir para health customizados do banco/Redis.

---

### 🗣️ Como fechar essa sessão do "próximos passos" na entrevista

> __Frase-resumo:__ *"Os próximos passos são três frentes: (1) __performance__ — empurrar a agregação para o banco e cachear o summary no Redis, com paginação; (2) __confiabilidade fintech__ — idempotência (`Idempotency-Key`) em escritas financeiras e fonte única de verdade para lucro/margem; (3) __governança__ — testes com Testcontainers, segredo JWT sem default, rate limiting no login e migrações com Flyway. E, como pilar transversal, tratar a agregação do `calculateBalanceByUserId` (que já existe) e o N+1 que já corrigi com `@EntityGraph`."*
