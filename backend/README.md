# ZuluGshop — Backend (Spring Boot / Java 21 / MongoDB)

REST API for the ZuluGshop e-commerce platform.

---

## Tech Stack
- Java 21
- Spring Boot 3.3
- Spring Security + JWT
- Spring Data MongoDB
- Lombok
- Maven

---

## Project Structure
```
src/main/java/com/zulugshop/
├── ZuluGshopApplication.java
├── config/
│   ├── SecurityConfig.java       ← CORS, JWT filter, role rules
│   └── DataSeeder.java           ← Seeds admin user + sample data
├── controller/
│   ├── AuthController.java       ← /api/auth/**
│   ├── ProductController.java    ← /api/products/** (public)
│   ├── CategoryController.java   ← /api/categories/** (public)
│   ├── OrderController.java      ← /api/orders/** (auth required)
│   └── AdminController.java      ← /api/admin/** (ROLE_ADMIN)
├── dto/
│   ├── AuthDto.java
│   ├── ProductDto.java
│   └── OrderDto.java
├── exception/
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   └── BadRequestException.java
├── model/
│   ├── User.java
│   ├── Product.java
│   ├── Category.java
│   ├── Order.java
│   └── Review.java
├── repository/
│   ├── UserRepository.java
│   ├── ProductRepository.java
│   ├── CategoryRepository.java
│   ├── OrderRepository.java
│   └── ReviewRepository.java
├── security/
│   ├── JwtUtil.java
│   ├── JwtAuthFilter.java
│   └── CustomUserDetailsService.java
└── service/
    ├── AuthService.java
    ├── ProductService.java
    ├── CategoryService.java
    └── OrderService.java
```

---

## Environment Variables

| Variable        | Description                       | Default                              |
|-----------------|-----------------------------------|--------------------------------------|
| `PORT`          | Server port                       | `8080`                               |
| `MONGODB_URI`   | MongoDB connection string         | `mongodb://localhost:27017/zulugshop`|
| `JWT_SECRET`    | JWT signing secret (min 32 chars) | dev default (change in production!)  |
| `FRONTEND_URL`  | Allowed CORS origin               | `http://localhost:5173`              |

---

## Run Locally

```bash
# 1. Ensure Java 21+ and Maven are installed
java --version   # must be 21+
mvn --version

# 2. Start MongoDB locally  OR  set MONGODB_URI to MongoDB Atlas
# Local: mongod --dbpath /data/db

# 3. Build
mvn clean install -DskipTests

# 4. Run
mvn spring-boot:run

# API available at http://localhost:8080
# Health check: http://localhost:8080/actuator/health
```

---

## Auto-Seeded Data on First Start

| Type     | Value                                      |
|----------|--------------------------------------------|
| Admin    | `admin@zulugshop.com` / `admin123`         |
| Categories | Electronics, Fashion, Home & Living, Sports, Books |
| Products | 4 sample products with images & ratings    |

---

## API Reference

### Auth
```
POST /api/auth/register   → { firstName, lastName, email, password }
POST /api/auth/login      → { email, password }
POST /api/auth/refresh    → { refreshToken }
```

### Products (Public)
```
GET /api/products                    → paginated list
GET /api/products?search=keyword     → search
GET /api/products?category=id        → filter by category
GET /api/products/featured           → featured products
GET /api/products/:id                → single product
```

### Categories (Public)
```
GET /api/categories       → all active categories
GET /api/categories/:id   → single category
```

### Orders (Authenticated)
```
POST /api/orders              → place order
GET  /api/orders/my-orders    → current user's orders
GET  /api/orders/:id          → single order
```

### Admin (ROLE_ADMIN only)
```
GET  /api/admin/dashboard/stats

GET  /api/admin/products
POST /api/admin/products
PUT  /api/admin/products/:id
DEL  /api/admin/products/:id

GET  /api/admin/categories
POST /api/admin/categories
PUT  /api/admin/categories/:id
DEL  /api/admin/categories/:id

GET  /api/admin/orders
PUT  /api/admin/orders/:id/status   → { status, trackingNumber? }

GET  /api/admin/users
```

---

## Deploy on Render

1. Push this folder to GitHub as its own repo (or subdirectory)
2. Create **New Web Service** → connect repo
3. Settings:
   - **Runtime**: Java
   - **Build Command**: `mvn clean install -DskipTests`
   - **Start Command**: `java -jar target/zulugshop-backend-1.0.0.jar`
4. Environment Variables:
   ```
   MONGODB_URI = mongodb+srv://user:pass@cluster.mongodb.net/zulugshop
   JWT_SECRET  = some-very-long-random-secret-string-here
   FRONTEND_URL = https://your-frontend.onrender.com
   ```
5. **Health Check Path**: `/actuator/health`
