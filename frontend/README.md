# Financial API - Resale Tracker Backend

A Spring Boot REST API for tracking resale items, categories, and financial metrics. This application allows users to manage their resale inventory, track purchases and sales, calculate profits and margins, and organize items by categories.

## Tech Stack

- **Java 21**
- **Spring Boot 4.1.0**
- **Spring Security 6.x** - JWT-based authentication
- **Spring Data JPA** - Database ORM
- **PostgreSQL** - Production database
- **H2 Database** - Development/testing database
- **Lombok** - Reduce boilerplate code
- **JWT (jjwt 0.11.5)** - Token-based authentication
- **Maven** - Build tool

## Features

- User registration and authentication with JWT tokens
- Category management (CRUD operations)
- Item inventory management (CRUD operations)
- Item selling with automatic profit and margin calculation
- User balance tracking
- Role-based access control (USER role)
- H2 Console for development database access
- Request validation with Jakarta Validation
- Global exception handling

## Installation

### Prerequisites

- Java 21 or higher
- Maven 3.6+
- PostgreSQL (for production)

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
- Status changes to `SOLD`
- Profit is calculated: `sellPrice - buyPrice`
- Margin is calculated: `(profit / buyPrice) * 100`
- User balance is updated with the profit

#### Delete Item
```http
DELETE /items/{itemId}
Authorization: Bearer <token>
```

**Response**: `204 No Content`

## Data Models

### User
- `id`: Long (auto-generated)
- `username`: String (unique, 3-20 characters)
- `password`: String (hashed with BCrypt)
- `balance`: BigDecimal
- `categories`: Set of Category (one-to-many relationship)

### Category
- `id`: Long (auto-generated)
- `name`: String
- `user`: User (many-to-one relationship)
- `items`: List of Item (one-to-many relationship)

### Item
- `id`: Long (auto-generated)
- `name`: String
- `imgUrl`: String (optional)
- `buyPrice`: BigDecimal
- `sellPrice`: BigDecimal (nullable)
- `buyDate`: LocalDate
- `sellDate`: LocalDate (nullable)
- `status`: ItemStatus (AVAILABLE or SOLD)
- `profit`: BigDecimal (calculated on sale)
- `margin`: BigDecimal (calculated on sale)
- `category`: Category (many-to-one relationship)

### ItemStatus (Enum)
- `AVAILABLE`: Item is in stock and available for sale
- `SOLD`: Item has been sold

## DTOs (Data Transfer Objects)

### Authentication DTOs
- `LoginRequestDTO`: username, password
- `LoginResponseDTO`: token

### User DTOs
- `UserRegisterDTO`: username, password, passwordConfirmation
- `UserDTO`: id, username, balance

### Category DTOs
- `CategoryInsertDTO`: name
- `CategoryDTO`: id, name, user

### Item DTOs
- `ItemInsertDTO`: name, imgUrl, buyPrice, buyDate, categoryId
- `ItemUpdateDTO`: name, imgUrl, buyPrice, buyDate, categoryId
- `ItemSellDTO`: sellPrice, sellDate
- `ItemDTO`: All item fields including calculated profit and margin

## Security

### JWT Configuration
- Secret key configured in `application.properties`
- Token expiration: 24 hours (86400000 ms)
- Tokens are signed using HMAC SHA algorithm

### Security Rules
- `/auth/login` and `/auth/register` are publicly accessible
- `/h2-console/**` is accessible for development
- All other endpoints require authentication
- Users can only access their own data (categories, items, user profile)
- Role-based access: All authenticated users have `ROLE_USER`

### Password Security
- Passwords are hashed using BCrypt encoder
- Minimum password length: 6 characters
- Password confirmation required during registration

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
- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `204 No Content`: Successful deletion
- `400 Bad Request`: Validation error or invalid request
- `403 Forbidden`: Authentication failed or access denied
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Development

### H2 Console
Access the H2 database console at:
```
http://localhost:8080/h2-console
```

**Connection Details:**
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: (leave empty)

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
