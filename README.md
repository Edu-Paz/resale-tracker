# Resale Tracker

Resale Tracker is a full-stack application for organizing resale operations. It is designed to help resellers register products, group them into categories, record purchases and sales, and track financial results such as profit, margin, and balance.

The repository contains a Spring Boot REST API and a React/Vite frontend. The backend already defines the main business API, while the frontend currently provides the public landing page and authentication screens that will consume that API.

## Project Status

- Backend: REST API with authentication, user, category, and item operations.
- Frontend: React interface with home, login, and registration views.
- Integration: The frontend authentication forms are currently visual and do not submit requests to the backend yet.
- Database: H2 in-memory database is the default development configuration.
- Production setup: PostgreSQL is included as a backend runtime dependency, but production database configuration must be provided separately.

## Main Features

### Backend

- User registration and login
- JWT-based authentication
- User profile lookup and account deletion
- Category CRUD operations
- Inventory item CRUD operations
- Item filtering by category
- Item sale workflow
- Automatic profit and margin calculation
- User balance updates after a sale
- Request validation with Jakarta Validation
- Global error response format
- H2 Console for local development

### Frontend

- Product landing page
- Responsive layout for desktop and mobile screens
- Login view
- Registration view
- Shared header, footer, and authentication form components
- Client-side navigation for `/`, `/login`, and `/cadastro`
- IBM Plex Serif, IBM Plex Sans, and IBM Plex Mono typography

## Architecture

```text
+-------------------+        HTTP/JSON         +-------------------------+
| React + Vite      |  --------------------->  | Spring Boot REST API    |
| frontend          |                           | backend                 |
| localhost:5173    |  <---------------------  | localhost:8080          |
+-------------------+                           +------------+------------+
                                                           |
                                                           v
                                                +-------------------------+
                                                | H2 in-memory database   |
                                                | PostgreSQL-ready         |
                                                +-------------------------+
```

The frontend is a Vite-powered single-page application. The backend exposes REST endpoints and applies authentication and authorization rules before accessing the persistence layer through Spring Data JPA.

## Technology Stack

### Frontend

- React 19
- React DOM 19
- Vite 8
- JavaScript and JSX
- CSS custom properties and responsive CSS
- ESLint 10
- React Hooks and React Refresh ESLint plugins

### Backend

- Java 21
- Spring Boot 4.1.0
- Spring Web
- Spring Data JPA
- Spring Security
- Jakarta Validation
- H2 Database for development
- PostgreSQL JDBC driver
- JJWT 0.11.5
- Lombok
- Maven Wrapper

## Requirements

Install the following tools before starting development:

- Node.js 18 or newer
- npm 9 or newer
- Java Development Kit 21
- Git

Maven does not need to be installed globally because the backend includes the Maven Wrapper. Docker is not required for the default H2 setup.

## Getting Started

### 1. Clone the repository

```bash
git clone git@github.com:Edu-Paz/resale-tracker.git
cd resale-tracker
```

### 2. Start the backend

Open a terminal in the backend directory:

```bash
cd backend
./mvnw spring-boot:run
```

On Windows, use:

```powershell
cd backend
mvnw.cmd spring-boot:run
```

The API will be available at:

```text
http://localhost:8080
```

The default setup uses an in-memory H2 database. The database is recreated when the application starts and sample data can be loaded from `backend/src/main/resources/import.sql`.

### 3. Start the frontend

Open another terminal in the repository root:

```bash
cd frontend
npm install
npm run dev
```

The frontend will usually be available at:

```text
http://localhost:5173
```

The frontend and backend must run at the same time when testing the complete application flow.

## Available Commands

### Frontend

Run these commands from `frontend/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Vite development server with hot reload. |
| `npm run build` | Generates the production bundle in `frontend/dist/`. |
| `npm run preview` | Serves the generated production bundle locally. |
| `npm run lint` | Runs ESLint against the frontend source. |

### Backend

Run these commands from `backend/`:

| Command | Description |
| --- | --- |
| `./mvnw spring-boot:run` | Starts the Spring Boot API. |
| `./mvnw test` | Runs the backend test suite. |
| `./mvnw clean package` | Compiles, tests, and packages the backend. |
| `./mvnw clean install` | Builds and installs the backend artifact locally. |

On Windows, replace `./mvnw` with `mvnw.cmd`.

## Backend Configuration

The default configuration is stored in `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=create-drop
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
api.jwt.expiration=86400000
```

### Default Development Database

- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: empty
- Console: `http://localhost:8080/h2-console`
- Schema lifecycle: recreated on application startup

