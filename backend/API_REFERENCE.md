# API Reference - Financial API Backend

Base URL: `http://localhost:8080`

## Authentication

All endpoints except `/auth/login` and `/users/register` require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```


## Endpoints

### Authentication

#### Register User
```http
POST /users/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "securepassword123",
  "passwordConfirmation": "securepassword123"
}
```

**Response (201):**
```json
{
  "id": 1,
  "username": "john_doe",
  "balance": 0.00
}
```

**Validation Rules:**
- `username`: 3-20 characters, required
- `password`: minimum 6 characters, required
- `passwordConfirmation`: must match password, required

---

#### Login
```http
POST /auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error (403):** Plain text
```
Authentication failed: Bad credentials
```

---

### Users

#### Get Current User Details
```http
GET /users/me
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "username": "john_doe",
  "balance": 1500.00
}
```

---

#### Get User by ID
```http
GET /users/{id}
Authorization: Bearer <token>
```

**Note:** Users can only view their own data.

**Response (200):**
```json
{
  "id": 1,
  "username": "john_doe",
  "balance": 1500.00
}
```

---

#### Delete User
```http
DELETE /users/{id}
Authorization: Bearer <token>
```

**Note:** Users can only delete their own account.

**Response (204):** No Content

---

### Categories

#### Create Category
```http
POST /categories
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Electronics"
}
```

**Response (201):**
```json
{
  "id": 1,
  "name": "Electronics",
  "user": {
    "id": 1,
    "username": "john_doe",
    "balance": 0.00
  }
}
```

**Validation & Business Rules:**
- `name`: required, not blank
- Category name must be unique for the authenticated user (returns 422 if duplicate)

---

#### Get All Categories
```http
GET /categories
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Electronics",
    "user": {
      "id": 1,
      "username": "john_doe",
      "balance": 0.00
    }
  },
  {
    "id": 2,
    "name": "Clothing",
    "user": {
      "id": 1,
      "username": "john_doe",
      "balance": 0.00
    }
  }
]
```

---

#### Update Category
```http
PUT /categories/{id}
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Consumer Electronics"
}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Consumer Electronics",
  "user": {
    "id": 1,
    "username": "john_doe",
    "balance": 0.00
  }
}
```

**Validation Rules:**
- `name`: required, not blank

---

#### Delete Category
```http
DELETE /categories/{id}
Authorization: Bearer <token>
```

**Business Rules:**
- Cannot delete a category that contains items (returns 422)

**Response (204):** No Content

---

### Items

#### Create Item
```http
POST /items
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "iPhone 13",
  "imgUrl": "https://example.com/iphone13.jpg",
  "buyPrice": 500.00,
  "buyDate": "2024-01-15",
  "categoryId": 1
}
```

**Response (201):**
```json
{
  "id": 1,
  "name": "iPhone 13",
  "imgUrl": "https://example.com/iphone13.jpg",
  "status": "AVAILABLE",
  "buyPrice": 500.00,
  "buyDate": "2024-01-15",
  "sellPrice": null,
  "sellDate": null,
  "profit": null,
  "margin": null,
  "category": {
    "id": 1,
    "name": "Electronics",
    "user": {
      "id": 1,
      "username": "john_doe",
      "balance": 0.00
    }
  }
}
```

**Validation Rules:**
- `name`: required, not blank
- `buyPrice`: required, must be positive
- `buyDate`: required, cannot be in the future
- `categoryId`: required, category must belong to authenticated user
- `imgUrl`: optional

---

#### Get All Items
```http
GET /items
Authorization: Bearer <token>
```

