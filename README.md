# Resale Tracker

Aplicação full-stack para gestão financeira de revendedores de itens usados. O
sistema permite cadastrar produtos, organizá-los por categorias, registrar vendas
e despesas adicionais e acompanhar saldo, lucro, prejuízo e margem.

O repositório contém uma API REST em Spring Boot e uma aplicação web SPA em
React/Vite. O frontend consome a API para autenticação e para todo o gerenciamento
de inventário e resultados financeiros.

## Funcionalidades

- Cadastro e login de usuários com autenticação JWT.
- Isolamento dos dados por usuário.
- CRUD de categorias.
- CRUD de itens com imagem opcional, preço e data de compra.
- Filtro de itens por categoria, status e nome.
- Registro de venda com cálculo de custo total, lucro/prejuízo e margem.
- CRUD de despesas adicionais vinculadas a um item.
- Dashboard com resumo financeiro calculado pelo backend.
- Validação de dados e regras de negócio com respostas de erro padronizadas.
- Console H2 para desenvolvimento local.

## Arquitetura

```text
+------------------------+       HTTP/JSON        +-------------------------+
| React 19 + Vite        |  -------------------->  | Spring Boot REST API    |
| frontend               |  <--------------------  | backend                 |
| localhost:5173         |                         | localhost:8080          |
+------------------------+                         +------------+------------+
                                                               |
                                                               v
                                                    +-------------------------+
                                                    | H2 (desenvolvimento)    |
                                                    | PostgreSQL (produção)   |
                                                    +-------------------------+
```

O frontend é uma SPA com roteamento baseado na History API, componentes
funcionais e React Hooks. A API usa arquitetura em camadas: controllers, DTOs,
services, repositories e entidades JPA. O backend é a fonte de verdade para
todos os valores financeiros; o frontend apenas exibe os valores retornados.

## Stack tecnológico

### Frontend

- React 19.2.8 e React DOM 19.2.8.
- Vite 8.2.0 e `@vitejs/plugin-react` 6.0.4.
- JavaScript/JSX com ES Modules.
- ESLint 10.8.0, `eslint-plugin-react-hooks` e
  `eslint-plugin-react-refresh`.
- CSS responsivo e fontes IBM Plex Serif, IBM Plex Sans e IBM Plex Mono.
- Estado local com React Hooks e sessão persistida em `localStorage`.

### Backend

- Java 25.
- Spring Boot 4.1.0, Spring Web, Spring Security e Spring Data JPA.
- Hibernate, Jakarta Validation e Lombok.
- JWT com JJWT 0.11.5 e senhas protegidas com BCrypt.
- H2 em memória para desenvolvimento e testes.
- Driver PostgreSQL disponível para configuração de produção.
- Maven Wrapper para build e execução.

## Pré-requisitos

- Git.
- Node.js 18 ou superior e npm 9 ou superior.
- JDK 25 ou superior.
- Maven não precisa ser instalado globalmente: use o Maven Wrapper incluído em
  `backend/`.
- PostgreSQL é opcional para desenvolvimento e necessário apenas se a aplicação
  for configurada para esse banco em produção.

Docker não é necessário para a configuração padrão.

## Instalação e execução

### 1. Clonar o repositório

```bash
git clone git@github.com:Edu-Paz/resale-tracker.git
cd resale-tracker
```

### 2. Iniciar o backend

Em um terminal:

```bash
cd backend
./mvnw spring-boot:run
```

No Windows:

```powershell
cd backend
mvnw.cmd spring-boot:run
```

A API ficará disponível em `http://localhost:8080`. A configuração padrão usa
H2 em memória; as tabelas e os dados de `src/main/resources/import.sql` são
recriados a cada inicialização.

### 3. Iniciar o frontend

Em outro terminal, a partir da raiz do repositório:

```bash
cd frontend
npm install
npm run dev
```

A aplicação ficará disponível normalmente em `http://localhost:5173`. Para o
fluxo completo, mantenha frontend e backend executando simultaneamente.

## Comandos disponíveis

Execute os comandos do frontend em `frontend/` e os do backend em `backend/`.

