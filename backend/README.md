# 🔧 BuyHub Backend

A Spring Boot REST API for e-commerce operations, featuring JWT authentication, payment integration, and comprehensive order management.

## 🌟 Features

### 🔐 Security & Authentication
- **JWT-based authentication** with secure token generation
- **BCrypt password encryption** for user credentials
- **Role-based access control** (USER, ADMIN)
- **Spring Security** integration
- **Protected API endpoints** with authorization

### 🛒 E-commerce Operations
- **User Management**: Registration, login, profile management
- **Product Management**: CRUD operations with image upload
- **Cart Management**: Add, remove, update cart items
- **Order Processing**: Create orders, track status, history
- **Payment Integration**: Razorpay payment gateway
- **Image Storage**: Cloudinary integration for product images

### 📦 Order Management
- Order creation from cart (full or partial)
- Order status workflow (Pending → Paid → Processing → Shipped → Delivered)
- Order cancellation for pending orders
- Order history and tracking
- Order statistics and analytics

### 👨‍💼 Admin Features
- View all orders with filtering
- Update order statuses
- Product CRUD operations
- Order statistics and revenue tracking
- User management capabilities

## 🏗️ Architecture

### Tech Stack
- **Spring Boot 3.5.3** - Application framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Database operations
- **MySQL** - Relational database
- **JWT (JJWT 0.11.5)** - Token authentication
- **Razorpay Java SDK 1.4.4** - Payment processing
- **Cloudinary 1.39.0** - Image storage
- **Maven** - Dependency management

### Design Patterns
- **Repository Pattern** - Data access abstraction
- **Service Layer Pattern** - Business logic separation
- **DTO Pattern** - Data transfer objects
- **Dependency Injection** - Spring IoC container
- **RESTful API** - Stateless HTTP endpoints

## 📁 Project Structure

```
backend/ecommerce/
├── src/main/java/com/example/ecommerce/
│   ├── config/
│   │   ├── CloudinaryConfig.java       # Cloudinary configuration
│   │   ├── CorsConfig.java            # CORS settings
│   │   ├── JwtAuthConverter.java      # JWT authentication converter
│   │   └── SecurityConfig.java        # Spring Security config
│   ├── controller/
│   │   ├── AdminOrderController.java  # Admin order endpoints
│   │   ├── CartController.java        # Cart operations
│   │   ├── OrderController.java       # User order endpoints
│   │   ├── PaymentController.java     # Payment processing
│   │   ├── ProductController.java     # Product CRUD
│   │   └── UserController.java        # User authentication
│   ├── dto/
│   │   ├── CartDTO.java               # Cart data transfer
│   │   ├── OrderDTO.java              # Order data transfer
│   │   ├── PaymentRequest.java        # Payment request
│   │   ├── PaymentResponse.java       # Payment response
│   │   └── ProductDTO.java            # Product data transfer
│   ├── entity/
│   │   ├── Cart.java                  # Cart entity
│   │   ├── CartItem.java              # Cart item entity
│   │   ├── Order.java                 # Order entity
│   │   ├── OrderItem.java             # Order item entity
│   │   ├── Product.java               # Product entity
│   │   ├── Role.java                  # Role enum
│   │   └── User.java                  # User entity
│   ├── repository/
│   │   ├── CartRepository.java        # Cart data access
│   │   ├── OrderRepository.java       # Order data access
│   │   ├── ProductRepository.java     # Product data access
│   │   └── UserRepository.java        # User data access
│   ├── service/
│   │   ├── CartService.java           # Cart business logic
│   │   ├── JwtFilter.java             # JWT filter
│   │   ├── JwtService.java            # JWT token operations
│   │   ├── OrderService.java          # Order business logic
│   │   ├── PaymentService.java        # Payment processing
│   │   ├── ProductService.java        # Product operations
│   │   ├── UserService.java           # User operations
│   │   └── userDetailsService.java    # Spring Security user details
│   └── EcommerceApplication.java      # Main application class
├── src/main/resources/
│   └── application.properties         # Application configuration
├── Dockerfile                         # Docker configuration
├── pom.xml                           # Maven dependencies
└── README.md                         # This file
```