**Optional Query Parameter:** `?categoryId={id}` to filter by category

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "iPhone 13",
    "imgUrl": "https://example.com/iphone13.jpg",
    "status": "AVAILABLE",
    "buyPrice": 500.00,
    "buyDate": "2024-01-15",
    "sellPrice": null,
    "sellDate": null,
    "profit": null,
    "margin": null,
    "category": {
      "id": 1,
      "name": "Electronics",
      "user": {
        "id": 1,
        "username": "john_doe",
        "balance": 0.00
      }
    }
  }
]
```

---

#### Get Item by ID
```http
GET /items/{itemId}
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "name": "iPhone 13",
  "imgUrl": "https://example.com/iphone13.jpg",
  "status": "AVAILABLE",
  "buyPrice": 500.00,
  "buyDate": "2024-01-15",
  "sellPrice": null,
  "sellDate": null,
  "profit": null,
  "margin": null,
  "category": {
    "id": 1,
    "name": "Electronics",
    "user": {
      "id": 1,
      "username": "john_doe",
      "balance": 0.00
    }
  }
}
```

---

#### Update Item
```http
PUT /items/{itemId}
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "iPhone 13 Pro",
  "imgUrl": "https://example.com/iphone13pro.jpg",
  "buyPrice": 550.00,
  "buyDate": "2024-01-15",
  "sellPrice": null,
  "sellDate": null,
  "categoryId": 1,
  "status": "AVAILABLE"
}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "iPhone 13 Pro",
  "imgUrl": "https://example.com/iphone13pro.jpg",
  "status": "AVAILABLE",
  "buyPrice": 550.00,
  "buyDate": "2024-01-15",
  "sellPrice": null,
  "sellDate": null,
  "profit": null,
  "margin": null,
  "category": {
    "id": 1,
    "name": "Electronics",
    "user": {
      "id": 1,
      "username": "john_doe",
      "balance": 0.00
    }
  }
}
```

**Validation & Business Rules:**
- `name`: required, not blank
- `buyPrice`: optional, must be positive if provided
- `buyDate`: optional, cannot be in the future if provided
- `categoryId`: optional, category must belong to authenticated user
- `imgUrl`: optional
- `status`: optional (`AVAILABLE` or `SOLD`). When changed to `AVAILABLE`, `sellPrice`, `sellDate`, `profit`, and `margin` are automatically reset to `null`.
- `sellPrice`: optional
- `sellDate`: optional, cannot be before `buyDate` (returns 422)

**Side Effects:**
- If item status is `SOLD` and `buyPrice` or `sellPrice` is updated, profit and margin are recalculated.

---

#### Sell Item
```http
PATCH /items/{itemId}/sell
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "sellPrice": 700.00,
  "sellDate": "2024-02-20"
}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "iPhone 13",
  "imgUrl": "https://example.com/iphone13.jpg",
  "status": "SOLD",
  "buyPrice": 500.00,
  "buyDate": "2024-01-15",
  "sellPrice": 700.00,
  "sellDate": "2024-02-20",
  "profit": 200.00,
  "margin": 28.57,
  "category": {
    "id": 1,
    "name": "Electronics",
    "user": {
      "id": 1,
      "username": "john_doe",
      "balance": 0.00
    }
  }
}
```

**Validation & Business Rules:**
- `sellPrice`: required, must be positive
- `sellDate`: required, cannot be in the future (`@PastOrPresent`)
- `sellDate` cannot be before `buyDate` (returns 422)
- Item cannot already be in `SOLD` status (returns 422)

**Side Effects:**
- Item status changes to `SOLD`
- Profit is calculated: `sellPrice - buyPrice`
- Margin is calculated: `(profit / sellPrice) * 100`

---

#### Delete Item
```http
DELETE /items/{itemId}
Authorization: Bearer <token>
```

**Response (204):** No Content

---

## Data Models

### ItemStatus Enum
- `AVAILABLE`: Item is in stock and available for sale
- `SOLD`: Item has been sold

---

## HTTP Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `204 No Content`: Successful deletion
- `400 Bad Request`: Validation error, malformed JSON, or database integrity violation
- `403 Forbidden`: Authentication failed or access denied
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Business rule violation (e.g., selling already sold item, sell date before buy date, duplicate category name, deleting category with items)
- `500 Internal Server Error`: Server error

---

## Error Response Format

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed for object='itemInsertDTO'",
  "path": "/items"
}
```

---

## Notes

- All monetary values use `BigDecimal` format (e.g., `500.00`)
- Dates use ISO 8601 format (e.g., `2024-01-15`)
- Users can only access their own data (categories, items, user profile)
- JWT tokens expire after 24 hours (86,400,000 ms)
- Passwords are hashed with BCrypt
