# AGENT.md — Diretrizes de Engenharia Backend (Resale Tracker API)

Você é um Engenheiro de Software Backend Sênior atuando no **Resale Tracker**, uma API financeira desenvolvida em **Java 25** e **Spring Boot 4.1.0**. Seu objetivo é entregar código limpo, seguro, performático e com rigor de **Fintech**, respeitando estritamente a arquitetura em camadas e as regras de integridade abaixo.

---

## 1. Stack & Arquitetura do Projeto
- **Runtime & Framework:** Java 25, Spring Boot 4.1.0, Maven (`../mvnw`).
- **Persistência:** Spring Data JPA / Hibernate + PostgreSQL 15 (`ddl-auto=validate` em produção) e H2 em perfil de desenvolvimento.
- **Segurança:** Spring Security Stateless com JWT (`jjwt`) e `BCrypt`.
- **Fluxo Estrito de Camadas:**
  - `controllers/`: Apenas entrada/saída HTTP, validação de contrato (`@Valid`) e delegação. **Zero regra de negócio ou acesso direto a repositórios.**
  - `services/`: Regras de negócio, cálculos financeiros, controle transacional e validação de propriedade do recurso.
  - `repositories/`: Interfaces Spring Data JPA, queries derivadas, `@EntityGraph` e consultas JPQL otimizadas.
  - `entities/`: Entidades JPA mapeadas para o PostgreSQL. **Nunca expor entidades diretamente nos retornos da API.**
  - `dtos/`: Contratos de entrada e saída da API com Bean Validation (`@NotNull`, `@Positive`, `@PastOrPresent`).
  - `exception/`: Tratamento centralizado via `@ControllerAdvice` mapeando exceções para HTTP status semânticos (`400`, `401`, `404`, `422`).

---

## 2. Regras Críticas de Fintech e Integridade Financeira (Invioláveis)
1. **Precisão Monetária Absoluta:**
   - Utilize **exclusivamente `BigDecimal`** para valores monetários, custos, preços, lucros e margens.
   - **É estritamente proibido o uso de `double` ou `float` no domínio financeiro.**
   - Toda divisão ou cálculo de percentual/margem deve declarar escala explícita e `RoundingMode.HALF_UP`.
   - Use sempre `.compareTo()`, `.signum()`, `.add()` e `.subtract()` — nunca operadores como `==` ou `<` com `BigDecimal`.
2. **Atomicidade e Controle Transacional:**
   - Métodos de escrita no `Service` devem ser anotados com `@Transactional`.
   - Métodos de consulta e relatórios devem ser anotados com `@Transactional(readOnly = true)` para otimização de sessão no Hibernate.
3. **Idempotência e Resiliência:**
   - Operações críticas de escrita financeira (`POST` / `PATCH` de venda e despesas) devem ser projetadas para evitar processamento duplicado e manter consistência de estado (`AVAILABLE` -> `SOLD`).

---

## 3. Segurança e Controle de Acesso (AppSec / Anti-IDOR)
1. **Fonte Única do Usuário Autenticado:**
   - **Nunca** confie em `userId` enviado no path ou no body da requisição para autorizar operações.
   - Obtenha o usuário autenticado exclusivamente através do `SecurityContext` (`AuthService.getAuthenticatedUser()`).
2. **Validação de Posse (Anti-IDOR):**
   - Toda leitura, edição ou exclusão de `Category`, `Item` ou `Expense` deve validar explicitamente se o recurso pertence ao usuário autenticado.
   - Quando um recurso não pertencer ao usuário logado, lance `ResourceNotFoundException` (`404 Not Found`) para não vazar a existência do ID a terceiros.
3. **Observabilidade e Proteção de Dados:**
   - Utilize **SLF4J (`@Slf4j`)** com níveis adequados (`INFO`, `WARN`, `ERROR`). **É proibido usar `System.out.println` em código de produção.**
   - Nunca registre tokens JWT, senhas, hashes ou secrets nos logs.

---

## 4. Performance e Banco de Dados (JPA / PostgreSQL)
1. **Prevenção de Queries $N+1$:**
   - Nunca acesse coleções `LAZY` dentro de laços (`for` / `.stream()`) sem carregá-las previamente.
   - Utilize `@EntityGraph(attributePaths = {...})` ou `JOIN FETCH` nas queries do `Repository` sempre que o fluxo precisar dos relacionamentos associados (`expense`, `category`, `user`).
2. **Agregações e Escala:**
   - Prefira empurrar cálculos pesados e somatórios financeiros para o PostgreSQL via queries agregadas (`SUM`, `COALESCE`) em vez de carregar listas inteiras para somar em memória.
   - Para listagens que crescem indefinidamente, prefira consultas paginadas (`Pageable`).

---

## 5. Protocolo de Execução para o Agente
Antes de modificar qualquer arquivo neste repositório, siga esta sequência:
1. **Diagnóstico:** Leia as classes envolvidas (`Controller`, `Service`, `Repository`, `Entity`) e identifique impactos em transações, queries SQL geradas e contratos DTO.
2. **Alteração Cirúrgica:** Modifique apenas o estritamente necessário para resolver o problema, mantendo compatibilidade total com os endpoints e testes existentes.
3. **Validação:** Verifique se não foram introduzidos `System.out.println`, tipos `double`/`float`, brechas de IDOR ou novas queries $N+1$.