# Financial API - Resale Tracker Backend

## Visão Geral

A Financial API é uma aplicação RESTful desenvolvida com Spring Boot para gerenciamento de revenda de produtos. O sistema permite que usuários cadastrem itens, organizem-nos em categorias, registrem compras e vendas, e acompanhem métricas financeiras como lucro e margem de lucro. A aplicação foi projetada seguindo princípios de arquitetura limpa, com separação clara de responsabilidades entre camadas.

## Stack Tecnológico

### Linguagem e Framework
- **Java 25** - Linguagem de programação principal
- **Spring Boot 4.1.0** - Framework principal para construção da aplicação
- **Maven** - Gerenciador de dependências e build

### Persistência de Dados
- **Spring Data JPA** - ORM para mapeamento objeto-relacional
- **Hibernate** - Implementação JPA para gerenciamento de entidades
- **H2 Database** - Banco de dados em memória para desenvolvimento e testes
- **PostgreSQL** - Banco de dados relacional para produção (configurável)

### Segurança e Autenticação
- **Spring Security 6.x** - Framework de segurança
- **JWT (JSON Web Tokens)** - Autenticação stateless via tokens
- **JJWT 0.11.5** - Biblioteca para geração e validação de tokens JWT
- **BCrypt** - Algoritmo de hash para senhas

### Validação e Utilitários
- **Jakarta Validation** - Validação de dados de entrada
- **Lombok** - Redução de código boilerplate através de anotações

### Testes
- **Spring Boot Test** - Framework de testes para Spring Boot
- **Spring Data JPA Test** - Testes de repositórios JPA
- **Spring Validation Test** - Testes de validação
- **Spring Web MVC Test** - Testes de controllers

## Arquitetura da Aplicação

### Padrão Arquitetural

A aplicação segue uma arquitetura em camadas (Layered Architecture), com separação clara de responsabilidades:

1. **Camada de Controllers (Presentation Layer)**
   - Responsável por receber requisições HTTP
   - Validação de entrada via DTOs
   - Retorno de respostas HTTP apropriadas
   - Delegação de lógica para a camada de serviços

2. **Camada de Serviços (Business Logic Layer)**
   - Implementação de regras de negócio
   - Orquestração de operações entre entidades
   - Validações de integridade de dados
   - Cálculos financeiros (lucro, margem)
   - Gerenciamento de transações

3. **Camada de Repositórios (Data Access Layer)**
   - Abstração do acesso a dados via Spring Data JPA
   - Consultas customizadas através de métodos derivados
   - Interface entre aplicação e banco de dados

4. **Camada de Entidades (Domain Layer)**
   - Representação do modelo de domínio
   - Mapeamento ORM com JPA/Hibernate
   - Relacionamentos entre entidades

5. **Camada de DTOs (Data Transfer Objects)**
   - Transferência de dados entre camadas
   - Isolamento do modelo de domínio da API
   - Validação de dados de entrada

### Estrutura de Pacotes

```
com.resaletracker.financialapi/
├── config/                    # Configurações da aplicação
│   ├── SecurityConfig.java    # Configuração do Spring Security
│   ├── SecurityFilter.java    # Filtro JWT para autenticação
│   └── WebConfig.java         # Configuração CORS
├── controllers/               # Controladores REST
│   ├── AuthenticationController.java
│   ├── CategoryController.java
│   ├── ItemController.java
│   ├── UserController.java
│   └── exceptions/           # Tratamento global de exceções
│       ├── ResourceExceptionHandler.java
│       └── StandardError.java
├── dtos/                      # Data Transfer Objects
│   ├── CategoryDTO.java
│   ├── CategoryInsertDTO.java
│   ├── ItemDTO.java
│   ├── ItemInsertDTO.java
│   ├── ItemSellDTO.java
│   ├── ItemUpdateDTO.java
│   ├── LoginRequestDTO.java
│   ├── LoginResponseDTO.java
│   ├── UserDTO.java
│   └── UserRegisterDTO.java
├── entities/                  # Entidades JPA
│   ├── Category.java
│   ├── Item.java
│   ├── ItemStatus.java       # Enum
│   └── User.java
├── repositories/              # Repositórios Spring Data JPA
│   ├── CategoryRepository.java
│   ├── ItemRepository.java
│   └── UserRepository.java
├── services/                  # Serviços de negócio
│   ├── AuthService.java
│   ├── CategoryService.java
│   ├── CustomUserDetailsService.java
│   ├── ItemService.java
│   ├── TokenService.java
│   ├── UserService.java
│   └── exceptions/           # Exceções customizadas
│       ├── BusinessException.java
│       ├── DatabaseException.java
│       └── ResourceNotFoundException.java
└── FinancialApiApplication.java  # Classe principal
```

## Funcionalidades

### Autenticação e Autorização
- Registro de novos usuários com validação de senha
- Autenticação via username e senha
- Geração de tokens JWT para sessões stateless
- Validação de tokens em cada requisição
- Controle de acesso baseado em roles (ROLE_USER)
- Proteção de endpoints sensíveis

### Gerenciamento de Usuários
- Cadastro de usuários com validação de dados
- Visualização de perfil próprio
- Consulta de saldo
- Exclusão de conta própria
- Isolamento de dados entre usuários

### Gerenciamento de Categorias
- Criação de categorias personalizadas
- Listagem de categorias por usuário
- Atualização de nome de categoria
- Exclusão de categorias (apenas se vazias)
- Validação de duplicidade de nomes por usuário

