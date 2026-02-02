Now let me create the comprehensive README file with setup instructions


# Restaurant Management System

A full-stack restaurant management system with separate admin and customer panels built using React (Frontend) and Express.js (Backend) with MySQL database.

## Features

### Admin Panel
- **Dashboard**: View statistics (total orders, bookings, customers, food items, feedback)
- **Food Items Management**: Add, edit, delete menu items with images
- **Orders Management**: View all orders, update order status
- **Bookings Management**: View all table bookings, update booking status
- **Customers Management**: View and manage customer accounts
- **Feedback Management**: View and manage customer feedback

### Customer Panel
- **Dashboard**: Quick access to all features
- **Browse Menu**: View all available food items with images and prices
- **Shopping Cart**: Add items to cart, adjust quantities
- **Place Orders**: Order food items with real-time status tracking
- **Table Booking**: Book tables for specific dates and times
- **Order History**: View past orders and their status
- **Submit Feedback**: Share experience and feedback

## Technology Stack

### Backend
- **Node.js** with Express.js
- **MySQL** database
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Multer** for file uploads
- **CORS** for cross-origin requests

### Frontend
- **React** 18.x
- **React Router** for navigation
- **Axios** for API calls
- **React Toastify** for notifications
- **CSS3** for styling

## Project Structure

```
restaurant-management/
├── backend/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── middleware/
│   │   └── auth.js              # Authentication middleware
│   ├── routes/
│   │   ├── adminAuth.js         # Admin authentication
│   │   ├── customerAuth.js      # Customer authentication
│   │   ├── foodItems.js         # Food items CRUD
│   │   ├── orders.js            # Orders management
│   │   ├── bookings.js          # Bookings management
│   │   ├── feedback.js          # Feedback management
│   │   └── customers.js         # Customer management
│   ├── uploads/                 # Uploaded images
│   ├── .env                     # Environment variables
│   ├── package.json
│   └── server.js                # Entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js           # Axios API configuration
│   │   ├── components/
│   │   │   ├── Admin/
│   │   │   │   ├── AdminLogin.js
│   │   │   │   ├── AdminDashboard.js
│   │   │   │   ├── ManageFoodItems.js
│   │   │   │   ├── ManageOrders.js
│   │   │   │   ├── ManageBookings.js
│   │   │   │   ├── ManageFeedback.js
│   │   │   │   └── ManageCustomers.js
│   │   │   └── Customer/
│   │   │       ├── CustomerLogin.js
│   │   │       ├── CustomerRegister.js
│   │   │       ├── CustomerDashboard.js
│   │   │       ├── Menu.js
│   │   │       ├── Cart.js
│   │   │       ├── MyOrders.js
│   │   │       ├── MyBookings.js
│   │   │       └── SubmitFeedback.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
└── database/
    └── schema.sql               # Database schema
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd restaurant-management
```

### Step 2: Database Setup

1. Start MySQL server

2. Create the database and tables:
```bash
mysql -u root -p < database/schema.sql
```

Or manually execute the SQL commands in `database/schema.sql`

3. The default admin credentials will be:
   - Email: admin@restaurant.com
   - Password: admin123

### Step 3: Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (already created, but update with your credentials):
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=restaurant_db
JWT_SECRET=your_secret_key_here
```

4. Create uploads directory:
```bash
mkdir uploads
```

5. Start the backend server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Step 4: Frontend Setup

1. Open a new terminal and navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

### Admin Panel

1. Navigate to `http://localhost:3000/admin/login`
2. Login with default credentials:
   - Email: admin@restaurant.com
   - Password: admin123
3. Access admin features:
   - Manage food items (add/edit/delete with images)
   - View and update order status
   - View and manage bookings
   - View customer list
   - View customer feedback

### Customer Panel

1. Navigate to `http://localhost:3000/login`
2. Register a new account or login
3. Access customer features:
   - Browse menu items
   - Add items to cart
   - Place orders
   - Book tables
   - View order history
   - Submit feedback

## API Endpoints

### Authentication
- `POST /api/admin/auth/login` - Admin login
- `POST /api/admin/auth/register` - Admin registration
- `POST /api/customer/auth/login` - Customer login
- `POST /api/customer/auth/register` - Customer registration

### Food Items
- `GET /api/fooditems` - Get all food items
- `GET /api/fooditems/:id` - Get food item by ID
- `POST /api/fooditems` - Add food item (Admin)
- `PUT /api/fooditems/:id` - Update food item (Admin)
- `DELETE /api/fooditems/:id` - Delete food item (Admin)

### Orders
- `GET /api/orders/admin/all` - Get all orders (Admin)
- `GET /api/orders/customer` - Get customer orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `PUT /api/orders/:id/cancel` - Cancel order

### Bookings
- `GET /api/bookings/admin/all` - Get all bookings (Admin)
- `GET /api/bookings/customer` - Get customer bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id/status` - Update booking status (Admin)
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `DELETE /api/bookings/:id` - Delete booking (Admin)

### Feedback
- `GET /api/feedback/admin/all` - Get all feedback (Admin)
- `GET /api/feedback/customer` - Get customer feedback
- `POST /api/feedback` - Submit feedback
- `DELETE /api/feedback/:id` - Delete feedback (Admin)

### Customers
- `GET /api/customers` - Get all customers (Admin)
- `GET /api/customers/:id` - Get customer by ID (Admin)
- `DELETE /api/customers/:id` - Delete customer (Admin)

## Database Schema

### Tables
- **admins**: Admin user accounts
- **customers**: Customer user accounts
- **foodItems**: Menu items with images
- **orders**: Customer orders
- **orderdetails**: Order line items
- **booking**: Table reservations
- **feedback**: Customer feedback

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected routes with middleware
- Role-based access control (Admin/Customer)
- SQL injection prevention with parameterized queries

## Additional Notes

### Image Upload
- Food item images are stored in `backend/uploads/`
- Supported formats: JPG, JPEG, PNG, GIF, WEBP
- Images are accessible at `http://localhost:5000/uploads/[filename]`

### Cart Functionality
- Cart is stored in browser's localStorage
- Persists across page refreshes
- Cleared after successful order placement

### Order Status Flow
1. PENDING - Initial state
2. PROCESSING - Being prepared
3. DELIVERED - Completed
4. CANCELLED - Cancelled by customer/admin

### Booking Status Flow
1. PENDING - Awaiting confirmation
2. CONFIRMED - Approved by admin
3. COMPLETED - Customer arrived
4. CANCELLED - Cancelled

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify MySQL is running
   - Check credentials in `.env`
   - Ensure database `restaurant_db` exists

2. **Port Already in Use**
   - Backend: Change PORT in `.env`
   - Frontend: Set PORT in environment or kill process using port 3000

3. **CORS Errors**
   - Ensure backend is running
   - Check CORS configuration in `server.js`

4. **Image Upload Issues**
   - Verify `uploads/` directory exists
   - Check file permissions
   - Ensure multer is installed

5. **JWT Token Errors**
   - Clear localStorage in browser
   - Re-login to get new token
   - Check JWT_SECRET in `.env`

## Future Enhancements

- Payment gateway integration
- Email notifications
- Real-time order tracking
- Reviews and ratings
- Delivery address management
- Multi-restaurant support
- Analytics dashboard
- Mobile app version

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please create an issue in the repository.