## 🚀 Getting Started

### Prerequisites

- **Java 21** or higher
- **Maven 3.9+**
- **MySQL 8.0+**
- **Razorpay Account** (for payment integration)
- **Cloudinary Account** (for image storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/BuyHub.git
   cd BuyHub/backend/ecommerce
   ```

2. **Create MySQL database**
   ```sql
   CREATE DATABASE ecommerce;
   ```

3. **Configure application properties**
   
   Create `.env` file in `backend/ecommerce/` directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=ecommerce
   DB_USERNAME=your_mysql_username
   DB_PASSWORD=your_mysql_password
   
   # JPA Configuration
   JPA_DDL_AUTO=update
   SHOW_SQL=true
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Razorpay Configuration
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_at_least_256_bits
   ```

4. **Install dependencies**
   ```bash
   ./mvnw clean install
   ```

5. **Run the application**
   ```bash
   ./mvnw spring-boot:run
   ```

6. **Verify server is running**
   ```
   Server started at: http://localhost:8081
   ```
   
   Test endpoint: `http://localhost:8081/api/products`

### Quick Setup with Spring Dotenv

The project uses `spring-dotenv` for environment variable management:

```bash
# Install spring-dotenv dependency (already in pom.xml)
# Just create .env file with your credentials
```

## 🔑 Configuration Guide

### Database Configuration

**MySQL Connection**:
```properties
spring.datasource.url=jdbc:mysql://${DB_HOST:localhost}:${DB_PORT:3306}/${DB_NAME:ecommerce}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

**HikariCP Connection Pool** (Optimized for free tier):
```properties
spring.datasource.hikari.maximum-pool-size=3
spring.datasource.hikari.minimum-idle=1
spring.datasource.hikari.idle-timeout=10000
spring.datasource.hikari.max-lifetime=30000
spring.datasource.hikari.connection-timeout=20000
```

### Cloudinary Setup

1. Sign up at [Cloudinary](https://cloudinary.com)
2. Get your credentials from Dashboard
3. Add to `.env`:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### Razorpay Setup

1. Sign up at [Razorpay](https://dashboard.razorpay.com)
2. Generate API keys (Test mode for development)
3. Add to `.env`:
   ```env
   RAZORPAY_KEY_ID=rzp_test_your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   ```

### JWT Configuration

Generate a secure secret key (at least 256 bits):
```bash
# Generate random secret
openssl rand -base64 32
```

Add to `.env`:
```env
JWT_SECRET=your_generated_secret_key
```

## 📡 API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/user/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "role": "ROLE_USER"
}

Response: 200 OK
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "role": "ROLE_USER"
}
```

#### Login
```http
POST /api/user/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123"
}

Response: 200 OK
"eyJhbGciOiJIUzI1NiJ9..." (JWT Token)
```

### Product Endpoints

#### Get All Products (Public)
```http
GET /api/products

Response: 200 OK
[
  {
    "id": 1,
    "name": "Product Name",
    "description": "Product description",
    "price": 99.99,
    "imageUrl": "https://cloudinary.com/..."
  }
]
```

#### Add Product (Admin Only)
```http
POST /api/products
Authorization: Bearer {token}
Content-Type: multipart/form-data

product: {
  "name": "New Product",
  "description": "Description",
  "price": 149.99
}
image: (file)

Response: 200 OK
```

#### Update Product (Admin Only)
```http
PUT /api/products/{id}
Authorization: Bearer {token}
Content-Type: multipart/form-data

product: {updated data}
image: (optional file)
```

#### Delete Product (Admin Only)
```http
DELETE /api/products/{id}
Authorization: Bearer {token}

Response: 200 OK
"Product deleted successfully"
```

### Cart Endpoints

#### Get User Cart
```http
GET /api/cart/user/{userId}
Authorization: Bearer {token}

Response: 200 OK
{
  "id": 1,
  "userId": 1,
  "items": [...]
}
```

#### Add to Cart
```http
POST /api/cart/{cartId}/add/{productId}?quantity=1
Authorization: Bearer {token}

Response: 200 OK
```

#### Remove from Cart
```http
DELETE /api/cart/{cartId}/remove/{productId}
Authorization: Bearer {token}

Response: 200 OK
```

### Order Endpoints

#### Place Order from Cart
```http
POST /api/orders/cart/{cartId}
Authorization: Bearer {token}

Response: 200 OK
{
  "id": 1,
  "userId": 1,
  "orderDate": "2025-10-19T10:30:00",
  "status": "PENDING",
  "totalPrice": 299.99,
  "orderItems": [...]
}
```

#### Place Partial Order
```http
POST /api/orders/cart/{cartId}/items
Authorization: Bearer {token}
Content-Type: application/json

[1, 2, 3] (Cart Item IDs)

Response: 200 OK
```

#### Get User Orders
```http
GET /api/orders/user/{userId}
Authorization: Bearer {token}

Response: 200 OK
[{order1}, {order2}, ...]
```

#### Cancel Order
```http
PUT /api/orders/{orderId}/user/{userId}/cancel
Authorization: Bearer {token}

Response: 200 OK
```

### Payment Endpoints

#### Create Payment Order
```http
POST /api/payment/create-order/{orderId}/{amount}
Authorization: Bearer {token}

Response: 200 OK
{
  "orderId": "order_razorpay_id",
  "amount": 29999,
  "currency": "INR",
  "razorpayKeyId": "rzp_test_..."
}
```

#### Verify Payment
```http
POST /api/payment/verify
Authorization: Bearer {token}
Content-Type: application/json

{
  "razorpayOrderId": "order_id",
  "paymentId": "pay_id",
  "signature": "signature"
}

Response: 200 OK
"Payment verified successfully!"
```

### Admin Order Endpoints

#### Get All Orders (Admin)
```http
GET /api/admin/orders
Authorization: Bearer {admin_token}

Response: 200 OK
```

#### Get Orders by Status (Admin)
```http
GET /api/admin/orders/status/{status}
Authorization: Bearer {admin_token}

Response: 200 OK
```

#### Update Order Status (Admin)
```http
PUT /api/admin/orders/{orderId}/status
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "SHIPPED"
}

Response: 200 OK
```

#### Get Order Statistics (Admin)
```http
GET /api/admin/orders/stats
Authorization: Bearer {admin_token}

Response: 200 OK
{
  "totalOrders": 150,
  "pendingOrders": 10,
  "paidOrders": 80,
  "shippedOrders": 40,
  "deliveredOrders": 15,
  "cancelledOrders": 5,
  "totalRevenue": 50000.00,
  "monthlyRevenue": 12000.00
}
```

## 🔒 Security Configuration

### CORS Configuration

Configured to allow requests from frontend:
```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins(
                        "http://localhost:3000",
                        "http://localhost:5173",
                        "https://your-frontend-url.com"
                    )
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

### JWT Token Structure

**Claims**:
- `sub`: User ID
- `username`: Username
- `authorities`: User role (ROLE_USER or ROLE_ADMIN)
- `iat`: Issued at
- `exp`: Expiration time (1 hour)

### Endpoint Security

```java
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/user/register", "/api/user/login").permitAll()
    .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")
    .requestMatchers("/api/user/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
    .requestMatchers(HttpMethod.GET, "/api/products").permitAll()
    .anyRequest().authenticated()
)
```

## 🗄️ Database Schema

### User Table
```sql
CREATE TABLE user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    enabled BOOLEAN DEFAULT TRUE
);
```

### Product Table
```sql
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DOUBLE NOT NULL,
    image_url VARCHAR(500),
    image_public_id VARCHAR(255)
);
```

### Cart & Cart Item Tables
```sql
CREATE TABLE cart (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNIQUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE cart_item (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (cart_id) REFERENCES cart(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### Order & Order Item Tables
```sql
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_date DATETIME NOT NULL,
    status VARCHAR(50) NOT NULL,
    total_price DOUBLE NOT NULL,
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE order_item (
    id INT PRIMARY KEY AUTO_INCREMENT,
    quantity INT NOT NULL,
    price DOUBLE NOT NULL,
    product_id INT NOT NULL,
    order_id INT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);
```

## 🐳 Docker Deployment

For deploying the Spring Boot backend, there are multiple approaches. Here, we use **Hugging Face Spaces**, which requires Docker, and we follow simple Docker steps to build and run the application.

### Dockerfile
```dockerfile
# Build stage
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn -q -e -DskipTests clean package

# Run stage
FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Build and Run with Docker

```bash
# Build Docker image
docker build -t buyhub-backend .

# Run container
docker run -p 8081:8081 \
  -e DB_HOST=your_db_host \
  -e DB_USERNAME=your_username \
  -e DB_PASSWORD=your_password \
  -e CLOUDINARY_CLOUD_NAME=your_cloud \
  -e CLOUDINARY_API_KEY=your_key \
  -e CLOUDINARY_API_SECRET=your_secret \
  -e RAZORPAY_KEY_ID=your_razorpay_key \
  -e RAZORPAY_KEY_SECRET=your_razorpay_secret \
  buyhub-backend
```

### Deploy to Hugging Face Spaces

1. Create new Space with Docker SDK
2. Push code to Space repository
3. Configure secrets in Space settings
4. Application will auto-deploy

**README.yaml** for Hugging Face:
```yaml
title: BuyHub Backend API
sdk: docker
app_port: 8081
emoji: 🛍️
colorFrom: indigo
colorTo: blue
pinned: false
license: mit
```

## 🧪 Testing with Postman

All API endpoints can be tested easily using **Postman** by sending requests to the backend server.

1. Import API collection
2. Set base URL: `http://localhost:8081`
3. Add Authorization header for protected endpoints
4. Test all CRUD operations

## 🐛 Common Issues & Solutions

### 1. Database Connection Failed
**Error**: `Could not get JDBC Connection`

**Solutions**:
- Verify MySQL is running: `sudo service mysql status`
- Check database credentials in `.env`
- Ensure database exists: `CREATE DATABASE ecommerce;`
- Check port 3306 is not blocked
- Verify HikariCP configuration for connection pooling

### 2. JWT Token Issues
**Error**: `Invalid JWT token` or `Token expired`

**Solutions**:
- Check JWT_SECRET is properly configured
- Verify token hasn't expired (1 hour validity)
- Ensure token is sent in Authorization header: `Bearer {token}`
- Check JwtService configuration

### 3. Image Upload Fails
**Error**: `Failed to upload image to Cloudinary`

**Solutions**:
- Verify Cloudinary credentials in `.env`
- Check internet connection
- Ensure image size is within limits (10MB)
- Verify Cloudinary quota hasn't been exceeded

### 4. Payment Gateway Errors
**Error**: `Razorpay authentication failed`

**Solutions**:
- Verify Razorpay credentials
- Ensure using correct keys (test vs live)
- Check Razorpay account is active
- Verify webhook configuration

### 5. CORS Errors
**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solutions**:
- Add frontend URL to CorsConfig.java
- Restart Spring Boot application
- Clear browser cache
- Check CORS middleware configuration

### 6. Port Already in Use
**Error**: `Port 8081 is already in use`

**Solutions**:
```bash
# Find process using port 8081
lsof -i :8081

# Kill the process
kill -9 <PID>

# Or change port in application.properties
server.port=8082
```

## 📊 Performance Optimization

### Implemented Optimizations

1. **Connection Pooling**: HikariCP configured for optimal performance
2. **Lazy Loading**: JPA entities use lazy fetching
3. **DTO Pattern**: Reduces data transfer overhead
4. **Transaction Management**: `@Transactional` for database consistency
5. **Query Optimization**: Custom queries for complex operations

### Recommendations

- Enable caching for frequently accessed data
- Implement pagination for large result sets
- Use database indexing for search columns
- Monitor query performance with Spring Boot Actuator
- Consider Redis for session management
