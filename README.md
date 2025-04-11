# Job Track Career Compass - Backend API

This is the backend API for the Job Track Career Compass application. It provides RESTful endpoints for managing user authentication, job applications, and resume tracking.

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas connection)

### Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/job-track-db
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=30d
   ```

3. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/users` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)

### Jobs

- `GET /api/jobs` - Get all jobs for current user (protected)
- `GET /api/jobs/:id` - Get specific job (protected)
- `POST /api/jobs` - Create a new job (protected)
- `PUT /api/jobs/:id` - Update a job (protected)
- `DELETE /api/jobs/:id` - Delete a job (protected)

### Resumes

- `GET /api/resumes` - Get all resumes for current user (protected)
- `GET /api/resumes/:id` - Get specific resume (protected)
- `POST /api/resumes` - Create a new resume (protected)
- `DELETE /api/resumes/:id` - Delete a resume (protected)

## Authentication

The API uses JWT (JSON Web Token) for authentication. Protected routes require a valid token to be included in the Authorization header:

```
Authorization: Bearer <token>
```

## Data Models

### User

- name: String (required)
- email: String (required, unique)
- password: String (required, min 6 chars)
- profilePicture: String

### Job

- user: ObjectId (reference to User)
- company: String (required)
- role: String (required)
- status: String (enum: "Applied", "Interview", "Offer", "Rejected")
- dateApplied: Date (required)
- link: String
- description: String
- notes: String
- location: String
- salary: String
- contactPerson: String
- contactEmail: String

### Resume

- user: ObjectId (reference to User)
- name: String (required)
- url: String (required)
- timestamps: true "# Render-backend" 