### Gerenciamento de Itens
- Cadastro de itens com informações de compra
- Associação de itens a categorias
- Listagem de itens com filtro por categoria
- Atualização de informações de itens
- Exclusão de itens (apenas se não vendidos)
- Registro de venda de itens
- Cálculo automático de lucro e margem

### Cálculos Financeiros
- **Lucro**: Calculado como `preçoVenda - preçoCompra`
- **Margem**: Calculada como `(lucro / preçoCompra) * 100`
- Arredondamento para 4 casas decimais
- Atualização automática ao marcar item como vendido

### Validação e Tratamento de Erros
- Validação de dados de entrada com Jakarta Validation
- Tratamento global de exceções
- Respostas de erro padronizadas
- Validação de regras de negócio
- Proteção contra violações de integridade referencial

### Desenvolvimento
- Console H2 para visualização do banco de dados
- Logs detalhados de operações
- Configuração CORS para integração com frontend
- SQL formatado para debug

## Instalação e Configuração

### Pré-requisitos

- **Java 25** ou superior
- **Maven 3.6+**
- **PostgreSQL** (para produção, opcional para desenvolvimento)
- **Git** (para clonar o repositório)

### Configuração do Ambiente

#### 1. Clonar o Repositório
```bash
git clone git@github.com:Edu-Paz/resale-tracker.git
cd backend
```

#### 2. Configurar o Banco de Dados

**Para Desenvolvimento (H2 - Configuração Padrão):**
O projeto já está configurado para usar H2 em memória. Não é necessária configuração adicional.

**Para Produção (PostgreSQL):**
Edite o arquivo `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/financial_api
spring.datasource.driverClassName=org.postgresql.Driver
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
```

#### 3. Configurar JWT
No arquivo `application.properties`, configure a chave secreta segura:
```properties
api.jwt.secret=sua-chave-secreta-muito-longa-e-segura-aqui
api.jwt.expiration=86400000
```

#### 4. Compilar o Projeto
```bash
./mvnw clean install
```

#### 5. Executar a Aplicação
```bash
./mvnw spring-boot:run
```

A API estará disponível em `http://localhost:8080`

### Configuração CORS

O projeto está configurado para aceitar requisições dos seguintes origins (configurado em `WebConfig.java`):
- `http://localhost:3000`
- `http://localhost:4200`
- `http://localhost:5173`

Para adicionar novos origins, edite a classe `WebConfig.java`.

## Configuração da Aplicação

### application.properties

O arquivo de configuração principal está localizado em `src/main/resources/application.properties`:

```properties
# Nome da Aplicação
spring.application.name=financial-api

# Configuração do Banco de Dados H2 (Desenvolvimento)
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# Configuração do Console H2
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
spring.h2.console.settings.trace=false
spring.h2.console.settings.web-allow-others=true

# Configuração JPA/Hibernate
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.properties.hibernate.format_sql=true

# Inicialização SQL
spring.sql.init.mode=always
spring.jpa.defer-datasource-initialization=true

# Configuração JWT
api.jwt.secret=thisisalongandsecuresecretkeyforjwttokengeneration
api.jwt.expiration=86400000
```

### Explicação das Propriedades

- **spring.application.name**: Nome identificador da aplicação
- **spring.datasource.url**: URL de conexão com o banco de dados
- **spring.datasource.driverClassName**: Driver JDBC do banco de dados
- **spring.h2.console.enabled**: Habilita console web do H2 para debug
- **spring.h2.console.path**: Caminho de acesso ao console H2
- **spring.jpa.hibernate.ddl-auto**: Estratégia de geração de schema (create-drop recria tabelas a cada reinício)
- **spring.jpa.show-sql**: Exibe SQL gerado no console
- **spring.jpa.format_sql**: Formata SQL para melhor leitura
- **spring.sql.init.mode**: Modo de execução de scripts SQL
- **api.jwt.secret**: Chave secreta para assinatura de tokens JWT
- **api.jwt.expiration**: Tempo de expiração do token em milissegundos (86400000 = 24 horas)

## Autenticação e Segurança

### Mecanismo de Autenticação

A API utiliza JWT (JSON Web Token) para autenticação stateless. Todos os endpoints, exceto `/auth/login` e `/users/register`, requerem um token JWT válido no header `Authorization`:

```
Authorization: Bearer <seu-token-jwt>
```

### Fluxo de Autenticação

1. **Registro**: O usuário cria uma conta fornecendo username e senha
2. **Login**: O usuário autentica com username/password para receber um token JWT
3. **Acesso a Endpoints Protegidos**: O cliente inclui o token JWT no header Authorization em cada requisição
4. **Validação**: O filtro `SecurityFilter` valida o token em cada requisição protegida

### Implementação JWT

**TokenService** (`TokenService.java`):
- Gera tokens JWT com assinatura HMAC SHA
- Configuração de expiração (24 horas por padrão)
- Validação de tokens
- Extração de username do token

**SecurityFilter** (`SecurityFilter.java`):
- Intercepta todas as requisições
- Extrai token do header Authorization
- Valida token usando TokenService
- Carrega usuário do banco de dados
- Define autenticação no SecurityContext

**SecurityConfig** (`SecurityConfig.java`):
- Configura cadeia de filtros do Spring Security
- Define endpoints públicos (login, register)
- Configura autenticação stateless
- Configura provider de autenticação com BCrypt
- Desabilita CSRF (não necessário para API REST)

### Detalhes de Segurança

- **Hash de Senhas**: Senhas são hasheadas usando BCrypt antes de persistir no banco
- **Validação de Token**: Tokens são validados a cada requisição protegida
- **Isolamento de Dados**: Usuários só podem acessar seus próprios dados (categorias, itens)
- **Role-Based Access**: Todos os usuários autenticados possuem role `ROLE_USER`
- **CORS**: Configurado para permitir requisições de origins específicos

