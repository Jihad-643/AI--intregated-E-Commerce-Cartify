# E-Commerce Backend API

This is the backend API for the e-commerce application built with:

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - Database (using MongoDB Atlas, not Mongoose)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory and add your MongoDB Atlas connection string:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority
DB_NAME=ecommerce
PORT=5000
```

**To get your MongoDB Atlas connection string:**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (if you haven't already)
3. Click "Connect" on your cluster
4. Choose "Connect your application"
5. Copy the connection string and replace `<username>` and `<password>` with your credentials

### 3. Run the Server

**Development mode (with auto-restart):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### General

- `GET /` - API information
- `GET /api/health` - Health check

### Products

- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product
- `GET /api/products/:id` - Get a product by ID

### Users

- `GET /api/users` - Get all users

### Orders

- `GET /api/orders` - Get all orders

## Database Collections

The API uses the following MongoDB collections:

- `products` - Product catalog
- `users` - User accounts
- `orders` - Customer orders

## Notes

- This project uses the native MongoDB driver (not Mongoose)
- Make sure to whitelist your IP address in MongoDB Atlas
- The server uses ES6 modules (`type: "module"` in package.json)
- CORS is enabled for frontend communication
