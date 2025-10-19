<!-- @format -->
# BuyHub Frontend

A modern, responsive React-based e-commerce frontend, built with Vite and featuring secure authentication, shopping cart, and payment integration.

## 🌟 Features

### 🛒 Shopping Experience
- **Product Catalog**: 
  - Grid layout with responsive design
  - Product images with fallback placeholders
  - Quick add-to-cart functionality
  
- **Shopping Cart**:
  - Real-time cart updates
  - Item quantity management
  - Selective checkout (choose specific items)
  - Persistent cart state
  - Total price calculations
  
- **Checkout Process**:
  - Multi-step checkout flow
  - Billing information collection
  - Secure Razorpay payment integration
  - Order confirmation and tracking

### 📦 Order Management
- Order history with status tracking
- Visual progress indicators
- Order filtering by status
- Detailed order information
- Cancel order functionality (for pending orders)

### 👨‍💼 Admin Dashboard
- **Overview Tab**:
  - Sales statistics
  - Revenue metrics (total and monthly)
  - Quick action buttons
  
- **Product Management**:
  - Add/Edit/Delete products
  - Image upload with Cloudinary
  - Product listing table
  - Form validation
  
- **Order Management**:
  - View all orders
  - Filter by status
  - Update order status
  - Order statistics and analytics

### 💅 UI/UX Features
- Modern gradient designs
- Smooth animations and transitions
- Toast notifications for user feedback
- Loading states and spinners
- Responsive design
- Accessible components

### 🔐 Authentication & Authorization
- JWT-based secure authentication
- Role-based access control (User/Admin)
- Protected routes with automatic redirection
- Persistent sessions with localStorage
- Automatic token refresh and validation

## 🛠️ Tech Stack

- **React 19.1.1** - Latest React with concurrent features
- **Vite 7.1.2** - Lightning-fast build tool
- **React Router 7.8.1** - Client-side routing
- **Axios 1.11.0** - HTTP client for API calls
- **JWT Decode 4.0.0** - JWT token parsing
- **Context API** - State management
- **CSS3** - Modern styling with Flexbox/Grid
- **Razorpay Checkout** - Payment gateway integration

## 📁 Project Structure

```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── AdminOrderManagement.jsx    # Admin order management
│   │   ├── Loading.jsx                  # Loading spinner
│   │   ├── Navbar.jsx                   # Navigation bar
│   │   ├── Notifications.jsx            # Toast notifications
│   │   └── ProtectedRoute.jsx          # Route protection
│   ├── contexts/
│   │   ├── AuthContext.jsx             # Authentication state
│   │   └── CartContext.jsx             # Shopping cart state
│   ├── pages/
│   │   ├── Home.jsx                    # Landing page
│   │   ├── Login.jsx                   # User login
│   │   ├── Register.jsx                # User registration
│   │   ├── Products.jsx                # Product catalog
│   │   ├── Cart.jsx                    # Shopping cart
│   │   ├── Checkout.jsx                # Payment process
│   │   ├── Orders.jsx                  # Order history
│   │   └── AdminDashboard.jsx          # Admin panel
│   ├── services/
│   │   └── api.js                      # Axios configuration
│   ├── App.jsx                         # Main app component
│   ├── main.jsx                        # Entry point
│   └── index.css                       # Global styles
├── .env                                # Environment variables
├── package.json                        # Dependencies
└── vite.config.js                      # Vite configuration
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 16.x or higher
- **npm** or **yarn**
- Backend API running (see [Backend README](../backend/README.md))

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   # Create .env file in frontend directory
   touch .env
   ```

4. **Configure environment variables**
   ```env
   # .env file
   VITE_API_BASE_URL=http://localhost:8081
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   VITE_APP_NAME=BuyHub
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

## 🔑 Environment Variables

Create a `.env` file in the frontend directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8081

# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id

# Application Configuration
VITE_APP_NAME=BuyHub
```

### Getting Razorpay Keys

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Navigate to Settings → API Keys
3. Generate Test/Live keys
4. Copy Key ID to your `.env` file

**Note**: Use test keys for development and live keys only in production.

## 📱 Features Walkthrough

### User Journey

1. **Registration/Login**
   - Navigate to `/register` to create account
   - Or `/login` to sign in
   - Automatic redirection based on role