## Endpoints da API

### Autenticação

#### Registrar Usuário
**Endpoint**: `POST /users/register`
**Descrição**: Cria uma nova conta de usuário
**Autenticação**: Não requer

**Request Body**:
```json
{
  "username": "joao_silva",
  "password": "senha123",
  "passwordConfirmation": "senha123"
}
```

**Validações**:
- `username`: Obrigatório, entre 3 e 20 caracteres, único
- `password`: Obrigatório, mínimo 6 caracteres
- `passwordConfirmation`: Obrigatório, deve ser igual a `password`

**Response**: `201 Created`
```json
{
  "id": 1,
  "username": "joao_silva",
  "balance": 0.00
}
```

**Erros**:
- `400 Bad Request`: Validação falhou
- `422 Unprocessable Entity`: Senhas não conferem ou username já existe

#### Login
**Endpoint**: `POST /auth/login`
**Descrição**: Autentica usuário e retorna token JWT
**Autenticação**: Não requer

**Request Body**:
```json
{
  "username": "joao_silva",
  "password": "senha123"
}
```

**Response**: `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erros**:
- `403 Forbidden`: Credenciais inválidas

### Usuários

#### Obter Detalhes do Usuário Atual
**Endpoint**: `GET /users/me`
**Descrição**: Retorna informações do usuário autenticado
**Autenticação**: Requer token JWT

**Response**: `200 OK`
```json
{
  "id": 1,
  "username": "joao_silva",
  "balance": 1500.00
}
```

**Erros**:
- `403 Forbidden`: Usuário não autenticado

#### Obter Usuário por ID
**Endpoint**: `GET /users/{id}`
**Descrição**: Retorna informações de um usuário específico
**Autenticação**: Requer token JWT
**Restrição**: Usuários só podem visualizar seus próprios dados

**Response**: `200 OK`
```json
{
  "id": 1,
  "username": "joao_silva",
  "balance": 1500.00
}
```

**Erros**:
- `403 Forbidden`: Tentando acessar dados de outro usuário
- `404 Not Found`: Usuário não encontrado

#### Deletar Usuário
**Endpoint**: `DELETE /users/{id}`
**Descrição**: Remove a conta de um usuário
**Autenticação**: Requer token JWT
**Restrição**: Usuários só podem deletar sua própria conta

**Response**: `204 No Content`

**Erros**:
- `403 Forbidden`: Tentando deletar conta de outro usuário
- `404 Not Found`: Usuário não encontrado

### Categorias

#### Criar Categoria
**Endpoint**: `POST /categories`
**Descrição**: Cria uma nova categoria para o usuário autenticado
**Autenticação**: Requer token JWT

**Request Body**:
```json
{
  "name": "Eletrônicos"
}
```

**Validações**:
- `name`: Obrigatório, não pode estar em branco, único por usuário

**Response**: `201 Created`
```json
{
  "id": 1,
  "name": "Eletrônicos",
  "user": {
    "id": 1,
    "username": "joao_silva"
  }
}
```

**Erros**:
- `400 Bad Request`: Validação falhou
- `422 Unprocessable Entity`: Categoria com mesmo nome já existe para o usuário

#### Listar Todas as Categorias
**Endpoint**: `GET /categories`
**Descrição**: Retorna todas as categorias do usuário autenticado
**Autenticação**: Requer token JWT

**Response**: `200 OK`
```json
[
  {
    "id": 1,
    "name": "Eletrônicos",
    "user": {
      "id": 1,
      "username": "joao_silva"
    }
  },
  {
    "id": 2,
    "name": "Roupas",
    "user": {
      "id": 1,
      "username": "joao_silva"
    }
  }
]
```

#### Atualizar Categoria
**Endpoint**: `PUT /categories/{id}`
**Descrição**: Atualiza o nome de uma categoria
**Autenticação**: Requer token JWT
**Restrição**: Usuário só pode atualizar suas próprias categorias

**Request Body**:
```json
{
  "id": 1,
  "name": "Eletrônicos de Consumo"
}
```

**Response**: `200 OK`
```json
{
  "id": 1,
  "name": "Eletrônicos de Consumo",
  "user": {
    "id": 1,
    "username": "joao_silva"
  }
}
```

**Erros**:
- `404 Not Found`: Categoria não encontrada para o usuário
- `422 Unprocessable Entity`: Nome já existe para outra categoria do usuário

#### Deletar Categoria
**Endpoint**: `DELETE /categories/{id}`
**Descrição**: Remove uma categoria
**Autenticação**: Requer token JWT
**Restrição**: Categoria deve estar vazia (sem itens associados)

**Response**: `204 No Content`

**Erros**:
- `404 Not Found`: Categoria não encontrada para o usuário
- `422 Unprocessable Entity`: Categoria contém itens e não pode ser deletada

### Itens

#### Criar Item
**Endpoint**: `POST /items`
**Descrição**: Cadastra um novo item para revenda
**Autenticação**: Requer token JWT

**Request Body**:
```json
{
  "name": "iPhone 13",
  "imgUrl": "https://example.com/iphone13.jpg",
  "buyPrice": 500.00,
  "buyDate": "2024-01-15",
  "categoryId": 1
}
```

**Validações**:
- `name`: Obrigatório, não pode estar em branco
- `buyPrice`: Obrigatório, deve ser positivo
- `buyDate`: Obrigatório, não pode ser no futuro
- `categoryId`: Obrigatório, deve pertencer ao usuário
- `imgUrl`: Opcional

**Response**: `201 Created`
```json
{
  "id": 1,
  "name": "iPhone 13",
  "imgUrl": "https://example.com/iphone13.jpg",
  "buyPrice": 500.00,
  "sellPrice": null,
  "buyDate": "2024-01-15",
  "sellDate": null,
  "status": "AVAILABLE",
  "profit": null,
  "margin": null,
  "category": {
    "id": 1,
    "name": "Eletrônicos"
  }
}
```

**Erros**:
- `400 Bad Request`: Validação falhou
- `404 Not Found`: Categoria não encontrada para o usuário

#### Listar Todos os Itens
**Endpoint**: `GET /items`
**Descrição**: Retorna todos os itens do usuário autenticado
**Autenticação**: Requer token JWT
**Query Parameter**: `?categoryId={id}` (opcional) - Filtra itens por categoria

**Response**: `200 OK`
```json
[
  {
    "id": 1,
    "name": "iPhone 13",
    "imgUrl": "https://example.com/iphone13.jpg",
    "buyPrice": 500.00,
    "sellPrice": null,
    "buyDate": "2024-01-15",
    "sellDate": null,
    "status": "AVAILABLE",
    "profit": null,
    "margin": null,
    "category": {
      "id": 1,
      "name": "Eletrônicos"
    }
  }
]
```

#### Obter Item por ID
**Endpoint**: `GET /items/{itemId}`
**Descrição**: Retorna detalhes de um item específico
**Autenticação**: Requer token JWT
**Restrição**: Usuário só pode visualizar seus próprios itens

**Response**: `200 OK`
```json
{
  "id": 1,
  "name": "iPhone 13",
  "imgUrl": "https://example.com/iphone13.jpg",
  "buyPrice": 500.00,
  "sellPrice": null,
  "buyDate": "2024-01-15",
  "sellDate": null,
  "status": "AVAILABLE",
  "profit": null,
  "margin": null,
  "category": {
    "id": 1,
    "name": "Eletrônicos"
  }
}
```

**Erros**:
- `404 Not Found`: Item não encontrado para o usuário

#### Atualizar Item
**Endpoint**: `PUT /items/{itemId}`
**Descrição**: Atualiza informações de um item
**Autenticação**: Requer token JWT
**Restrição**: Usuário só pode atualizar seus próprios itens

**Request Body**:
```json
{
  "name": "iPhone 13 Pro",
  "imgUrl": "https://example.com/iphone13pro.jpg",
  "buyPrice": 550.00,
  "buyDate": "2024-01-15",
  "categoryId": 1
}
```

**Validações**:
- Todos os campos são opcionais na atualização
- Se fornecidos, seguem as mesmas validações da criação
- Se `status` for alterado para `AVAILABLE`, campos de venda são limpos

**Response**: `200 OK`
```json
{
  "id": 1,
  "name": "iPhone 13 Pro",
  "imgUrl": "https://example.com/iphone13pro.jpg",
  "buyPrice": 550.00,
  "sellPrice": null,
  "buyDate": "2024-01-15",
  "sellDate": null,
  "status": "AVAILABLE",
  "profit": null,
  "margin": null,
  "category": {
    "id": 1,
    "name": "Eletrônicos"
  }
}
```

**Erros**:
- `404 Not Found`: Item ou categoria não encontrada para o usuário
- `422 Unprocessable Entity`: Data de venda anterior à data de compra

#### Vender Item
**Endpoint**: `PATCH /items/{itemId}/sell`
**Descrição**: Registra a venda de um item e calcula métricas financeiras
**Autenticação**: Requer token JWT
**Restrição**: Item deve estar com status AVAILABLE

**Request Body**:
```json
{
  "sellPrice": 700.00,
  "sellDate": "2024-02-20"
}
```

**Validações**:
- `sellPrice`: Obrigatório, deve ser positivo
- `sellDate`: Obrigatório, não pode ser no futuro nem anterior à data de compra

**Response**: `200 OK`
```json
{
  "id": 1,
  "name": "iPhone 13",
  "imgUrl": "https://example.com/iphone13.jpg",
  "buyPrice": 500.00,
  "sellPrice": 700.00,
  "buyDate": "2024-01-15",
  "sellDate": "2024-02-20",
  "status": "SOLD",
  "profit": 200.00,
  "margin": 40.00,
  "category": {
    "id": 1,
    "name": "Eletrônicos"
  }
}
```

**Cálculos Realizados**:
- **Lucro**: `sellPrice - buyPrice` = 700.00 - 500.00 = 200.00
- **Margem**: `(profit / sellPrice) * 100` = (200.00 / 700.00) * 100 = 28.57%

**Erros**:
- `404 Not Found`: Item não encontrado para o usuário
- `422 Unprocessable Entity`: Item já vendido ou data de venda inválida

#### Deletar Item
**Endpoint**: `DELETE /items/{itemId}`
**Descrição**: Remove um item
**Autenticação**: Requer token JWT
**Restrição**: Item não pode ter sido vendido

**Response**: `204 No Content`

**Erros**:
- `404 Not Found`: Item não encontrado para o usuário
- `422 Unprocessable Entity`: Item já foi vendido e não pode ser deletado

## Modelo de Dados

### Entidade User (Usuário)

**Tabela**: `tb_user`

**Atributos**:
- `id`: Long (auto-generated, chave primária)
- `username`: String (único, 3-20 caracteres)
- `password`: String (hasheado com BCrypt)
- `balance`: BigDecimal (saldo do usuário)
- `categories`: Set<Category> (relacionamento one-to-many)

**Relacionamentos**:
- One-to-Many com Category (um usuário possui muitas categorias)
- Implementa UserDetails do Spring Security para autenticação

**Implementação**:
```java
@Entity
@Table(name = "tb_user")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String password;
    private BigDecimal balance;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Category> categories;
}
```

### Entidade Category (Categoria)

**Tabela**: `tb_category`

**Atributos**:
- `id`: Long (auto-generated, chave primária)
- `name`: String (nome da categoria)
- `user`: User (relacionamento many-to-one)
- `items`: List<Item> (relacionamento one-to-many)

**Relacionamentos**:
- Many-to-One com User (muitas categorias pertencem a um usuário)
- One-to-Many com Item (uma categoria possui muitos itens)

**Implementação**:
```java
@Entity
@Table(name = "tb_category")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @ManyToOne
    private User user;
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Item> items;
}
```

### Entidade Item (Item)

**Tabela**: `tb_item`

**Atributos**:
- `id`: Long (auto-generated, chave primária)
- `name`: String (nome do item)
- `imgUrl`: String (URL da imagem, opcional)
- `buyPrice`: BigDecimal (preço de compra)
- `sellPrice`: BigDecimal (preço de venda, nullable)
- `buyDate`: LocalDate (data de compra)
- `sellDate`: LocalDate (data de venda, nullable)
- `status`: ItemStatus (AVAILABLE ou SOLD)
- `profit`: BigDecimal (lucro calculado, nullable)
- `margin`: BigDecimal (margem calculada, nullable)
- `category`: Category (relacionamento many-to-one)

**Relacionamentos**:
- Many-to-One com Category (muitos itens pertencem a uma categoria)

**Implementação**:
```java
@Entity
@Table(name = "tb_item")
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String imgUrl;
    private BigDecimal buyPrice;
    private BigDecimal sellPrice;
    private LocalDate buyDate;
    private LocalDate sellDate;
    private ItemStatus status;
    private BigDecimal profit;
    private BigDecimal margin;

    @ManyToOne(optional = false)
    private Category category;
}
```

### Enum ItemStatus

**Valores**:
- `AVAILABLE`: Item está em estoque e disponível para venda
- `SOLD`: Item foi vendido

**Uso**: Controla o estado do item no ciclo de vida de revenda

## DTOs (Data Transfer Objects)

Os DTOs são utilizados para transferência de dados entre camadas, isolando o modelo de domínio da API e permitindo validação específica para cada operação.

### DTOs de Autenticação

#### LoginRequestDTO
**Uso**: Requisição de login
**Campos**:
- `username`: String
- `password`: String

#### LoginResponseDTO
**Uso**: Resposta de login com token
**Campos**:
- `token`: String (JWT token)

### DTOs de Usuário

#### UserRegisterDTO
**Uso**: Registro de novo usuário
**Campos**:
- `username`: String (@NotBlank, @Size min=3, max=20)
- `password`: String (@NotBlank, @Size min=6)
- `passwordConfirmation`: String (@NotBlank)

**Validações**:
- Username deve ter entre 3 e 20 caracteres
- Password deve ter no mínimo 6 caracteres
- Password e passwordConfirmation devem ser iguais

#### UserDTO
**Uso**: Resposta com dados do usuário
**Campos**:
- `id`: Long
- `username`: String
- `balance`: BigDecimal

### DTOs de Categoria

#### CategoryInsertDTO
**Uso**: Criação de nova categoria
**Campos**:
- `name`: String (@NotBlank)

#### CategoryDTO
**Uso**: Resposta com dados da categoria
**Campos**:
- `id`: Long
- `name`: String
- `user`: UserDTO

### DTOs de Item

#### ItemInsertDTO
**Uso**: Criação de novo item
**Campos**:
- `name`: String (@NotBlank)
- `imgUrl`: String (opcional)
- `buyPrice`: BigDecimal (@NotNull, @Positive)
- `buyDate`: LocalDate (@NotNull, @PastOrPresent)
- `categoryId`: Long (@NotNull)

**Validações**:
- Nome não pode estar em branco
- Preço de compra deve ser positivo
- Data de compra não pode ser no futuro
- Categoria deve existir e pertencer ao usuário

#### ItemUpdateDTO
**Uso**: Atualização de item existente
**Campos**:
- `name`: String (@NotBlank)
- `imgUrl`: String (opcional)
- `buyPrice`: BigDecimal (@Positive)
- `buyDate`: LocalDate (@PastOrPresent)
- `sellDate`: LocalDate (@PastOrPresent)
- `sellPrice`: BigDecimal (@Positive)
- `categoryId`: Long
- `status`: ItemStatus

**Validações**:
- Todos os campos são opcionais
- Se fornecidos, seguem as mesmas validações da criação

#### ItemSellDTO
**Uso**: Registro de venda de item
**Campos**:
- `sellPrice`: BigDecimal (@NotNull, @Positive)
- `sellDate`: LocalDate (@NotNull, @PastOrPresent)

**Validações**:
- Preço de venda deve ser positivo
- Data de venda não pode ser no futuro nem anterior à data de compra

#### ItemDTO
**Uso**: Resposta com dados completos do item
**Campos**:
- `id`: Long
- `name`: String
- `imgUrl`: String
- `buyPrice`: BigDecimal
- `sellPrice`: BigDecimal
- `buyDate`: LocalDate
- `sellDate`: LocalDate
- `status`: ItemStatus
- `profit`: BigDecimal (calculado)
- `margin`: BigDecimal (calculado)
- `category`: CategoryDTO

## Repositórios (Data Access Layer)

Os repositórios são interfaces que estendem `JpaRepository`, fornecendo métodos para acesso a dados através do Spring Data JPA.

### UserRepository
**Localização**: `repositories/UserRepository.java`

**Métodos Customizados**:
- `existsByUsername(String username)`: Verifica se username já existe
- `findByUsername(String username)`: Busca usuário por username (retorna UserDetails para autenticação)

**Métodos Herdados**: save, findById, findAll, deleteById, etc.

### CategoryRepository
**Localização**: `repositories/CategoryRepository.java`

**Métodos Customizados**:
- `findByIdAndUserId(Long id, Long userId)`: Busca categoria por ID e usuário (garante isolamento de dados)
- `findAllByUserId(Long userId)`: Lista todas as categorias de um usuário
- `existsByNameAndUserId(String name, Long userId)`: Verifica se categoria com mesmo nome existe para o usuário
- `deleteByIdAndUserId(Long id, Long userId)`: Deleta categoria por ID e usuário

**Métodos Herdados**: save, findById, findAll, deleteById, etc.

### ItemRepository
**Localização**: `repositories/ItemRepository.java`

**Métodos Customizados**:
- `findAllByCategory_UserId(Long userId)`: Lista todos os itens de um usuário (navegação através de Category)
- `findAllByCategory_UserIdAndCategoryId(Long userId, Long categoryId)`: Lista itens de um usuário filtrados por categoria

**Métodos Herdados**: save, findById, findAll, deleteById, etc.

**Observação**: Os métodos utilizam navegação de propriedades do JPA (`Category_UserId`) para realizar consultas eficientes através de relacionamentos.

## Tratamento de Exceções

A API utiliza tratamento global de exceções através da anotação `@ControllerAdvice`, fornecendo respostas de erro padronizadas para todos os endpoints.

### ResourceExceptionHandler
**Localização**: `controllers/exceptions/ResourceExceptionHandler.java`

**Exceções Tratadas**:

#### ResourceNotFoundException
**Status HTTP**: 404 Not Found
**Descrição**: Recurso não encontrado (usuário, categoria, item)
**Exemplo de Uso**: Quando um usuário tenta acessar um item que não existe ou não pertence a ele

**Response**:
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 404,
  "error": "Resource not found",
  "message": "Item not found with id: 123 for this user",
  "path": "/items/123"
}
```

