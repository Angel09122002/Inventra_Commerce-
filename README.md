# Inventra Commerce

A full-stack e-commerce and inventory management system built with React, Node.js, Express, and PostgreSQL. This project demonstrates a complete online store with order processing, real-time inventory tracking, and a modern web interface.

## 🚀 Features

- **Product Management**: CRUD operations for products with SKU, pricing, and descriptions
- **Customer Management**: Store and manage customer information
- **Order Processing**: Create and track orders with line items
- **Payment Integration**: Handle payments linked to orders
- **Inventory Tracking**: Real-time stock management with transaction history
- **Dashboard**: Overview of key metrics and recent activity
- **Responsive UI**: Modern React interface with routing and components
- **RESTful API**: Well-structured backend with error handling and validation

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **React Router** - Client-side routing
- **Vite** - Fast build tool and dev server
- **CSS Modules** - Scoped styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **pg (node-postgres)** - Database client
- **CORS, Helmet, Morgan** - Security and logging middleware

### Database
- **PostgreSQL** - Primary database
- **Entity-Relationship Design** - Normalized schema with constraints

## 📁 Project Structure

```
Inventra_Commerce-/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── config/         # Environment configuration
│   │   ├── controllers/    # Route handlers
│   │   ├── lib/            # Database connection
│   │   ├── middleware/     # Error handling, CORS
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helpers and utilities
│   │   └── server.js       # Server entry point
│   └── sql/                # Database schema and seeds
├── src/                    # React frontend
│   ├── app/                # Main app components
│   ├── assets/             # Static assets
│   ├── components/         # Reusable UI components
│   ├── layout/             # Layout components
│   ├── pages/              # Page components
│   └── styles/             # Global styles
├── public/                 # Static files
└── package.json            # Frontend dependencies
```

## 🗄️ Database Schema

The application uses a normalized PostgreSQL schema with the following main tables:

- **customer**: Customer information
- **product**: Product catalog with pricing
- **order**: Order headers with status
- **list**: Order line items (junction table)
- **payment**: Payment records linked to orders
- **inventory_transaction**: Stock movement tracking

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Inventra_Commerce-
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Setup Frontend**
   ```bash
   cd ..
   npm install
   ```

4. **Database Setup**
   ```bash
   cd backend
   # Create database and run schema
   npm run db:init
   # Seed with sample data
   npm run db:seed
   ```

5. **Environment Variables**
   Create `.env` file in `backend/` directory:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/inventra_commerce
   PORT=5000
   CORS_ORIGIN=http://localhost:5173
   ```

### Running the Application

1. **Start Backend**
   ```bash
   cd backend
   npm run dev
   ```
   Server runs on http://localhost:5000

2. **Start Frontend**
   ```bash
   # In another terminal
   npm run dev
   ```
   App runs on http://localhost:5173

## 📡 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PATCH /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PATCH /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

### Payments
- `GET /api/payments` - Get all payments
- `GET /api/payments/:id` - Get payment by ID
- `POST /api/payments` - Create new payment
- `PATCH /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment

### Inventory
- `GET /api/inventory` - Get inventory status
- `POST /api/inventory/transactions` - Record inventory transaction

## 🏗️ Architecture

### Backend Architecture
- **MVC Pattern**: Controllers handle requests, services contain business logic, routes define endpoints
- **Database Layer**: Direct SQL queries with connection pooling
- **Middleware**: Centralized error handling, logging, and security
- **Validation**: Input validation and error responses

### Frontend Architecture
- **Component-Based**: Reusable React components
- **Routing**: Client-side navigation with React Router
- **State Management**: Local component state with hooks
- **API Integration**: Fetch API for backend communication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 📞 Contact

For questions or suggestions, please open an issue in this repository.
