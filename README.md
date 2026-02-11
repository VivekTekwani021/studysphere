# 🎓 StudySphere - AI-Powered Learning Management System

A comprehensive full-stack education platform that helps students track progress, generate personalized study content, manage attendance, and prepare for placements with AI-powered tools.

---

## 🚀 Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB** | Database (via Mongoose ODM) |
| **Socket.io** | Real-time communication |
| **JWT** | Authentication tokens |
| **Groq API** | AI-powered content generation |
| **node-cron** | Scheduled task automation |
| **PDFKit** | PDF document generation |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React** | UI library |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Styling framework |
| **Framer Motion** | Animations |
| **Axios** | HTTP client |
| **React Router** | Navigation |
| **Socket.io Client** | Real-time features |

---

## ✨ Key Features

### 🎯 1. Smart Attendance Tracking
- **Dual Mode**: Separate tracking for School (daily) and College (subject-wise)
- **Statistics Dashboard**: Present/Absent counts, attendance percentage
- **Visual Analytics**: Color-coded percentage indicators
- **Mark Attendance**: Quick mark present/absent functionality

### 📚 2. AI-Powered Learning Hub
- **Personalized Explanations**: AI generates topic explanations based on user level
- **Adaptive Learning**: Content adapts to beginner/intermediate/advanced levels
- **Code Examples**: Programming topics include C++ code samples
- **Learning History**: Track all topics learned with timestamps

### 📝 3. Smart Quiz System
- **AI-Generated Quizzes**: Dynamic MCQ generation for any topic
- **Mastery Tracking**: Categorizes performance as Strong (≥80%), Average (50-79%), Weak (<50%)
- **Instant Feedback**: AI-powered explanations for wrong answers
- **Progress Analytics**: Track quiz scores and weak topics

### 🗺️ 4. Personalized Roadmap Engine
- **AI-Generated Roadmaps**: Custom study plans based on goals and weak topics
- **Daily Task Scheduler**: Automatic daily task generation via cron job
- **Spaced Repetition**: Topics revisited at optimal intervals
- **Progress Tracking**: Mark tasks complete, track completion rates

### 💼 5. Placement Portal (College Students)
#### 📊 Application Tracking
- **Track Applications**: Monitor job applications through all stages
- **Status Management**: Applied → Test → Interview → Selected/Rejected
- **Application Details**: Company, role, package, location
- **Filter & Search**: Filter by status, search applications
- **Quick Updates**: Update application status with dropdown

#### 📅 Placement Activities & Timeline
- **Activity Types**: Drives, Training, Mock Interviews, Workshops, Deadlines
- **Registration System**: Register/unregister for activities
- **Participant Tracking**: See registration counts and limits
- **Upcoming View**: Focus on future activities
- **Color-Coded**: Visual distinction by activity type

#### 🎯 Resume Analyzer
- **AI-Powered Scoring**: Get resume score out of 100
- **Detailed Feedback**: Section-wise analysis and improvement suggestions
- **ATS Optimization**: Tips for passing Applicant Tracking Systems

### 🎥 6. Study Rooms (Real-time Collaboration)
- **Video Conferencing**: Peer-to-peer video calls
- **Screen Sharing**: Share your screen for collaborative learning
- **Real-time Chat**: Text messaging within rooms
- **Room Management**: Create, join, leave study rooms
- **Participant List**: See who's in the room

### 🎯 7. Habit Tracking
- **Custom Habits**: Create study habits, exercise routines, etc.
- **Streak Tracking**: Visual motivation through consecutive days
- **Daily Check-ins**: Mark habits complete each day
- **Progress Visualization**: See your consistency over time

### 📄 8. PDF Notes Generation
- **Downloadable Notes**: Generate PDF notes for any topic
- **Offline Study**: Access content without internet
- **Structured Format**: Headings, bullet points, code blocks

---

## 📁 Project Structure