#### BusinessException
**Status HTTP**: 422 Unprocessable Entity
**Descrição**: Violação de regra de negócio
**Exemplos de Uso**:
- Tentar vender um item já vendido
- Tentar deletar categoria com itens
- Tentar deletar item já vendido
- Data de venda anterior à data de compra
- Senhas não conferem no registro
- Username já existe

**Response**:
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 422,
  "error": "Business rule violation",
  "message": "Item with id 123 has already been sold.",
  "path": "/items/123/sell"
}
```

#### DataIntegrityViolationException
**Status HTTP**: 400 Bad Request
**Descrição**: Violação de integridade do banco de dados
**Exemplo de Uso**: Tentar deletar recurso com dependências (viol FK)

**Response**:
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Database integrity violation",
  "message": "could not execute statement",
  "path": "/categories/1"
}
```

### Exceções Customizadas

#### BusinessException
**Localização**: `services/exceptions/BusinessException.java`
**Uso**: Lançada quando uma regra de negócio é violada

#### ResourceNotFoundException
**Localização**: `services/exceptions/ResourceNotFoundException.java`
**Uso**: Lançada quando um recurso solicitado não existe

#### DatabaseException
**Localização**: `services/exceptions/DatabaseException.java`
**Uso**: Lançada para erros específicos de banco de dados

