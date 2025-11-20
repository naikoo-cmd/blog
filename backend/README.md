# Backend API for MyBlog

This is the backend server for the MyBlog application, providing authentication and admin functionality.

## Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A strong random string for JWT signing
   - `PORT`: Server port (default: 5000)
   - `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost:5173)

3. **Create Admin User**
   ```bash
   node scripts/createAdmin.js
   ```
   
   This creates an admin user with:
   - Username: `admin`
   - Password: `admin123`
   
   ⚠️ **Important**: Change the default password after first login!

4. **Start the Server**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login with username and password
  - Body: `{ "username": "admin", "password": "admin123" }`
  - Returns: `{ "success": true, "token": "jwt-token", "user": {...} }`

- `GET /api/auth/verify` - Verify JWT token
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ "success": true, "user": {...} }`

### Admin Routes (Protected)

All admin routes require authentication via the `authenticate` middleware.

- `GET /api/admin/dashboard` - Example protected route
  - Headers: `Authorization: Bearer <token>`

## Project Structure

```
backend/
├── models/
│   └── User.js          # User model with password hashing
├── routes/
│   ├── auth.js          # Authentication routes (login, verify)
│   └── admin.js         # Protected admin routes
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── scripts/
│   └── createAdmin.js   # Script to create initial admin user
├── server.js            # Express server setup
├── package.json
└── .env                 # Environment variables (not in git)
```

## Security Features

- Passwords are hashed using bcryptjs
- JWT tokens for session management
- Protected admin routes with authentication middleware
- CORS configured for frontend access

## Notes

- This is a personal blog with a single admin user
- Keep the logic simple and minimal
- JWT tokens expire after 4 hours