```
StudySphere/
├── server/                    # Backend (Node.js/Express)
│   ├── server.js             # Entry point
│   ├── package.json          # Dependencies
│   ├── .env                  # Environment variables
│   └── src/
│       ├── app.js            # Express app configuration
│       ├── config/
│       │   ├── db.js         # MongoDB connection
│       │   └── socket.js     # Socket.io configuration
│       ├── controllers/      # Request handlers
│       │   ├── auth.controller.js
│       │   ├── attendance.controller.js
│       │   ├── learning.controller.js
│       │   ├── quiz.controller.js
│       │   ├── placement.controller.js
│       │   ├── roadmap.controller.js
│       │   └── ...
│       ├── models/           # Mongoose schemas
│       │   ├── User.model.js
│       │   ├── Attendance.model.js
│       │   ├── Application.model.js
│       │   ├── PlacementActivity.model.js
│       │   └── ...
│       ├── routes/           # API endpoints
│       ├── middleware/       # Auth, CORS, error handling
│       ├── services/         # AI & external APIs
│       ├── cron/            # Scheduled tasks
│       └── utils/           # Helper functions
│
└── frontend_vk/             # Frontend (React/Vite)
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── main.jsx         # Entry point
        ├── App.jsx          # Root component
        ├── api/             # API integration
        ├── components/      # Reusable components
        │   ├── common/      # Buttons, Cards, etc.
        │   └── layout/      # Sidebar, Navbar, Layout
        ├── context/         # React Context (Auth, Theme)
        ├── pages/           # Route components
        │   ├── auth/        # Login, Register, Onboarding
        │   ├── attendance/  # Attendance tracking
        │   ├── learning/    # Learning hub
        │   ├── placement/   # Placement portal
        │   ├── roadmap/     # Roadmap
        │   └── ...
        └── utils/           # Helper functions
```

---

## 🔌 API Endpoints

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register new user | ❌ |
| POST | `/login` | Login & get JWT token | ❌ |
| GET | `/me` | Get current user profile | ✅ |

### 👤 Onboarding (`/api/onboarding`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/complete` | Complete onboarding (education level) | ✅ |

### 📅 Attendance (`/api/attendance`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/mark` | Mark attendance (school/college) | ✅ |
| GET | `/stats` | Get attendance statistics | ✅ |
| POST | `/subject` | Mark subject attendance (college) | ✅ |

### 📚 Learning (`/api/learning`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/content` | Get AI explanation for topic | ✅ |
| POST | `/complete` | Mark topic as learned | ✅ |

### 📝 Quiz (`/api/quiz`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/generate` | Generate AI quiz | ✅ |
| POST | `/submit` | Submit quiz & get results | ✅ |

### 💼 Placement (`/api/placement`)

#### Applications
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/applications` | Create new application | ✅ |
| GET | `/applications/my` | Get my applications | ✅ |
| PUT | `/applications/:id` | Update application | ✅ |
| DELETE | `/applications/:id` | Delete application | ✅ |
| POST | `/applications/:id/interview` | Add interview round | ✅ |
| GET | `/applications/admin/all` | Get all applications (Admin) | ✅ Admin |
| GET | `/applications/admin/selected` | Get selected students (Admin) | ✅ Admin |

#### Activities
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/activities` | Get all activities | ✅ |
| POST | `/activities` | Create activity (Admin) | ✅ Admin |
| PUT | `/activities/:id` | Update activity (Admin) | ✅ Admin |
| DELETE | `/activities/:id` | Delete activity (Admin) | ✅ Admin |
| POST | `/activities/:id/register` | Register for activity | ✅ |
| POST | `/activities/:id/unregister` | Unregister from activity | ✅ |

### 📄 Resume (`/api/resume`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/analyze` | Analyze resume with AI | ✅ |

### 🗺️ Roadmap (`/api/roadmap`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/generate` | Generate personalized roadmap | ✅ |
| GET | `/today` | Get today's tasks | ✅ |
| POST | `/complete` | Mark task complete | ✅ |

### 🎥 Study Rooms (`/api/rooms`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/create` | Create study room | ✅ |
| GET | `/` | Get all active rooms | ✅ |
| POST | `/:id/join` | Join room | ✅ |
| POST | `/:id/leave` | Leave room | ✅ |

### 📄 PDF (`/api/pdf`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/generate` | Generate PDF notes | ✅ |

---

## ⚙️ Environment Variables

### Backend (`.env` in `server/`)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/studysphere
# Or MongoDB Atlas:


JWT_SECRET=your_jwt_secret_key_here
GROQ_API_KEY=your_groq_api_key_here
```

### Frontend (`.env` in `frontend_vk/`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ 
- **MongoDB** (local or Atlas)
- **Groq API Key** (for AI features)

### Installation

#### 1. Clone Repository
```bash
git clone <repo-url>
cd StudySphere
```

#### 2. Backend Setup
```bash
cd server
npm install