### Códigos de Status HTTP Comuns

- `200 OK`: Requisição bem-sucedida
- `201 Created`: Recurso criado com sucesso
- `204 No Content`: Requisição bem-sucedida sem conteúdo (geralmente deleção)
- `400 Bad Request`: Erro de validação ou requisição inválida
- `403 Forbidden`: Falha de autenticação ou acesso negado
- `404 Not Found`: Recurso não encontrado
- `422 Unprocessable Entity`: Violação de regra de negócio
- `500 Internal Server Error`: Erro interno do servidor

## Desenvolvimento

### Console H2

Acesso ao console do banco de dados H2 para visualização e manipulação direta dos dados durante o desenvolvimento:

**URL**: `http://localhost:8080/h2-console`

**Detalhes de Conexão**:
- **JDBC URL**: `jdbc:h2:mem:testdb`
- **Driver Class**: `org.h2.Driver`
- **Username**: `sa`
- **Password**: (deixar em branco)

**Funcionalidades**:
- Visualização de tabelas e dados
- Execução de queries SQL
- Monitoramento de conexões
- Análise de schema

### Executar Testes

```bash
./mvnw test
```

O projeto inclui dependências de teste para:
- Spring Boot Test
- Spring Data JPA Test
- Spring Validation Test
- Spring Web MVC Test

