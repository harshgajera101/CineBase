# 🎬 CineBase - IMDb Top 250 Movies

A full-stack MERN application to browse, search, and manage the top 250 IMDb movies.

## ✨ Features

- 📊 Browse 250 top-rated movies
- 🔍 Search by title, genre, or tagline
- 🎯 Sort by rank, rating, year, or title
- 📄 Pagination (20 movies per page)
- 🔐 User authentication (JWT)
- ⚙️ Admin dashboard (CRUD operations)
- 🌙 Dark mode UI
- 📱 Responsive design

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Material-UI (MUI)
- React Router
- Axios
- Context API

**Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt. js

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/harshgajera101/CineBase.git
cd CineBase
```

2. Install dependencies:
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

3. Set up environment variables:

Create `server/.env`:
```env
PORT=3001
MONGO_URI=mongodb://localhost:27017/cinebase
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:3001/api
```

4. Import movie data:
- Open MongoDB Compass
- Connect to `mongodb://localhost:27017`
- Create database `cinebase` with collection `movies`
- Import `IMDB_Top_250_Movies.csv`

5. Run the application: 

```bash
# Backend (from server folder)
npm run dev

# Frontend (from client folder)
npm run dev
```

6. Access:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## 👥 Default Users

**Regular User:**
- Email: user@cinebase.com
- Password: user123

**Admin:**
- Email: admin@cinebase.com
- Password: admin123

## 📸 Screenshots

![Home Page](screenshots/home.png)
![Movie Detail](screenshots/detail.png)
![Admin Dashboard](screenshots/admin.png)

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📝 License

MIT License

## 👤 Author

**Harsh Gajera**
- GitHub: [@harshgajera101](https://github.com/harshgajera101)

---