| Projeto | Comando | Descrição |
| --- | --- | --- |
| Frontend | `npm run dev` | Inicia o Vite com hot reload. |
| Frontend | `npm run build` | Gera o build de produção em `dist/`. |
| Frontend | `npm run preview` | Serve localmente o build gerado. |
| Frontend | `npm run lint` | Executa o ESLint. |
| Backend | `./mvnw spring-boot:run` | Inicia a API Spring Boot. |
| Backend | `./mvnw test` | Executa os testes. |
| Backend | `./mvnw clean package` | Testa, compila e gera o JAR. |
| Backend | `./mvnw clean install` | Gera e instala o artefato localmente. |

No Windows, substitua `./mvnw` por `mvnw.cmd`.

## Configuração

### Frontend

O cliente HTTP usa `http://localhost:8080` por padrão. Para apontar para outra
API, crie `frontend/.env`:

```dotenv
VITE_API_URL=http://localhost:8080
```

As rotas principais são:

| Rota | Acesso | Descrição |
| --- | --- | --- |
| `/` | Público | Landing page. |
| `/login` | Público | Login. |
| `/cadastro` | Público | Cadastro. |
| `/usuario` | Autenticado | Visão geral e métricas financeiras. |
| `/itens` | Autenticado | Lista, busca e filtros de itens. |
| `/itens/novo` | Autenticado | Cadastro de item. |
| `/categorias` | Autenticado | Gerenciamento de categorias. |

O token JWT é armazenado em `localStorage` na chave
`resale-tracker-token`. As requisições protegidas enviam
`Authorization: Bearer <token>`.

### Backend e H2

O arquivo de configuração é
`backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.sql.init.mode=always
spring.jpa.defer-datasource-initialization=true
api.jwt.expiration=86400000
```

O console H2 pode ser acessado em `http://localhost:8080/h2-console` usando:

| Campo | Valor |
| --- | --- |
| JDBC URL | `jdbc:h2:mem:testdb` |
| Driver | `org.h2.Driver` |
| Usuário | `sa` |
| Senha | em branco |

Os dados são temporários e desaparecem quando a aplicação é reiniciada.
O endpoint local usa HTTP, não HTTPS: utilize `http://localhost:8080`.

### PostgreSQL e JWT em produção

O driver PostgreSQL já está incluído no backend, mas a configuração de produção
deve ser fornecida pelo ambiente. Exemplo:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/resale_tracker
spring.datasource.driverClassName=org.postgresql.Driver
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
api.jwt.secret=uma-chave-longa-e-segura-fornecida-pelo-ambiente
api.jwt.expiration=86400000
```

Não versionar credenciais, chaves JWT ou arquivos `.env`. A chave presente na
configuração de desenvolvimento deve ser substituída antes de qualquer deploy.

O CORS está preparado para `http://localhost:3000`,
`http://localhost:4200` e `http://localhost:5173`. Para adicionar uma origem,
altere `backend/src/main/java/com/resaletracker/financialapi/config/WebConfig.java`.

## API REST

**Base URL:** `http://localhost:8080`

Exceto login e cadastro, todos os endpoints exigem:

```http
Authorization: Bearer <jwt>
```

### Autenticação e usuários

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `POST` | `/users/register` | Cria usuário (`username`, `password`, `passwordConfirmation`). |
| `POST` | `/auth/login` | Autentica e retorna um JWT. |
| `GET` | `/users/me` | Retorna o usuário autenticado e seu saldo. |
| `GET` | `/users/me/financial-summary` | Retorna o resumo financeiro completo. |
| `GET` | `/users/{id}` | Consulta o próprio usuário. |
| `DELETE` | `/users/{id}` | Exclui a própria conta. |

### Categorias

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `POST` | `/categories` | Cria uma categoria. |
| `GET` | `/categories` | Lista as categorias do usuário. |
| `PUT` | `/categories/{id}` | Atualiza uma categoria. |
| `DELETE` | `/categories/{id}` | Exclui uma categoria vazia. |