### Build para Produção

```bash
./mvnw clean package
```

O arquivo JAR será criado em `target/financial-api-0.0.1-SNAPSHOT.jar`

Para executar o JAR:
```bash
java -jar target/financial-api-0.0.1-SNAPSHOT.jar
```

### Estrutura do Projeto

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/resaletracker/financialapi/
│   │   │   ├── config/                    # Configurações da aplicação
│   │   │   │   ├── SecurityConfig.java    # Configuração Spring Security
│   │   │   │   ├── SecurityFilter.java    # Filtro JWT
│   │   │   │   └── WebConfig.java         # Configuração CORS
│   │   │   ├── controllers/               # Controladores REST
│   │   │   │   ├── AuthenticationController.java
│   │   │   │   ├── CategoryController.java
│   │   │   │   ├── ItemController.java
│   │   │   │   ├── UserController.java
│   │   │   │   └── exceptions/           # Tratamento de exceções
│   │   │   │       ├── ResourceExceptionHandler.java
│   │   │   │       └── StandardError.java
│   │   │   ├── dtos/                      # Data Transfer Objects
│   │   │   │   ├── CategoryDTO.java
│   │   │   │   ├── CategoryInsertDTO.java
│   │   │   │   ├── ItemDTO.java
│   │   │   │   ├── ItemInsertDTO.java
│   │   │   │   ├── ItemSellDTO.java
│   │   │   │   ├── ItemUpdateDTO.java
│   │   │   │   ├── LoginRequestDTO.java
│   │   │   │   ├── LoginResponseDTO.java
│   │   │   │   ├── UserDTO.java
│   │   │   │   └── UserRegisterDTO.java
│   │   │   ├── entities/                  # Entidades JPA
│   │   │   │   ├── Category.java
│   │   │   │   ├── Item.java
│   │   │   │   ├── ItemStatus.java
│   │   │   │   └── User.java
│   │   │   ├── repositories/              # Repositórios Spring Data JPA
│   │   │   │   ├── CategoryRepository.java
│   │   │   │   ├── ItemRepository.java
│   │   │   │   └── UserRepository.java
│   │   │   ├── services/                  # Serviços de negócio
│   │   │   │   ├── AuthService.java
│   │   │   │   ├── CategoryService.java
│   │   │   │   ├── CustomUserDetailsService.java
│   │   │   │   ├── ItemService.java
│   │   │   │   ├── TokenService.java
│   │   │   │   ├── UserService.java
│   │   │   │   └── exceptions/           # Exceções customizadas
│   │   │   │       ├── BusinessException.java
│   │   │   │       ├── DatabaseException.java
│   │   │   │       └── ResourceNotFoundException.java
│   │   │   └── FinancialApiApplication.java  # Classe principal
│   │   └── resources/
│   │       └── application.properties      # Configurações
│   └── test/
│       └── java/                          # Testes
├── .mvn/                                  # Wrapper Maven
├── pom.xml                                # Configuração Maven
├── mvnw                                   # Script Maven Unix
├── mvnw.cmd                               # Script Maven Windows
└── README.md                              # Documentação
```

## Serviços (Business Logic Layer)

### AuthService
**Localização**: `services/AuthService.java`
**Responsabilidade**: Recuperar usuário autenticado do contexto de segurança
**Método Principal**:
- `getAuthenticatedUser()`: Retorna o usuário atualmente autenticado

### CategoryService
**Localização**: `services/CategoryService.java`
**Responsabilidade**: Lógica de negócio para gerenciamento de categorias
**Métodos**:
- `createCategory(CategoryInsertDTO)`: Cria nova categoria com validação de duplicidade
- `deleteCategoryById(Long)`: Deleta categoria se estiver vazia
- `updateCategory(Long, CategoryDTO)`: Atualiza nome da categoria
- `findAllCategoriesByUser()`: Lista todas as categorias do usuário

**Validações Implementadas**:
- Verifica duplicidade de nome por usuário
- Impede deleção de categorias com itens
- Garante isolamento de dados por usuário

### ItemService
**Localização**: `services/ItemService.java`
**Responsabilidade**: Lógica de negócio para gerenciamento de itens e cálculos financeiros
**Métodos**:
- `findAllItemsByUser(Long categoryId)`: Lista itens com filtro opcional por categoria
- `createItem(ItemInsertDTO)`: Cria novo item com status AVAILABLE
- `sellItem(Long, ItemSellDTO)`: Registra venda e calcula métricas
- `getById(Long)`: Retorna item específico do usuário
- `deleteById(Long)`: Deleta item se não vendido
- `updateItem(Long, ItemUpdateDTO)`: Atualiza informações do item

**Cálculos Financeiros**:
- **Lucro**: `sellPrice - buyPrice`
- **Margem**: `(profit / sellPrice) * 100` com arredondamento de 4 casas decimais

**Validações Implementadas**:
- Impede venda de item já vendido
- Impede deleção de item já vendido
- Valida data de venda não anterior à data de compra
- Garante isolamento de dados por usuário

### UserService
**Localização**: `services/UserService.java`
**Responsabilidade**: Lógica de negócio para gerenciamento de usuários
**Métodos**:
- `findById(Long)`: Retorna usuário por ID
- `registerUser(UserRegisterDTO)`: Registra novo usuário com hash de senha
- `deleteUser(Long)`: Deleta usuário por ID

**Validações Implementadas**:
- Verifica correspondência de senhas no registro
- Verifica unicidade de username
- Hash de senha com BCrypt antes de persistir

### TokenService
**Localização**: `services/TokenService.java`
**Responsabilidade**: Geração e validação de tokens JWT
**Métodos**:
- `generateToken(User)`: Gera token JWT com expiração
- `isTokenValid(String)`: Valida assinatura e expiração do token
- `getUsernameFromToken(String)`: Extrai username do token

**Configuração**:
- Assinatura HMAC SHA
- Expiração configurável (24 horas padrão)
- Chave secreta configurada em application.properties

### CustomUserDetailsService
**Localização**: `services/CustomUserDetailsService.java`
**Responsabilidade**: Implementação de UserDetailsService para Spring Security
**Método**:
- `loadUserByUsername(String)`: Carrega UserDetails por username para autenticação

## Controladores (Presentation Layer)

### AuthenticationController
**Localização**: `controllers/AuthenticationController.java`
**Responsabilidade**: Gerenciar autenticação de usuários
**Endpoints**:
- `POST /auth/login`: Autentica usuário e retorna token JWT

### UserController
**Localização**: `controllers/UserController.java`
**Responsabilidade**: Gerenciar operações de usuários
**Endpoints**:
- `GET /users/me`: Retorna dados do usuário autenticado
- `GET /users/{id}`: Retorna usuário por ID (apenas próprio usuário)
- `POST /users/register`: Registra novo usuário
- `DELETE /users/{id}`: Deleta usuário (apenas próprio usuário)

### CategoryController
**Localização**: `controllers/CategoryController.java`
**Responsabilidade**: Gerenciar categorias
**Endpoints**:
- `POST /categories`: Cria nova categoria
- `GET /categories`: Lista todas as categorias do usuário
- `PUT /categories/{id}`: Atualiza categoria
- `DELETE /categories/{id}`: Deleta categoria

### ItemController
**Localização**: `controllers/ItemController.java`
**Responsabilidade**: Gerenciar itens
**Endpoints**:
- `POST /items`: Cria novo item
- `GET /items`: Lista itens do usuário (com filtro opcional por categoria)
- `GET /items/{itemId}`: Retorna item por ID
- `PUT /items/{itemId}`: Atualiza item
- `PATCH /items/{itemId}/sell`: Registra venda de item
- `DELETE /items/{itemId}`: Deleta item

## Configurações (Configuration Layer)

### SecurityConfig
**Localização**: `config/SecurityConfig.java`
**Responsabilidade**: Configurar cadeia de filtros do Spring Security
**Configurações**:
- Desabilita CSRF (não necessário para API REST)
- Configura CORS
- Define endpoints públicos (login, register, h2-console)
- Configura autenticação stateless
- Configura AuthenticationProvider com BCrypt
- Configura AuthenticationManager

### SecurityFilter
**Localização**: `config/SecurityFilter.java`
**Responsabilidade**: Filtro JWT para validação de tokens
**Funcionamento**:
- Intercepta todas as requisições
- Extrai token do header Authorization
- Valida token usando TokenService
- Carrega usuário do banco de dados
- Define autenticação no SecurityContext

### WebConfig
**Localização**: `config/WebConfig.java`
**Responsabilidade**: Configurar CORS
**Origins Permitidos**:
- `http://localhost:3000`
- `http://localhost:4200`
- `http://localhost:5173`

