# 🎓 CollegeFinder — Full-Stack College Recommendation System

A complete MERN-stack web application that recommends best-fit colleges to students based on their academic scores, entrance exam ranks, budget, category, and preferences.

---

## 📁 Project Structure

```
college-recommender/
├── backend/
│   ├── middleware/
│   │   └── auth.js              # JWT auth middleware
│   ├── models/
│   │   ├── User.js              # User schema (students + admin)
│   │   └── College.js           # College schema with courses, fees, placements
│   ├── routes/
│   │   ├── auth.js              # Register, Login, Profile APIs
│   │   ├── colleges.js          # CRUD + filter college APIs
│   │   ├── recommend.js         # Smart recommendation engine
│   │   ├── users.js             # Save, view, dashboard APIs
│   │   └── admin.js             # Admin-only management APIs
│   ├── server.js                # Express app entry point
│   ├── seed.js                  # DB seeder (20 real colleges)
│   ├── package.json
│   └── .env.example             # Environment variable template
│
└── frontend/
    ├── index.html               # Landing page + recommendation form
    ├── css/
    │   └── style.css            # Complete glassmorphism UI
    ├── js/
    │   ├── api.js               # API helper + college card renderer
    │   ├── auth.js              # JWT auth state management
    │   └── main.js              # Landing page logic + AI chatbot
    └── pages/
        ├── login.html           # Student login
        ├── register.html        # Student registration
        ├── dashboard.html       # Student dashboard + charts
        ├── colleges.html        # Browse + filter all colleges
        ├── recommendations.html # Recommendation results page
        ├── college-detail.html  # Full college detail + tabs
        ├── compare.html         # Side-by-side college comparison
        ├── admin.html           # Admin panel (manage colleges/users)
        ├── about.html           # About page
        └── contact.html         # Contact page
```

---

## 🚀 How to Run

### Prerequisites
- **Node.js** v16+ — https://nodejs.org
- **MongoDB** — Install locally or use MongoDB Atlas (free cloud)

---

### Step 1 — Install MongoDB (if not already)

**Option A: Local MongoDB**
- Download from https://www.mongodb.com/try/download/community
- Install and start the service:
  ```bash
  # macOS
  brew tap mongodb/brew && brew install mongodb-community && brew services start mongodb-community

  # Ubuntu/Debian
  sudo apt install mongodb && sudo systemctl start mongodb

  # Windows — use the installer, MongoDB runs as a service automatically
  ```

**Option B: MongoDB Atlas (Cloud — Free)**
1. Go to https://cloud.mongodb.com → Create free account
2. Create a free cluster
3. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/college_recommender`
4. Use it in Step 3 below

---

### Step 2 — Install Backend Dependencies

```bash
cd college-recommender/backend
npm install
```

---

### Step 3 — Configure Environment

Copy the example file and edit it:

```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/college_recommender
JWT_SECRET=mysupersecretkey123changeme
JWT_EXPIRE=7d
```

> If using Atlas, replace `MONGODB_URI` with your Atlas connection string.

---

### Step 4 — Seed the Database

This inserts 20 real colleges + 1 admin user + 1 test student:

```bash
cd college-recommender/backend
node seed.js
```

You should see:
```
✅ MongoDB Connected
🗑️  Cleared existing data
✅ Inserted 20 colleges
✅ Admin user created: admin@collegefinder.com / admin123
✅ Test student created: student@test.com / student123
🎉 Database seeded successfully!
```

---

### Step 5 — Start the Backend Server

```bash
cd college-recommender/backend
npm start
```

Server starts at: **http://localhost:5000**

> For development with auto-restart: `npm run dev` (requires nodemon)

---

### Step 6 — Open the Frontend

The backend serves the frontend automatically.

Open your browser and go to:

**http://localhost:5000**

---

## 🔑 Demo Login Credentials

| Role    | Email                        | Password    |
|---------|------------------------------|-------------|
| Student | student@test.com             | student123  |
| Admin   | admin@collegefinder.com      | admin123    |

---

## ✨ Features

| Feature                  | Description                                                       |
|--------------------------|-------------------------------------------------------------------|
| 🔍 Recommendation Engine | Scores colleges by placement, fees, ranking, state, eligibility  |
| 🔐 JWT Authentication    | Secure login/register with bcrypt password hashing               |
| 📊 Student Dashboard     | Charts for fee comparison & placement stats                      |
| 🔖 Save Colleges         | Bookmark and revisit colleges                                     |
| ⚖️ Compare Tool          | Compare up to 4 colleges side-by-side on 15+ parameters          |
| ⚙️ Admin Panel           | Full CRUD for colleges, view users, platform analytics           |
| 🤖 AI Chatbot            | Natural language search — "affordable AI/ML in Odisha"           |
| 📱 Responsive UI         | Works on mobile, tablet, desktop                                 |
| ⭐ Reviews               | Students can rate and review colleges                            |

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint             | Description           |
|--------|----------------------|-----------------------|
| POST   | /api/auth/register   | Register new student  |
| POST   | /api/auth/login      | Login                 |
| GET    | /api/auth/me         | Get current user      |
| PUT    | /api/auth/profile    | Update profile        |

### Colleges
| Method | Endpoint                   | Description              |
|--------|----------------------------|--------------------------|
| GET    | /api/colleges              | Get all colleges (filter)|
| GET    | /api/colleges/featured     | Get featured colleges    |
| GET    | /api/colleges/:id          | Get single college       |
| POST   | /api/colleges/:id/review   | Add review (auth)        |

### Recommend
| Method | Endpoint        | Description                    |
|--------|-----------------|--------------------------------|
| POST   | /api/recommend  | Get ranked recommendations     |

### Users (auth required)
| Method | Endpoint               | Description           |
|--------|------------------------|-----------------------|
| GET    | /api/users/dashboard   | Dashboard data        |
| POST   | /api/users/save/:id    | Toggle save college   |
| GET    | /api/users/saved       | Get saved colleges    |

### Admin (admin role required)
| Method | Endpoint               | Description           |
|--------|------------------------|-----------------------|
| GET    | /api/admin/stats       | Platform analytics    |
| POST   | /api/admin/college     | Add college           |
| PUT    | /api/admin/college/:id | Update college        |
| DELETE | /api/admin/college/:id | Delete college        |
| GET    | /api/admin/users       | Get all students      |

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript, Chart.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Auth**: JWT (jsonwebtoken), bcryptjs
- **Design**: Glassmorphism UI, CSS custom properties

---

## 💼 Resume Description

> Developed a full-stack College Recommendation System using Node.js, Express.js, MongoDB, and JavaScript that suggests best-fit colleges based on academic scores, entrance exam ranks, budget, and preferences. Implemented RESTful APIs, JWT authentication, smart scoring algorithm, admin dashboard, Chart.js analytics, and responsive glassmorphism UI.

---

## 🔮 Future Improvements

- ML-based recommendation using Python + scikit-learn
- Real-time cutoff updates via web scraping
- Email notifications for admission deadlines
- Scholarship recommendation module
- Student forum / discussion boards
- PWA (Progressive Web App) support