### Itens

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `POST` | `/items` | Cadastra um item. |
| `GET` | `/items` | Lista itens; aceita `?categoryId={id}`. |
| `GET` | `/items/category/{categoryId}` | Lista itens de uma categoria. |
| `GET` | `/items/{itemId}` | Consulta um item. |
| `PUT` | `/items/{itemId}` | Atualiza um item. |
| `PATCH` | `/items/{itemId}/sell` | Registra a venda de um item disponível. |
| `DELETE` | `/items/{itemId}` | Exclui um item não vendido. |

### Despesas

Cada despesa pertence a exatamente um item e não pode ser transferida para outro
item.

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `POST` | `/expense` | Cria uma despesa (`name`, `amount`, `itemId`). |
| `GET` | `/expense/{expenseId}` | Consulta uma despesa. |
| `GET` | `/expense/item/{itemId}` | Lista despesas de um item. |
| `PATCH` | `/expense/{expenseId}` | Atualiza nome e valor. |
| `DELETE` | `/expense/{expenseId}` | Exclui uma despesa. |

Respostas de validação e regras de negócio usam, conforme o caso, `400`,
`403`, `404` ou `422`. O backend aplica as verificações de propriedade em todas
as operações.

Para exemplos completos de requests, responses e DTOs, consulte
[frontend/API_REFERENCE.md](frontend/API_REFERENCE.md).

## Regras e cálculos financeiros

- Todo item começa com status `AVAILABLE`; uma venda altera o status para `SOLD`.
- O custo total é `buyPrice + despesas adicionais`.
- Lucro/prejuízo é `sellPrice - custo total`.
- Margem é `(lucro / sellPrice) * 100`.
- Saldo é `totalSales - totalPurchases - totalExpenses` e pode ser negativo.
- O valor em estoque soma compras e despesas dos itens disponíveis.
- O resumo informa investimento, compras, despesas, vendas, lucro, prejuízo,
  margem média e contagens de itens.
- Datas não podem ser futuras; a data de venda não pode ser anterior à compra.
- Preços e valores de despesas devem ser positivos.
- Categorias não podem ser duplicadas para o mesmo usuário e só podem ser
  excluídas quando não possuem itens.
- Itens vendidos não podem ser excluídos.
- Alterar despesas de um item vendido recalcula lucro, margem e resumo financeiro.
- O frontend não recalcula valores financeiros: sempre exibe os dados da API.

## Segurança

- JWT stateless com expiração padrão de 24 horas.
- Senhas armazenadas com BCrypt.
- Endpoints de login e registro são públicos; os demais exigem JWT.
- Usuários só acessam seus próprios usuários, categorias, itens e despesas.
- CORS configurado explicitamente para origens de desenvolvimento.
- H2 Console destinado somente ao desenvolvimento local.

## Estrutura do repositório

```text
resale-tracker/
├── backend/
│   ├── src/main/java/com/resaletracker/financialapi/
│   │   ├── config/          # Segurança, JWT e CORS
│   │   ├── controllers/     # Endpoints REST e exceções
│   │   ├── dtos/            # Contratos de entrada e saída
│   │   ├── entities/        # Entidades JPA
│   │   ├── repositories/    # Acesso a dados
│   │   └── services/        # Regras de negócio
│   ├── src/main/resources/  # application.properties e import.sql
│   ├── pom.xml
│   ├── mvnw
│   └── README.md
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── pages/           # Landing, autenticação e dashboard
│   │   ├── routes/          # Rotas da SPA
│   │   ├── services/        # API e sessão
│   │   └── styles/          # Estilos base, componentes e páginas
│   ├── package.json
│   ├── API_REFERENCE.md
│   └── README.md
└── README.md
```

## Verificação local

```bash
cd frontend
npm run lint
npm run build

cd ../backend
./mvnw test
./mvnw clean package
```

## Documentação adicional

- [README do frontend](frontend/README.md)
- [README do backend](backend/README.md)
- [Referência da API](frontend/API_REFERENCE.md)
- [Design system do frontend](frontend/DESIGN.md)

## Licença

Este projeto faz parte do sistema Resale Tracker.