# Create .env file with variables above
# Start server
npm start          # Production
npm run dev        # Development (with nodemon)
```

Server runs at: `http://localhost:5000`

#### 3. Frontend Setup
```bash
cd frontend_vk
npm install

# Create .env file with VITE_API_URL
# Start dev server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 👤 User Model

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  educationLevel: "School" | "College",
  course: String,
  stream: String,
  role: "student" | "admin",
  isOnboarded: Boolean,
  
  // Learning tracking
  learningHistory: [{
    topicName: String,
    quizScore: Number,
    masteryStatus: "Strong" | "Average" | "Weak",
    completedAt: Date
  }],
  weakTopics: [String],
  totalStudyTime: Number,
  
  // Attendance (School)
  attendanceRecords: [{
    date: Date,
    status: "Present" | "Absent"
  }],
  
  // Attendance (College)
  subjects: [{
    name: String,
    presentClasses: Number,
    totalClasses: Number
  }]
}
```

---

## 🎨 UI/UX Features

- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Works on mobile, tablet, desktop
- **Smooth Animations**: Framer Motion for interactive UI
- **Color-Coded Status**: Visual indicators for attendance, quiz scores, application status
- **Interactive Components**: Hover effects, transitions, loading states
- **Modern Design**: Indigo/purple theme with glassmorphism effects

---

## 🔒 Security Features

- **JWT Authentication**: Stateless token-based auth
- **Password Hashing**: bcryptjs with salt rounds
- **Protected Routes**: Middleware validates tokens
- **CORS Configuration**: Controlled cross-origin access
- **Role-Based Access**: Admin-only routes for management
- **Input Validation**: Mongoose schema validation

---

## 🤖 AI Integration

### Groq API (Primary)
- **Model**: LLaMA 3.1 70B
- **Use Cases**: 
  - Topic explanations
  - Quiz generation
  - Roadmap creation
  - Resume analysis
- **Configuration**: Temperature 0.6, Max tokens 800

---

## 📱 Real-time Features (Socket.io)

- **Study Rooms**: Video calls, screen sharing, chat
- **Live Updates**: Real-time participant tracking
- **Event Handling**: Join/leave notifications

---

## 🔄 Cron Jobs

| Job | Schedule | Purpose |
|-----|----------|---------|
| Roadmap Refresh | Daily | Updates user roadmaps based on progress |

---

## 🧪 Testing

### Using Postman/Thunder Client

1. **Register** → `POST /api/auth/register`
2. **Login** → `POST /api/auth/login` → Copy JWT token
3. **Add Header** → `Authorization: Bearer <token>`
4. **Test protected routes**

### Sample Requests

**Register:**
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Get AI Explanation:**
```json
POST /api/learning/content
{
  "topic": "Binary Search",
  "level": "beginner",
  "prompt": "explain with examples"
}
```

**Create Application:**
```json
POST /api/placement/applications
{
  "company": "Google",
  "role": "Software Engineer",
  "package": "20 LPA",
  "location": "Bangalore"
}
```

---

## 📦 Key Dependencies

### Backend
```json
{
  "express": "^5.2.1",
  "mongoose": "^9.1.1",
  "jsonwebtoken": "^9.0.3",
  "bcryptjs": "^3.0.3",
  "socket.io": "^4.8.1",
  "cors": "^2.8.5",
  "dotenv": "^17.2.3",
  "node-cron": "^4.2.1",
  "pdfkit": "^0.17.2",
  "axios": "^1.13.2"
}
```

### Frontend
```json
{
  "react": "^18.3.1",
  "react-router-dom": "^7.1.3",
  "axios": "^1.7.9",
  "framer-motion": "^12.0.1",
  "socket.io-client": "^4.8.1",
  "tailwindcss": "^4.0.14",
  "lucide-react": "^0.469.0",
  "react-hot-toast": "^2.4.1",
  "clsx": "^2.1.1"
}
```

---

## 🎯 Future Enhancements

- [ ] Admin dashboard for activity management
- [ ] Calendar view for placement activities
- [ ] Email notifications for deadlines
- [ ] Mobile app (React Native)
- [ ] Collaborative notes feature
- [ ] Discussion forums
- [ ] Gamification (badges, leaderboards)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

ISC License

---

## 👨‍💻 Author

**Vivek Tekwani**

Created with ❤️ for students everywhere

---

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Contact: [Your Email]

---

<p align="center">
  <strong>StudySphere - Empowering Students Through AI-Powered Learning</strong>
</p>
