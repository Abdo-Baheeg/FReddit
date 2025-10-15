# FReddit - MERN Stack Reddit Clone

A full-stack Reddit clone built with MongoDB, Express.js, React, and Node.js.

## Features

- User authentication (register/login)
- Create, read, and delete posts
- Comment on posts
- Upvote/downvote posts and comments
- Subreddit organization
- User karma system

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client

## Project Structure

```
FReddit/
├── backend/
│   ├── models/          # Database models
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Comment.js
│   ├── routes/          # API routes
│   │   ├── userRoutes.js
│   │   ├── postRoutes.js
│   │   └── commentRoutes.js
│   ├── middleware/      # Custom middleware
│   │   └── auth.js
│   ├── server.js        # Entry point
│   ├── .env            # Environment variables
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/  # React components
│   │   │   └── Navbar.js
│   │   ├── pages/       # Page components
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── CreatePost.js
│   │   │   └── PostDetail.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
└── package.json         # Root package.json
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FReddit
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   
   Update `backend/.env` with your MongoDB URI and JWT secret:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/freddit
   JWT_SECRET=your_secret_key_here
   NODE_ENV=development
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   ```bash
   # If using local MongoDB
   mongod
   ```

### Running the Application

**Development mode (both frontend and backend):**
```bash
npm run dev
```

**Or run separately:**

Backend only:
```bash
npm run server
```

Frontend only:
```bash
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/me` - Get current user (protected)

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (protected)
- `PUT /api/posts/:id/vote` - Vote on post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)

### Comments
- `GET /api/comments/post/:postId` - Get comments for post
- `POST /api/comments` - Create comment (protected)
- `PUT /api/comments/:id/vote` - Vote on comment (protected)
- `DELETE /api/comments/:id` - Delete comment (protected)

## License

ISC

## Author

Your Name