2. **Browse Products**
   - Visit `/products` to see catalog
   - Click "Add to Cart" on desired items
   - Cart badge updates in real-time

3. **Manage Cart**
   - Click Cart icon in navbar
   - Review items, quantities, and prices
   - Select specific items for checkout
   - Click "Proceed to Checkout"

4. **Checkout & Payment**
   - Fill in billing information
   - Review order summary
   - Click "Pay Now"
   - Complete payment via Razorpay
   - Automatic redirect to orders page

5. **Track Orders**
   - Visit `/orders` to view history
   - Filter by status
   - View detailed order information
   - Cancel pending orders if needed

### Admin Journey

1. **Access Admin Panel**
   - Login with admin credentials
   - Automatic redirect to `/admin`

2. **Manage Products**
   - Add new products with images
   - Edit existing products
   - Delete products
   - View all products in table

3. **Manage Orders**
   - View all customer orders
   - Filter by status (Pending, Paid, Shipped, etc.)
   - Update order status
   - View order statistics

## 🎨 Customization

### API Endpoints

Modify API base URL in `src/services/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";
```

## 📊 State Management

### Auth Context
Manages user authentication state:
```javascript
const { user, token, login, logout, register, isAdmin } = useAuth();
```

### Cart Context
Manages shopping cart state:
```javascript
const { cartId, cartItemCount, addToCart, removeFromCart, clearCart } = useCart();
```

## 🐛 Common Issues & Solutions

### 1. CORS Errors
**Problem**: API requests blocked by CORS policy  
**Solution**: 
- Ensure backend CORS configuration includes frontend URL
- Check `CorsConfig.java` in backend
```java
.allowedOrigins("http://localhost:5173", "https://your-frontend-url.com")
```

### 2. Authentication Issues
**Problem**: User logged out unexpectedly  
**Solution**:
- Check token expiration in JWT configuration
- Verify token in browser localStorage
- Clear localStorage and login again

### 3. Cart Not Updating
**Problem**: Cart count not reflecting changes  
**Solution**:
- Check `updateCartItemCount()` is called after cart operations
- Verify backend cart API responses
- Check browser console for errors

### 4. Payment Gateway Issues
**Problem**: Razorpay not loading  
**Solution**:
- Verify Razorpay script in `index.html`
- Check Razorpay Key ID in `.env`
- Ensure internet connection (Razorpay CDN)
- Check browser console for script loading errors

### 5. Images Not Displaying
**Problem**: Product images show placeholders  
**Solution**:
- Verify Cloudinary configuration in backend
- Check image URLs in API responses
- Ensure Cloudinary upload is working
- Fallback placeholders will display if images fail

## 📦 Dependencies

### Production Dependencies
```json
{
  "axios": "^1.11.0",           // HTTP client
  "jwt-decode": "^4.0.0",       // JWT parsing
  "react": "^19.1.1",           // UI library
  "react-dom": "^19.1.1",       // React DOM
  "react-router-dom": "^7.8.1"  // Routing
}
```

### Development Dependencies
```json
{
  "@vitejs/plugin-react": "^5.0.0",  // Vite React plugin
  "eslint": "^9.33.0",                // Linting
  "vite": "^7.1.2"                    // Build tool
}
```

## 🧪 Testing Payment Integration

### Razorpay Test Cards

Use these test cards in test mode:

**Successful Payment**:
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date
- 3D Secure OTP: 1234

**Failed Payment**:
- Card: 4000 0000 0000 0002

### Test Payment Flow

1. Add products to cart
2. Proceed to checkout
3. Fill billing information
4. Click "Pay Now"
5. Use test card details
6. Complete payment
7. Verify order in Orders page

## 🚀 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Build the project**
   ```bash
   npm run build
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set environment variables**
   - Go to Vercel Dashboard
   - Settings → Environment Variables
   - Add `VITE_API_BASE_URL` and `VITE_RAZORPAY_KEY_ID`

### Deploy to Netlify

1. **Build command**: `npm run build`
2. **Publish directory**: `dist`
3. **Environment variables**: Add in Netlify dashboard

## 📈 Performance Optimization

### Already Implemented
- Code splitting with React Router
- Lazy loading of components
- Image optimization
- Vite's fast HMR
- Production build minification

### Recommendations
- Implement React.lazy for route-based code splitting
- Add service worker for offline support
- Use CDN for static assets
- Implement image lazy loading
- Add caching strategies