## Fluxo de Requisição

O fluxo completo de uma requisição na aplicação:

1. **Requisição HTTP** chega ao controller
2. **SecurityFilter** valida o token JWT (se necessário)
3. **Controller** recebe a requisição e valida DTOs
4. **Service** executa lógica de negócio e validações
5. **Repository** acessa o banco de dados via JPA
6. **Service** retorna DTO para o controller
7. **Controller** retorna resposta HTTP apropriada
8. **ResourceExceptionHandler** captura exceções se ocorrerem

## Considerações de Design

### Isolamento de Dados
- Todos os repositórios utilizam filtros por userId para garantir isolamento
- Serviços verificam propriedade dos recursos antes de operações
- Usuários só podem acessar seus próprios dados (categorias, itens)

### Transações
- Métodos de escrita nos serviços são anotados com `@Transactional`
- Métodos de leitura são anotados com `@Transactional(readOnly = true)`
- Garante atomicidade das operações

### Validação
- Validação de DTOs com Jakarta Validation
- Validação de regras de negócio nos serviços
- Validação de integridade referencial no banco

### Performance
- Uso de navegação de propriedades JPA para consultas eficientes
- Consultas específicas por usuário para reduzir conjunto de dados
- Lazy loading de relacionamentos

## Possíveis Melhorias Futuras

