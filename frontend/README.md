# Financial API - Resale Tracker Backend

A Spring Boot REST API for tracking resale items, categories, and financial metrics. This application allows users to manage their resale inventory, track purchases and sales, calculate profits and margins, and organize items by categories.

## Tech Stack


## Features


## Installation

### Prerequisites


### Setup

1. Clone the repository:
```bash
git clone git@github.com:Edu-Paz/resale-tracker.git
cd backend
```

2. Configure database connection in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/financial_api
spring.datasource.username=your_username
spring.datasource.password=your_password
```

3. Build the project:
```bash
./mvnw clean install
```

4. Run the application:
```bash
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080`

## Configuration

### Application Properties

Key configuration options in `application.properties`:

```properties
# Server
server.port=8080

# Database (H2 for development)
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# H2 Console
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# JWT Secret and Expiration
api.jwt.secret=your-secret-key-here
api.jwt.expiration=86400000
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. All endpoints except `/auth/login` and `/auth/register` require a valid JWT token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

### Authentication Flow

1. **Register**: Create a new user account
2. **Login**: Authenticate with username/password to receive JWT token
3. **Access Protected Endpoints**: Include JWT token in Authorization header

## API Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securepassword123",
  "passwordConfirmation": "securepassword123"
}
```

**Response**: `201 Created`
```json
{
  "id": 1,
  "username": "john_doe",
  "balance": 0.00
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securepassword123"
}
```

**Response**: `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response**: `403 Forbidden`
```json
{
  "message": "Authentication failed: Bad credentials"
}
```

### Users

#### Get Current User Details
```http
GET /users/me
Authorization: Bearer <token>
```

**Response**: `200 OK`
```json
{
  "id": 1,
  "username": "john_doe",
  "balance": 1500.00
}
```

#### Get User by ID
```http
GET /users/{id}
Authorization: Bearer <token>
```

**Note**: Users can only view their own data.

**Response**: `200 OK`
```json
{
  "id": 1,
  "username": "john_doe",
  "balance": 1500.00
}
```

#### Delete User
```http
DELETE /users/{id}
Authorization: Bearer <token>
```

**Note**: Users can only delete their own account.

**Response**: `204 No Content`

### Categories

#### Create Category
```http
POST /categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Electronics"
}
```

**Response**: `201 Created`
```json
{
  "id": 1,
  "name": "Electronics",
  "user": {
    "id": 1,
    "username": "john_doe"
  }
}
```

#### Get All Categories (for authenticated user)
```http
GET /categories
Authorization: Bearer <token>
```

**Response**: `200 OK`
```json
[
  {
    "id": 1,
    "name": "Electronics",
    "user": {
      "id": 1,
      "username": "john_doe"
    }
  },
  {
    "id": 2,
    "name": "Clothing",
    "user": {
      "id": 1,
      "username": "john_doe"
    }
  }
]
```

#### Update Category
```http
PUT /categories/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "id": 1,
  "name": "Consumer Electronics"
}
```

**Response**: `200 OK`
```json
{
  "id": 1,
  "name": "Consumer Electronics",
  "user": {
    "id": 1,
    "username": "john_doe"
  }
}
```

#### Delete Category
```http
DELETE /categories/{id}
Authorization: Bearer <token>
```

**Response**: `204 No Content`

### Items

#### Create Item
```http
POST /items
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "iPhone 13",
  "imgUrl": "https://example.com/iphone13.jpg",
  "buyPrice": 500.00,
  "buyDate": "2024-01-15",
  "categoryId": 1
}
```

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
    "name": "Electronics"
  }
}
```

#### Get All Items (for authenticated user)
```http
GET /items
Authorization: Bearer <token>
```

**Optional Query Parameter**: `?categoryId={id}` to filter by category

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
      "name": "Electronics"
    }
  }
]
```

#### Get Item by ID
```http
GET /items/{itemId}
Authorization: Bearer <token>
```

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
    "name": "Electronics"
  }
}
```

#### Update Item
```http
PUT /items/{itemId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "iPhone 13 Pro",
  "imgUrl": "https://example.com/iphone13pro.jpg",
  "buyPrice": 550.00,
  "buyDate": "2024-01-15",
  "categoryId": 1
}
```

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
    "name": "Electronics"
  }
}
```

#### Sell Item
```http
PATCH /items/{itemId}/sell
Authorization: Bearer <token>
Content-Type: application/json

{
  "sellPrice": 700.00,
  "sellDate": "2024-02-20"
}
```

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
    "name": "Electronics"
  }
}
```

**Note**: When an item is sold:

#### Delete Item
```http
DELETE /items/{itemId}
Authorization: Bearer <token>
```

**Response**: `204 No Content`

## Data Models

### User

### Category

### Item

### ItemStatus (Enum)

## DTOs (Data Transfer Objects)

### Authentication DTOs

### User DTOs

### Category DTOs

### Item DTOs

## Security

### JWT Configuration

### Security Rules

### Password Security

## Error Handling

The API uses global exception handling with standardized error responses:

### Standard Error Response
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed for object='itemInsertDTO'",
  "path": "/items"
}
```

### Common HTTP Status Codes

## Development

### H2 Console
Access the H2 database console at:
```
http://localhost:8080/h2-console
```

**Connection Details:**

### Running Tests
```bash
./mvnw test
```

### Building for Production
```bash
./mvnw clean package -Pprod
```

The JAR file will be created in `target/financial-api-0.0.1-SNAPSHOT.jar`

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/resaletracker/financialapi/
│   │   │   ├── config/           # Security and web configuration
│   │   │   ├── controllers/      # REST controllers
│   │   │   ├── dtos/            # Data transfer objects
│   │   │   ├── entities/        # JPA entities
│   │   │   ├── repositories/    # JPA repositories
│   │   │   ├── services/        # Business logic
│   │   │   └── FinancialApiApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/
├── .mvn/
├── pom.xml
└── README.md
```

## License

This project is part of the Resale Tracker system.

## Support

For issues or questions, please contact the development team.
