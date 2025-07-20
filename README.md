# GlamStore - E-commerce Application

A full-stack e-commerce application built with Angular frontend and Node.js/Express backend, featuring makeup and accessories products.

## 🚀 Features

### Frontend (Angular + Bootstrap)
- **Responsive Design**: Mobile-first design with Bootstrap 5
- **Modern UI**: Clean and intuitive user interface
- **Role-based Access**: Different interfaces for users and admins
- **Authentication**: JWT-based authentication with guards
- **Shopping Cart**: Full cart management functionality
- **Product Catalog**: Advanced filtering and searching

### Backend (Node.js + Express)
- **RESTful API**: Well-structured API endpoints
- **Authentication**: JWT token-based authentication
- **Role Management**: User and admin roles
- **Product Management**: CRUD operations for products
- **Cart Management**: Shopping cart functionality
- **Database**: MongoDB with Mongoose ODM

### Pages & Components
- **Home**: Hero section with featured products and categories
- **Products**: Product listing with filters and search
- **Cart**: Shopping cart with quantity management
- **Login/Register**: User authentication
- **Admin**: Product management dashboard (admin only)

## 🛠️ Technology Stack

### Frontend
- **Angular 20**: Latest Angular framework
- **Bootstrap 5**: Responsive UI framework
- **RxJS**: Reactive programming
- **Font Awesome**: Icon library
- **TypeScript**: Type-safe JavaScript

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ODM
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v4.4 or higher)
- Angular CLI (`npm install -g @angular/cli`)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ecommerce-app
```

### 2. Backend Setup
```bash
# Install backend dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration:
# PORT=5001
# MONGO_URI=mongodb://localhost:27017/ecommerce
# JWT_SECRET=your-super-secret-jwt-key
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install frontend dependencies
npm install
```

### 4. Database Setup
```bash
# Make sure MongoDB is running
sudo systemctl start mongod  # Linux
brew services start mongodb  # macOS

# Seed the database with sample data (optional)
cd ..
node seed.js
```

### 5. Start the Applications

#### Start Backend (from root directory)
```bash
npm start
# Server will run on http://localhost:5001
```

#### Start Frontend (from frontend directory)
```bash
cd frontend
npm start
# Application will run on http://localhost:4200
```

## 🎯 Usage

### Demo Credentials
After seeding the database, you can use these credentials:

**Admin User:**
- Email: admin@example.com
- Password: password

**Regular User:**
- Email: user@example.com
- Password: password

### Application Flow
1. **Browse Products**: Visit the home page to see featured products
2. **Register/Login**: Create an account or login
3. **Shop**: Browse products, filter by category, add to cart
4. **Cart Management**: View cart, update quantities, proceed to checkout
5. **Admin Functions**: Manage products (admin users only)

## 📁 Project Structure

```
├── backend/
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── cartController.js  # Cart management
│   │   ├── productController.js # Product CRUD
│   │   └── userController.js  # User management
│   ├── middlewares/
│   │   ├── authMiddleware.js  # JWT authentication
│   │   └── roleMiddleware.js  # Role-based access
│   ├── models/
│   │   ├── User.js           # User model
│   │   ├── Product.js        # Product model
│   │   └── cart.js           # Cart model
│   ├── routes/
│   │   ├── authRoutes.js     # Auth endpoints
│   │   ├── cartRoutes.js     # Cart endpoints
│   │   ├── productRoutes.js  # Product endpoints
│   │   └── userRoutes.js     # User endpoints
│   ├── app.js                # Express app setup
│   ├── package.json
│   └── .env                  # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   └── navbar.component.ts
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts
│   │   │   │   └── admin.guard.ts
│   │   │   ├── models/
│   │   │   │   ├── user.model.ts
│   │   │   │   ├── product.model.ts
│   │   │   │   └── cart.model.ts
│   │   │   ├── pages/
│   │   │   │   ├── home.component.ts
│   │   │   │   ├── login.component.ts
│   │   │   │   ├── register.component.ts
│   │   │   │   ├── products.component.ts
│   │   │   │   ├── cart.component.ts
│   │   │   │   └── admin.component.ts
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── product.service.ts
│   │   │   │   └── cart.service.ts
│   │   │   ├── app.routes.ts
│   │   │   ├── app.config.ts
│   │   │   └── app.ts
│   │   ├── styles.css         # Global styles
│   │   └── index.html
│   ├── package.json
│   └── angular.json
│
├── seed.js                    # Database seeding script
└── README.md
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:productId` - Update item quantity
- `DELETE /api/cart/remove/:productId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/:id` - Update user

## 🎨 UI Features

- **Responsive Design**: Works on all device sizes
- **Modern Styling**: Clean, professional appearance
- **Interactive Elements**: Hover effects, loading states
- **Form Validation**: Real-time validation with error messages
- **Navigation**: Intuitive navigation with role-based menus
- **Shopping Cart Badge**: Real-time cart item count
- **Product Filtering**: Search and filter by category/price
- **Loading States**: Spinners and skeleton loading

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Route Guards**: Protected routes based on authentication/roles
- **CORS Configuration**: Proper cross-origin resource sharing
- **Input Validation**: Form validation on frontend and backend

## 🚀 Deployment

### Frontend Deployment
```bash
cd frontend
ng build --prod
# Deploy dist/ folder to your hosting service
```

### Backend Deployment
```bash
# Set production environment variables
# Deploy to your preferred hosting service (Heroku, AWS, etc.)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🐛 Known Issues

- MongoDB connection required for full functionality
- Checkout functionality is placeholder (payment integration needed)
- Image uploads use URLs (file upload system needed)

## 🔮 Future Enhancements

- Payment gateway integration
- Email notifications
- Product reviews and ratings
- Wishlist functionality
- Order history
- Advanced analytics for admin
- Real-time inventory updates
- Multi-language support