1. **Paginação**: Implementar paginação para listagens de itens e categorias
2. **Ordenação**: Permitir ordenação customizada nas listagens
3. **Filtros Avançados**: Adicionar filtros por período, faixa de preço, status
4. **Dashboard**: Endpoint com métricas agregadas (lucro total, itens vendidos, etc.)
5. **Exportação**: Endpoint para exportar dados em CSV/Excel
6. **Upload de Imagens**: Implementar upload de imagens para itens
7. **Auditoria**: Log de alterações em itens e categorias
8. **Notificações**: Sistema de notificações para itens vendidos
9. **Roles Avançadas**: Implementar roles de admin e diferentes permissões
10. **Cache**: Implementar cache para consultas frequentes

## Resumo Técnico

A Financial API é uma aplicação RESTful completa desenvolvida com Spring Boot 4.1.0 e Java 25, seguindo princípios de arquitetura em camadas. A aplicação implementa:

- **Autenticação JWT stateless** com Spring Security
- **CRUD completo** para usuários, categorias e itens
- **Isolamento de dados** multi-tenant por usuário
- **Cálculos financeiros** automáticos (lucro e margem)
- **Validação robusta** em múltiplas camadas
- **Tratamento global de exceções** com respostas padronizadas
- **API RESTful** seguindo melhores práticas
- **Banco de dados H2** para desenvolvimento (PostgreSQL configurável para produção)

A aplicação está pronta para uso em desenvolvimento e pode ser facilmente configurada para produção alterando as propriedades do banco de dados e JWT.

## Documentação Adicional

Para informações específicas sobre os endpoints, consulte o arquivo `API_REFERENCE.md` que contém documentação adicional da API.
