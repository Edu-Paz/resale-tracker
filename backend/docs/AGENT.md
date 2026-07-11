# AGENT.md — financial-api

Este documento é a referência de **arquitetura, convenções e restrições de escopo** do projeto para agentes de IA (Gemini Code Assist, Claude Code, etc.). Ele não descreve o que já foi implementado — os agentes devem inspecionar os arquivos locais do projeto para isso. Este arquivo define **como o código deve ser escrito**, não **o que já existe**.

---

## 1. Visão Geral

`financial-api` é o backend de um sistema de controle financeiro para revendedores de itens usados. Permite registrar compras (itens), organizá-las em categorias, registrar vendas e calcular lucro/margem automaticamente.

---

## 2. Stack Tecnológica

- **Linguagem:** Java 21
- **Framework:** Spring Boot 4.1.0 (usa `jakarta.persistence`)
- **Build:** Maven
- **Spring Web** — endpoints REST
- **Spring Data JPA** — acesso a dados via repositórios
- **Spring Security** — presente no `pom.xml`, uso restrito conforme regras de escopo (seção 6)
- **Spring Validation** — validação de DTOs de entrada
- **Lombok** — reduz boilerplate (getters/setters/construtores)
- **Banco de dados:**
  - **H2 (em memória)** — ambiente de desenvolvimento/testes. `ddl-auto=create-drop`, schema recriado a cada start.
  - **PostgreSQL** — dependência de runtime, banco de produção.
  - **H2 Console** disponível em `http://localhost:8080/h2-console`.

---

## 3. Arquitetura

Camadas clássicas do Spring, nesta ordem de dependência:

```
Controller → Service → Repository → JPA (Hibernate) → Banco de Dados
```

- **Controller**: recebe requisições HTTP, delega ao Service. Não deve conter lógica de negócio.
- **Service**: contém toda a lógica de negócio e regras de validação.
- **Repository**: interfaces Spring Data JPA, sem lógica de negócio.
- **Entity**: modela as tabelas do banco.
- **DTO**: usado para entrada/saída da API, nunca expõe a entidade diretamente (ex: senha nunca sai em um DTO de resposta).

**Regra fixa:** todo novo recurso (Category, Item, ou qualquer entidade futura) deve seguir exatamente este mesmo padrão de camadas — Controller enxuto, lógica de negócio no Service, DTOs de entrada e saída dedicados. Não desviar desse padrão sem indicação explícita.

---

## 4. Modelo de Domínio

### 4.1 `User`

Tabela: `tb_user`

| Atributo | Tipo | Observação |
|---|---|---|
| `id` | `Long` | PK, auto-gerado |
| `username` | `String` | — |
| `password` | `String` | Armazenada criptografada (BCrypt) |
| `balance` | `BigDecimal` | Saldo financeiro do usuário |

**Relacionamentos:**
- `OneToMany` com `Category` — `CascadeType.ALL`, `orphanRemoval = true` (ao deletar o usuário, suas categorias são removidas em cascata).

### 4.2 `Category`

Tabela: `tb_category`

| Atributo | Tipo | Observação |
|---|---|---|
| `id` | `Long` | PK, auto-gerado |
| `name` | `String` | Nome da categoria (ex: "Sneakers", "Eletrônicos") |

**Relacionamentos:**
- `ManyToOne` com `User` — toda categoria pertence a um usuário.
- `OneToMany` com `Item` — uma categoria pode conter vários itens.

### 4.3 `Item`

Tabela: `tb_item`

| Atributo | Tipo | Observação |
|---|---|---|
| `id` | `Long` | PK, auto-gerado |
| `name` | `String` | Nome do item |
| `imgUrl` | `String` | URL da imagem do item |
| `buyPrice` | `BigDecimal` | Preço de compra |
| `sellPrice` | `BigDecimal` | Preço de venda |
| `buyDate` | `LocalDate` | Data da compra |
| `sellDate` | `LocalDate` | Data da venda |
| `status` | `ItemStatus` (enum) | `AVAILABLE` ou `SOLD` |
| `profit` | `BigDecimal` | Lucro obtido com a venda |
| `margin` | `BigDecimal` | Margem de lucro percentual |

