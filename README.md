# 🛍️ BuyHub - Hub for Online Shoping

A scalable online retail system aimed at helping small businesses manage products, payments, and customer orders efficiently in one place.

<img width="1558" height="763" alt="Screenshot (17)" src="https://github.com/user-attachments/assets/c18ea429-a0c1-4d70-8cf7-652cdfe391aa" />

## 🌐 Live Demo

**Frontend:** [https://ecommerce-frontend22-umber-chi-76.vercel.app](https://ecommerce-frontend22-umber-chi-76.vercel.app)  
**Backend API:** Deployed on Hugging Face Spaces (Docker)

> **⚠️ Important Note:** The backend is hosted on Hugging Face Spaces free tier and enters sleep mode after inactivity. The **first request may take 30-60 seconds** to wake up the server. Subsequent requests will be fast.

## 📹 Demo Video

[🎥 Watch Full Demo](https://github.com/user-attachments/assets/06a244fb-4e44-489c-b58c-0407bd5e12d4)


## 📸 Screenshots

### 🛍️ Customer Features

<p align="center">
  <img width="1000" alt="Browse Products" src="https://github.com/user-attachments/assets/9e1cc8af-5221-41e1-9e40-253668200f3e" />
  <br />
  <em>Browse products with card layouts and images</em>
</p>

<p align="center">
  <img width="1000" alt="Cart Management" src="https://github.com/user-attachments/assets/797ebec7-c1d5-4ca9-8fff-367ebbe273a6" />
  <br />
  <em>Manage cart items with real-time total calculations</em>
</p>

<p align="center">
  <img width="1000" alt="Secure Payment" src="https://github.com/user-attachments/assets/ad591096-12ee-4408-b9bd-68657617cddb" />
  <br />
  <em>Secure payment processing with Razorpay integration</em>
</p>

<p align="center">
  <img width="1000" alt="Order Tracking" src="https://github.com/user-attachments/assets/e828061b-8db5-40b5-b099-b8c623c64a27" />
  <br />
  <em>Track your orders with visual progress indicators</em>
</p>

---

### 👨‍💼 Admin Features

<p align="center">
  <img width="1000" alt="Product Management" src="https://github.com/user-attachments/assets/7b3491d5-63bd-421f-ace1-fd715eb9068d" />
  <br />
  <em>Comprehensive admin dashboard with statistics</em>
</p>

<p align="center">
  <img width="1000" alt="Admin Dashboard" src="https://github.com/user-attachments/assets/e718769f-be2c-4976-bd97-ddaf55b475d8" />
  <br />
  <em>Manage products with image upload and CRUD operations</em>
</p>

<p align="center">
  <img width="1000" alt="Order Status Update" src="https://github.com/user-attachments/assets/65ce978f-2a9e-4178-b4a9-d211270f2041" />
  <br />
  <em>Track and update order statuses</em>
</p>

## ✨ Features

### 🛒 Customer Features
- **User Authentication**: Secure JWT-based login and registration
- **Product Catalog**: Browse products with search and filters
- **Shopping Cart**: Add/remove products with quantity management
- **Secure Checkout**: Integrated with Razorpay payment gateway
- **Order Tracking**: Real-time order status updates with visual progress
- **Order History**: View past orders with detailed information
- **Responsive Design**: Works seamlessly on all devices

### 👨‍💼 Admin Features
- **Admin Dashboard**: Overview of sales, orders, and revenue statistics
- **Product Management**: 
  - Add new products with image upload (Cloudinary)
  - Edit existing products
  - Delete products
  - View all products in a table
- **Order Management**:
  - View all orders with filtering by status
  - Update order statuses (Pending → Paid → Processing → Shipped → Delivered)
  - Track order statistics and revenue
  - View detailed order information
- **Inventory Control**: Manage product details and availability

### 🔒 Security Features
- JWT-based authentication
- Role-based access control (User/Admin)
- Secure payment processing
- Protected API endpoints
- Password encryption

## 🏗️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Context API** - State management
- **Axios** - HTTP client
- **CSS3** - Styling with modern layouts

### Backend
- **Spring Boot 3.5.3** - Java framework
- **Spring Security** - Authentication & Authorization
- **JWT (JJWT 0.11.5)** - Token-based auth
- **Spring Data JPA** - Database operations
- **MySQL** - Relational database
- **Razorpay SDK** - Payment integration
- **Cloudinary** - Image storage
- **Maven** - Dependency management

### Infrastructure
- **Frontend**: Vercel (Free tier)
- **Backend**: Hugging Face Spaces with Docker (Free tier)
- **Database**: Clever Cloud MySQL (Free tier)
- **Image Storage**: Cloudinary (Free tier)

## ⚠️ Known Limitations (Free Tier)

### 1. Backend Cold Start
- **Issue**: Backend sleeps after 15 minutes of inactivity
- **Impact**: First request takes 30-60 seconds to wake up
- **Workaround**: Wait patiently for the initial response; subsequent requests are fast

### 2. Database Connections
- **Issue**: Clever Cloud free tier limits database connections
- **Limit**: Maximum 5 concurrent connections
- **Impact**: May experience connection issues with multiple simultaneous users
- **Workaround**: HikariCP connection pooling configured with `maximum-pool-size=3`

### 3. Storage Limitations
- **Database**: Limited to 256MB storage
- **Images**: Cloudinary free tier (25 GB storage, 25 GB bandwidth/month)
- **Impact**: Limited number of products and images can be stored

### 4. Performance
- **Backend**: Shared resources on Hugging Face Spaces
- **Database**: Shared hosting may cause occasional latency
- **Images**: First-time image loads may be slower

## 🚀 Getting Started
📖 For detailed setup instructions, see:
- [Frontend Setup Guide](./frontend/README.md)
- [Backend Setup Guide](./backend/README.md)


## 📁 Project Structure

```
BuyHub/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # Context providers
│   │   ├── pages/         # Page components
│   │   └── services/      # API services
│   └── package.json
│
└── backend/               # Spring Boot backend
    └── ecommerce/
        ├── src/main/java/com/example/ecommerce/
        │   ├── config/    # Security & app config
        │   ├── controller/# REST controllers
        │   ├── dto/       # Data transfer objects
        │   ├── entity/    # JPA entities
        │   ├── repository/# Data repositories
        │   └── service/   # Business logic
        └── pom.xml
```


### Default Admin Account
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: Administrator

### Default user Account
- **Username**: `user3`
- **Password**: `user33`
- **Role**: User


## 📧 Contact

**Anirudh** - [Vennapusaani1629@gmail.com](mailto:Vennapusaani1629@gmail.com)

**Project Link**: [https://github.com/AnirudhV16/BuyHub](https://github.com/AnirudhV16/BuyHub)

---

⭐ Star this repository if you find it helpful!
