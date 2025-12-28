# 🎬 CineBase - IMDb Top 250 Movies

A full-stack MERN application to browse, search, and manage the top 250 IMDb movies with role-based authentication.

## ✨ Features

- 🎥 Browse 250 top-rated movies with pagination (20 per page)
- 🔍 Advanced search by title, genre, and tagline
- 🎯 Sort by rank, rating, year, or title
- 🔐 JWT-based authentication & authorization
- ⚙️ Admin dashboard with CRUD operations & validation
- 🌙 Dark mode with Material-UI
- 📱 Fully responsive design

## 🛠️ Tech Stack

**Frontend:** React 19 • Material-UI • React Router • Axios • Context API  
**Backend:** Node.js • Express • MongoDB • JWT • bcrypt  

## 🌐 Live Demo

**🎬 [View Live Application](https://cinebase-x8we.onrender.com/)** • Browse 250+ movies with full authentication

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)

### Installation

```bash
# Clone repository
git clone https://github.com/harshgajera101/CineBase.git
cd CineBase

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install
```

### Environment Setup

**`server/.env`:**
```env
PORT=3001
MONGO_URI=mongodb://localhost:27017/cinebase
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

**`client/.env`:**
```env
VITE_API_URL=http://localhost:3001/api
```

### Database Setup

Import movie data into MongoDB:
```bash
# Using MongoDB Compass: 
# 1. Connect to mongodb://localhost:27017
# 2. Create database:  cinebase
# 3. Import IMDB_Top_250_Movies.csv into 'movies' collection
```

### Run Application

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

**Access:** Frontend at `http://localhost:5173`

## 🔑 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| User | user@cinebase.com | user123 |
| Admin | admin@cinebase.com | admin123 |

## 📡 API Endpoints

### Public Routes
```
GET    /api/movies              # Get all movies (pagination, sorting)
GET    /api/movies/search       # Search movies (title, genre, tagline)
GET    /api/movies/:id          # Get single movie
POST   /api/auth/register       # Register new user
POST   /api/auth/login          # Login user
```

### Protected Routes (Admin Only)
```
POST   /api/movies              # Create movie
PUT    /api/movies/: id          # Update movie
DELETE /api/movies/:id          # Delete movie
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `sortBy` - Sort field (rank | name | rating | year)
- `order` - Sort order (asc | desc)

**Example:**
```bash
GET /api/movies?page=1&limit=20&sortBy=rating&order=desc
GET /api/movies/search?q=godfather
```

## 🏗️ Project Structure

```
CineBase/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Context API (Auth, Theme)
│   │   ├── pages/         # Page components
│   │   └── utils/         # API utilities
│   └── package.json
├── server/                # Express backend
│   ├── config/           # Database configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Auth & role middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   └── package.json
└── IMDB_Top_250_Movies.csv
```

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control (User/Admin)
- Protected admin routes
- CORS configuration
- Input validation

## 👤 Author

**Harsh Gajera**  
GitHub: [@harshgajera101](https://github.com/harshgajera101)

## 📝 License

MIT License

---

⭐ Star this repo if you found it helpful! 