**Relacionamentos:**
- `ManyToOne` com `Category` — `optional = false` (todo item pertence obrigatoriamente a uma categoria).

> ⚠️ **Nomenclatura fixa e intencional** — usar exatamente estes nomes, não sinônimos: `imgUrl`, `buyPrice`, `sellPrice`, `buyDate`, `sellDate`, `margin`. **Nunca** usar `imageUrl`, `purchasePrice`, `salePrice`, `purchaseDate`, `saleDate` ou `profitMargin` — essas variações foram deliberadamente descartadas.

### 4.4 `ItemStatus`

```java
enum ItemStatus { AVAILABLE, SOLD }
```

---

## 5. Convenções de Nomenclatura e Padrões (rígidas)

- **DTOs de resposta nunca expõem `password`** ou qualquer dado sensível.
- **Status HTTP:**
  - `201 Created` com header `Location` para criação de recurso.
  - `204 No Content` para exclusão.
  - `200 OK` para busca/atualização.
- **Nomenclatura de campos:** inglês, `camelCase`, exatamente como definido na seção 4 — não traduzir nem renomear.
- **Nomenclatura de tabelas:** `tb_<nome_singular>` (`tb_user`, `tb_item`, `tb_category`).
- **Nomenclatura de DTOs:** padrão `<Entidade>DTO` para saída e `<Entidade>InsertDTO` para entrada de criação (ex: `UserDTO`, `UserInsertDTO`). Manter esse padrão para novas entidades (`CategoryDTO`, `CategoryInsertDTO`, `ItemDTO`, `ItemInsertDTO`).
- **Validação de entrada:** usar Bean Validation (`@NotNull`, `@NotBlank`, etc.) nos DTOs de request.
- **Regras de negócio:** sempre na camada Service, nunca no Controller.
- **Exceptions:** usar exceptions padrão do Jakarta/Spring (ex: `EntityNotFoundException`) até que um `@ControllerAdvice` global seja definido para toda a API. Não criar handlers de exceção isolados por entidade.

---

## 6. Regras de Escopo (restrições ativas)

Os itens abaixo estão **fora de escopo até indicação explícita do usuário**. Não implementar proativamente:

- Autenticação (Spring Security + JWT ou equivalente).
- Exception handler global (`@ControllerAdvice`) — o padrão de exceptions já está previsto na arquitetura, mas a implementação é posterior.
- Endpoint de edição/atualização de dados do usuário (ex: `PUT /users/{id}`).

Ao trabalhar em `Category` e `Item`, seguir o mesmo padrão arquitetural de CRUD (Controller → Service → Repository → DTOs de entrada/saída) descrito na seção 3, sem introduzir os itens acima.

---

## 7. Ambiente e Execução

- **Dev/teste:** H2 em memória, schema recriado a cada start (`ddl-auto=create-drop`). Console em `http://localhost:8080/h2-console`.
- **Produção:** PostgreSQL (dependência de runtime já presente no `pom.xml`).
- **Build/rodar:** comandos Maven padrão (`mvn spring-boot:run`, `mvn test`) — ajustar para `./mvnw` se o projeto usar wrapper.

---

## 8. Diretrizes Gerais para Agentes de IA

- Antes de criar qualquer classe, **verificar os arquivos locais do projeto** para confirmar se ela já existe — este documento não rastreia status de implementação.
- Replicar o padrão arquitetural e de nomenclatura já estabelecido para `User` ao criar `Category`, `Item` ou qualquer entidade futura.
- Não introduzir autenticação, exception handler global, nem endpoints fora do escopo definido na seção 6 sem solicitação explícita do usuário.
- Nunca renomear os campos definidos na seção 4 — a nomenclatura é intencional e fixa.
- Em caso de dúvida sobre um padrão não coberto aqui, seguir o estilo já presente no código-fonte em vez de introduzir uma convenção nova.
