<!-- @format -->

# React Ecommerce Frontend

A modern, responsive ecommerce frontend built with React that integrates with a Spring Boot backend.

## 🚀 Features

### User Features

- **Authentication**: Login and Registration
- **Product Catalog**: Browse products with search and filters
- **Shopping Cart**: Add/remove products, manage quantities
- **Checkout Process**: Secure payment with Razorpay integration
- **Order History**: Track past purchases and order status

### Admin Features

- **Product Management**: Add, edit, delete products
- **Inventory Control**: Manage stock quantities
- **Order Management**: View and process orders
- **Dashboard Analytics**: Sales overview and metrics

### Technical Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI/UX**: Clean, intuitive interface
- **State Management**: Context API for auth and cart
- **API Integration**: RESTful API calls with Axios
- **Protected Routes**: Role-based access control
- **File Upload**: Product image management

## 🛠 Tech Stack

- **React 18** - UI Framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Context API** - State management
- **Axios** - HTTP client
- **Modern CSS** - Styling with Flexbox/Grid
- **Razorpay** - Payment gateway integration

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.jsx      # Navigation bar
│   ├── Loading.jsx     # Loading spinner
│   └── ProtectedRoute.jsx
├── contexts/           # Context providers
│   ├── AuthContext.jsx # Authentication state
│   └── CartContext.jsx # Shopping cart state
├── pages/              # Page components
│   ├── Home.jsx        # Landing page
│   ├── Login.jsx       # User login
│   ├── Register.jsx    # User registration
│   ├── Products.jsx    # Product catalog
│   ├── Cart.jsx        # Shopping cart
│   ├── Checkout.jsx    # Payment process
│   ├── Orders.jsx      # Order history
│   └── AdminDashboard.jsx
├── services/           # API services
│   └── api.js          # Axios configuration
└── App.jsx             # Main app component
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on localhost:8081

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd react-ecommerce-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure API endpoint**
   Update `src/services/api.js` if your backend runs on a different port:

   ```javascript
   const API_BASE_URL = "http://localhost:8081/api";
   ```

4. **Configure Razorpay**
   Update the Razorpay key in `src/pages/Checkout.jsx`:

   ```javascript
   const options = {
     key: "your_razorpay_key", // Replace with your key
     // ...
   };
   ```

5. **Start development server**

   ```bash
   npm run dev
   ```

6. **Open in browser**
   Visit `http://localhost:5173`

## 🔐 Authentication

The app supports two user roles:

### Regular User

- Browse products
- Manage cart
- Place orders
- View order history

### Admin User

- All user features
- Product management
- Inventory control
- Order management

## 📱 Responsive Design

The application is fully responsive and works across:

- **Desktop**: Full-featured layout
- **Tablet**: Adapted navigation and grids
- **Mobile**: Touch-friendly interface with hamburger menu

## 🛒 Cart Management

- **Persistent Cart**: Cart state maintained across sessions
- **Real-time Updates**: Instant cart count updates
- **Selective Checkout**: Choose specific items for purchase

## 💳 Payment Integration

- **Razorpay Gateway**: Secure payment processing
- **Order Tracking**: Real-time payment verification
- **Multiple Payment Methods**: Cards, UPI, Net Banking

## 🔒 Security Features

- **JWT Authentication**: Token-based auth
- **Protected Routes**: Role-based access control
- **API Security**: Authenticated API requests
- **Input Validation**: Form validation and sanitization

## 📊 Admin Dashboard

- **Product Management**: CRUD operations
- **Image Upload**: Product photo management
- **Stock Control**: Inventory tracking
- **Order Processing**: Order status updates

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel/Netlify

1. Build the project
2. Upload the `dist` folder
3. Configure environment variables
4. Set up custom domain (optional)

## 🤝 API Integration

The frontend integrates with these backend endpoints:

### User Endpoints

- `POST /api/user/register` - User registration
- `POST /api/user/login` - User authentication

### Product Endpoints

- `GET /api/products` - Get all products
- `POST /api/products` - Add product (Admin)
- `PUT /api/products/{id}` - Update product (Admin)
- `DELETE /api/products/{id}` - Delete product (Admin)

### Cart Endpoints

- `GET /api/cart/user/{userId}` - Get user cart
- `POST /api/cart/{cartId}/add/{productId}` - Add to cart
- `DELETE /api/cart/{cartId}/remove/{productId}` - Remove from cart

### Order Endpoints

- `POST /api/orders/cart/{cartId}` - Place order
- `POST /api/orders/cart/{cartId}/items` - Place partial order

### Payment Endpoints

- `POST /api/payment/create-order/{orderId}/{amount}` - Create payment
- `POST /api/payment/verify` - Verify payment

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8081/api
VITE_RAZORPAY_KEY=your_razorpay_key_here
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**

   - Ensure backend CORS is configured for frontend domain

2. **Authentication Issues**

   - Check JWT token expiration
   - Verify API endpoint URLs

3. **Payment Failures**

   - Confirm Razorpay key configuration
   - Check network connectivity

4. **Image Upload Issues**
   - Verify file size limits
   - Check supported formats

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- Use functional components with hooks
- Follow React best practices
- Maintain consistent CSS naming
- Add proper error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed.

## 👥 Support

For support and questions:

- Create an issue in the repository
- Check existing documentation
- Review API endpoint specifications

---

**Happy Coding! 🎉**
"# Ecommerce-frontend"
