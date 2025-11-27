# Shop ERP - Backend API Server

This is the backend API server for the Shop ERP System, built with Express.js and Node.js.

## Features

- **Authentication**: User registration and login with JWT tokens
- **Authorization**: Protected routes with JWT middleware
- **Mock Data**: Built-in mock users for development and testing
- **CORS Support**: Configured to work with the Vue frontend
- **Error Handling**: Comprehensive error handling and logging

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

## Configuration

### Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-very-secret-key-for-shop-erp-project-secure

# CORS Configuration (if needed)
CORS_ORIGIN=http://localhost:5173
```

**Note**: For production, use a strong and unique JWT_SECRET. Never commit `.env` files to version control.

## Running the Server

### Development Mode

```bash
npm run dev
```

Or with Node directly:
```bash
node server.js
```

The server will start on `http://localhost:3001` by default.

### Check Server Status

Once the server is running, you can verify it's working by visiting:
```
http://localhost:3001/api/test
```

## API Endpoints

### Authentication Endpoints

#### 1. **User Registration**
- **Endpoint**: `POST /api/auth/register`
- **Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response**: User object with generated ID and role

#### 2. **User Login**
- **Endpoint**: `POST /api/auth/login`
- **Body**:
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```
- **Response**: JWT token and user profile
- **Mock Credentials**:
  - **Admin**: Email: `admin@example.com`, Password: `password123`
  - **Staff**: Email: `staff@example.com`, Password: `password123`

#### 3. **Get Current User Profile**
- **Endpoint**: `GET /api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Current user profile

#### 4. **Logout**
- **Endpoint**: `POST /api/auth/logout`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Logout confirmation

### Test Endpoint

- **Endpoint**: `GET /api/test`
- **Response**: Server status confirmation

## Connecting with Frontend

Configure your Vue frontend to communicate with the backend:

1. In the client `.env` file, set:
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

2. Make sure both client (port 5173) and server (port 3001) are running simultaneously.

## Mock Data

The server includes mock user data for testing:

| Role  | Email              | Password    |
|-------|-------------------|------------|
| Admin | admin@example.com | password123 |
| Staff | staff@example.com | password123 |

**Note**: New user registrations are not persisted across server restarts. To save registered users, connect the backend to a real database.

## Project Structure

```
server/
├── server.js           # Main server file with all routes
├── package.json        # Dependencies and scripts
├── README.md          # This file
├── .env.example       # Environment variables template
└── node_modules/      # Installed dependencies
```

## Authentication Flow

1. User registers or logs in
2. Server returns a JWT token (valid for 1 hour)
3. Client stores the token (localStorage or sessionStorage)
4. For protected routes, client sends token in Authorization header: `Bearer <token>`
5. Server verifies the token and grants access if valid

## Token Expiration

- Default token expiration: **1 hour**
- To change, modify the `expiresIn` option in `/api/auth/login` route

## Debugging

The server includes comprehensive logging. Check the console output for:
- All incoming requests
- Authentication attempts
- Token verification results
- Error messages

## Future Enhancements

- [ ] Database integration (MongoDB, PostgreSQL, etc.)
- [ ] User role management
- [ ] Product management endpoints
- [ ] Customer management endpoints
- [ ] Sales and inventory endpoints
- [ ] Email notifications
- [ ] Request validation middleware
- [ ] Rate limiting

## Troubleshooting

### Server won't start
- Check if port 3001 is already in use
- Try changing the PORT in .env

### CORS errors
- Ensure CORS is enabled in server.js
- Check CORS_ORIGIN matches your frontend URL

### Token errors
- Ensure JWT_SECRET is the same on server and in .env
- Check token expiration (valid for 1 hour by default)

## License

ISC

## Support

For issues or questions, please check the main project README at `../README.md`