The current JWT secret is present in the development properties file for local use. It must be replaced with a secret supplied through a secure environment-specific configuration before deploying the backend.

### PostgreSQL

The PostgreSQL driver is included in `backend/pom.xml`, but this repository does not currently provide a separate production properties profile. To use PostgreSQL, provide environment-specific Spring datasource properties, for example:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/resale_tracker
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

Do not commit production credentials or JWT secrets.

## API Overview

Base URL:

```text
http://localhost:8080
```

### Authentication

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Public | Creates a user account. |
| `POST` | `/auth/login` | Public | Authenticates a user and returns a JWT. |

### Users

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/users/me` | Authenticated | Returns the current user's details. |
| `GET` | `/users/{id}` | Authenticated | Returns the authenticated user's own data. |
| `DELETE` | `/users/{id}` | Authenticated | Deletes the authenticated user's account. |

### Categories

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/categories` | Authenticated | Creates a category. |
| `GET` | `/categories` | Authenticated | Lists the user's categories. |
| `PUT` | `/categories/{id}` | Authenticated | Updates a category. |
| `DELETE` | `/categories/{id}` | Authenticated | Deletes a category. |

### Items

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/items` | Authenticated | Adds an inventory item. |
| `GET` | `/items` | Authenticated | Lists the user's items. |
| `GET` | `/items/{itemId}` | Authenticated | Returns one item. |
| `PUT` | `/items/{itemId}` | Authenticated | Updates an item. |
| `PATCH` | `/items/{itemId}/sell` | Authenticated | Marks an item as sold and calculates results. |
| `DELETE` | `/items/{itemId}` | Authenticated | Deletes an item. |

Send JWT-protected requests with:

```http
Authorization: Bearer <your-jwt-token>
```

The complete request and response examples are available in [frontend/API_REFERENCE.md](frontend/API_REFERENCE.md).

## Business Rules

- New items start with the `AVAILABLE` status.
- Selling an item changes its status to `SOLD`.
- Profit is calculated as `sellPrice - buyPrice`.
- Margin is calculated as `(profit / buyPrice) * 100`.
- The user's balance is updated with the calculated profit after a sale.
- Users can only access their own profile, categories, and items.
- Monetary values use decimal precision.
- Dates use ISO 8601 format, such as `2024-01-15`.
- JWT tokens expire after 24 hours in the current development configuration.

## Security

- Login and registration endpoints are publicly accessible.
- Other API endpoints require a valid JWT.
- Passwords are hashed with BCrypt by the backend.
- User-owned resources are protected by ownership checks.
- Development secrets must not be reused in production.
- H2 Console access is intended for local development only.

## Repository Structure

```text
resale-tracker/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/resaletracker/
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── import.sql
│   │   ├── test/
│   │   └── ...
│   ├── pom.xml
│   ├── mvnw
│   └── README.md
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── routes.js
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── API_REFERENCE.md
│   └── README.md
└── README.md
```

## Frontend Routes

| Path | View | Current behavior |
| --- | --- | --- |
| `/` | Home | Displays the product introduction and feature overview. |
| `/login` | Login | Displays the login form. |
| `/cadastro` | Registration | Displays the registration form. |

Routing is currently implemented in `frontend/src/routes.js` with the browser History API. Unknown paths fall back to the home view.

## Validation Checklist

Run both frontend checks:

```bash
cd frontend
npm run lint
npm run build
```

Run backend checks:

```bash
cd backend
./mvnw test
./mvnw clean package
```

## Documentation

- [Frontend README](frontend/README.md)
- [Backend README](backend/README.md)
- [API Reference](frontend/API_REFERENCE.md)

## License

This project is part of the Resale Tracker system.
