# StudySphere Backend

A comprehensive **Node.js/Express.js** backend for the StudySphere education platform — an AI-powered learning management system that helps students track progress, generate personalized study content, and prepare for placements.

---

## 🚀 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB** | Database (via Mongoose ODM) |
| **JWT** | Authentication tokens |
| **Groq API** | AI-powered content generation |
| **node-cron** | Scheduled task automation |
| **PDFKit** | PDF document generation |

---

## � Theoretical Concepts & Services

This section explains the **core concepts** and **architectural decisions** behind each service in StudySphere.

---

### 🎓 1. AI-Powered Learning Service

**Concept: Personalized Adaptive Learning**

Traditional education follows a one-size-fits-all approach. StudySphere implements **Personalized Adaptive Learning (PAL)** — a methodology where content adapts to each student's learning pace, style, and comprehension level.

**How It Works:**
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  User requests  │ ──► │  AI analyzes    │ ──► │  Tailored       │
│  topic + level  │     │  user profile   │     │  explanation    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

**Key Principles:**
- **Scaffolded Learning**: Breaks complex topics into digestible steps
- **Analogical Reasoning**: Uses real-world analogies to explain abstract concepts
- **Multi-modal Output**: Provides text explanations + code examples
- **Level Adaptation**: Adjusts complexity based on user's stated level (beginner/intermediate/advanced)

**Service Implementation (`ai.service.js`):**
- Uses **Groq API** with **LLaMA 3.1** model for fast inference
- Structured prompts ensure consistent output format
- Temperature set to `0.6` for balanced creativity vs accuracy
- Max tokens limited to `800` for concise responses

---

### 📊 2. Adaptive Quiz System

**Concept: Mastery-Based Assessment**

Instead of simple pass/fail grading, StudySphere uses **Mastery Learning Theory** (Benjamin Bloom, 1968). Students are categorized into mastery levels based on quiz performance.

**Mastery Levels:**
| Level | Score Range | Meaning |
|-------|-------------|---------|
| **Strong** | 80-100% | Topic fully understood |
| **Average** | 50-79% | Needs reinforcement |
| **Weak** | 0-49% | Requires re-learning |

**Flow:**
```
                    ┌───────────────────┐
                    │  Generate Quiz    │
                    │  (AI creates MCQs)│
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │  User Attempts    │
                    │  Quiz             │
                    └─────────┬─────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
    ┌──────────┐       ┌──────────┐       ┌──────────┐
    │  Strong  │       │  Average │       │   Weak   │
    │  ≥ 80%   │       │  50-79%  │       │  < 50%   │
    └──────────┘       └──────────┘       └──────────┘
          │                   │                   │
          ▼                   ▼                   ▼
    ┌──────────┐       ┌──────────┐       ┌──────────┐
    │  Move to │       │  Review  │       │  Added   │
    │  Next    │       │  & Retry │       │  to Weak │
    │  Topic   │       │          │       │  Topics  │
    └──────────┘       └──────────┘       └──────────┘
```

**Why AI-Generated Quizzes?**
- **Dynamic Content**: New questions each time (no memorization gaming)
- **Context-Aware**: Questions match the explanation just given
- **Instant Feedback**: Wrong answers get AI-powered explanations

---

### 🗺️ 3. Personalized Roadmap Engine

**Concept: Spaced Repetition + Weak Topic Prioritization**

The roadmap system combines two learning science principles:

1. **Spaced Repetition**: Topics are revisited at increasing intervals to strengthen long-term memory
2. **Weak-First Strategy**: Topics marked as "Weak" are prioritized in the roadmap

**Architecture:**
```
┌────────────────────────────────────────────────────────┐
│                    ROADMAP ENGINE                       │
├────────────────────────────────────────────────────────┤
│                                                         │
│   ┌─────────────┐    ┌─────────────┐    ┌────────────┐ │
│   │ User's Weak │ ►  │ AI Roadmap  │ ►  │ Daily Task │ │
│   │ Topics List │    │ Generator   │    │ Scheduler  │ │
│   └─────────────┘    └─────────────┘    └────────────┘ │
│         ▲                                      │       │
│         │                                      │       │
│         └──────────── Feedback Loop ◄──────────┘       │
│                                                         │
└────────────────────────────────────────────────────────┘
```

**Cron Job (`roadmap.cron.js`):**
- Runs daily at a scheduled time
- Analyzes each user's progress
- Regenerates/updates roadmap based on completed tasks
- Moves uncompleted tasks (creates backlog)

---

### 📈 4. Progress Tracking & Analytics

**Concept: Learning Analytics Dashboard**

Learning Analytics is the measurement, collection, and analysis of data about learners to optimize learning. StudySphere tracks:

| Metric | Purpose |
|--------|---------|
| `learningHistory` | What topics were learned & when |
| `quizScore` | Performance per topic |
| `masteryStatus` | Current understanding level |
| `weakTopics` | Areas needing improvement |
| `totalStudyTime` | Engagement measurement |
| `attendanceStreak` | Consistency tracking |

**Data Flow:**
```
User Actions ──► Event Logging ──► Aggregation ──► Insights
     │                                                  │
     │              ┌────────────────┐                  │
     └──────────────│ MongoDB Store  │◄─────────────────┘
                    └────────────────┘
```

---

### 🎯 5. Habit Tracking System

**Concept: Behavioral Psychology & Habit Loops**

Based on Charles Duhigg's **Habit Loop Theory**:
```
       ┌──────────┐
       │   CUE    │ ◄─── Reminder/Trigger
       └────┬─────┘
            │
       ┌────▼─────┐
       │ ROUTINE  │ ◄─── The habit action
       └────┬─────┘
            │
       ┌────▼─────┐
       │  REWARD  │ ◄─── Satisfaction/Progress
       └──────────┘
```

**Features:**
- **Streak Tracking**: Visual motivation through consecutive day counts
- **Completion Status**: Daily check-in for each habit
- **Flexible Habits**: Study habits, exercise, revision, etc.

---

### 💼 6. Placement Portal

**Concept: Career-Readiness Integration**

For B.Tech students, placement preparation is integral. The placement service:

**Access Control:**
- Only users with `isPlacementEnabled: true` can access
- Controlled via `placementOnly` middleware

**Features:**
- View upcoming placement opportunities
- Apply directly through the portal
- Track application status

---

### 📄 7. PDF Notes Generation

**Concept: Portable Learning Materials**

After learning a topic, students can generate downloadable PDF notes for:
- **Offline Study**: No internet needed
- **Quick Revision**: Condensed content
- **Sharing**: Send to peers

**Technology:**
- **PDFKit**: Node.js library for creating PDFs programmatically
- Content structured with headings, bullet points, code blocks

---

### 🔐 8. Authentication & Security

**Concept: Stateless JWT Authentication**

```
┌─────────┐     ┌─────────┐     ┌─────────┐
│  Login  │ ──► │  Server │ ──► │  JWT    │
│ Request │     │ Verify  │     │ Token   │
└─────────┘     └─────────┘     └────┬────┘
                                     │
     ┌───────────────────────────────┘
     ▼
┌─────────────────────────────────────────────┐
│  Token stored client-side (localStorage)    │
│  Sent with every request in Authorization   │
│  header: "Bearer <token>"                   │
└─────────────────────────────────────────────┘
```

**Security Measures:**
- **Password Hashing**: bcryptjs with salt rounds
- **Token Expiry**: JWTs expire after set duration
- **Protected Routes**: Middleware validates token on each request

---

### 🏗️ 9. Architectural Patterns

**MVC-like Architecture:**
```
┌──────────────────────────────────────────────────────────┐
│                     CLIENT (Frontend)                     │
└─────────────────────────────┬────────────────────────────┘
                              │ HTTP Requests
                              ▼
┌──────────────────────────────────────────────────────────┐
│                        ROUTES                            │
│  Define endpoints, apply middleware, call controllers    │
└─────────────────────────────┬────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────┐
│                      CONTROLLERS                          │
│  Handle request/response, orchestrate business logic     │
└─────────────────────────────┬────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│       SERVICES          │     │        MODELS           │
│  External APIs (AI)     │     │  Database schemas       │
│  Complex business logic │     │  Data validation        │
└─────────────────────────┘     └─────────────────────────┘
              │                               │
              └───────────────┬───────────────┘
                              ▼
┌──────────────────────────────────────────────────────────┐
│                     MongoDB Database                      │
└──────────────────────────────────────────────────────────┘
```

**Why This Structure?**
- **Separation of Concerns**: Each layer has a single responsibility
- **Testability**: Services can be mocked for unit tests
- **Scalability**: Easy to add new features without breaking existing ones
- **Maintainability**: Clear file organization

---

## �📁 Project Structure

```
server/
├── server.js              # Entry point - starts server & connects DB
├── package.json           # Dependencies & scripts
├── .env                   # Environment variables (not committed)
└── src/
    ├── app.js             # Express app configuration & route mounting
    ├── config/
    │   └── db.js          # MongoDB connection setup
    ├── controllers/       # Request handlers (business logic)
    ├── middleware/        # Auth, role-based access, error handling
    ├── models/            # Mongoose schemas
    ├── routes/            # API endpoint definitions
    ├── services/          # AI & external API integrations
    ├── cron/              # Scheduled background tasks
    └── utils/             # Helper functions (quiz gen, PDF, etc.)
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root with:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/studysphere
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
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
| POST | `/` | Complete user onboarding (education level, course, stream) | ✅ |

### 📅 Attendance (`/api/attendance`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/mark` | Mark attendance for a subject | ✅ |
| GET | `/stats` | Get attendance statistics | ✅ |

### 📚 Learning (`/api/learning`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/content` | Get AI-generated explanation for a topic | ✅ |
| POST | `/complete` | Mark a topic as learned & track progress | ✅ |

### 📝 Quiz (`/api/quiz`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/generate` | Generate AI-powered quiz on a topic | ✅ |
| POST | `/submit` | Submit quiz answers & get results | ✅ |

### 📄 PDF (`/api/pdf`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/generate` | Generate PDF notes for a topic | ✅ |

### 🎯 Habit Tracking (`/api/habit`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/create` | Create a new habit | ✅ |
| GET | `/` | Get all habits | ✅ |
| POST | `/complete` | Mark habit as complete | ✅ |

### 💼 Placement (`/api/placement`)

> *Requires `isPlacementEnabled: true` on user profile*

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get available placements | ✅ |
| POST | `/:id/apply` | Apply for a placement | ✅ |
| POST | `/create` | Create new placement (admin) | ✅ |

### 🗺️ Roadmap (`/api/roadmap`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/generate` | Generate personalized study roadmap | ✅ |
| GET | `/today` | Get today's scheduled tasks | ✅ |
| POST | `/complete` | Mark roadmap task as complete | ✅ |

---

## 🧠 Core Features

### 1. **AI-Powered Learning**
- Uses **Groq API** (LLaMA 3.1 model) for topic explanations
- Generates step-by-step explanations with real-world analogies
- Provides code examples (C++) for programming topics

### 2. **Smart Quiz Generation**
- AI generates MCQ quizzes based on topics
- Tracks mastery status: **Strong / Average / Weak**
- Stores learning history for personalized recommendations

### 3. **Personalized Roadmap**
- AI generates study roadmaps based on user's weak topics
- Cron job runs daily to update roadmaps
- Tracks completed vs pending tasks

### 4. **Progress Tracking**
- Learning history with quiz scores
- Weak topics identification
- Total study time tracking
- Attendance streaks

### 5. **PDF Notes Generation**
- Generate downloadable PDF notes for any topic
- Uses PDFKit for document creation

---

## 👤 User Model

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  educationLevel: "School" | "College",
  course: "btech" | "other",
  stream: String,
  isPlacementEnabled: Boolean,
  isOnboardingComplete: Boolean,
  learningHistory: [{
    topicName: String,
    quizScore: Number,
    masteryStatus: "Strong" | "Average" | "Weak",
    completedAt: Date
  }],
  weakTopics: [String],
  totalStudyTime: Number (minutes)
}
```

---

## 🛡️ Middleware

| Middleware | Purpose |
|------------|---------|
| `auth.middleware.js` | JWT token verification (`protect`) |
| `role.middleware.js` | Role-based access (`placementOnly`) |
| `onboarding.middleware.js` | Ensure onboarding is complete |
| `error.middleware.js` | Global error handling |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Groq API key

### Installation

```bash
# Clone repository
git clone <repo-url>
cd StudySphere/server

# Install dependencies
npm install

# Create .env file (see Environment Variables above)

# Start development server
npm run dev

# Start production server
npm start
```

### Running

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:5000`

---

## 📋 Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `start` | `node server.js` | Start production server |
| `dev` | `nodemon server.js` | Start with hot reload |

---

## 🔄 Cron Jobs

| Job | Schedule | Purpose |
|-----|----------|---------|
| Roadmap Refresh | Daily | Updates user roadmaps based on progress |

---

## 🧪 Testing with Postman

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

**Generate Roadmap:**
```json
POST /api/roadmap/generate
{
  "goal": "Learn Data Structures",
  "duration": 30
}
```

---

## 📚 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^5.2.1 | Web framework |
| mongoose | ^9.1.1 | MongoDB ODM |
| jsonwebtoken | ^9.0.3 | JWT authentication |
| bcryptjs | ^3.0.3 | Password hashing |
| cors | ^2.8.5 | Cross-origin requests |
| dotenv | ^17.2.3 | Environment variables |
| axios | ^1.13.2 | HTTP client |
| node-cron | ^4.2.1 | Task scheduling |
| pdfkit | ^0.17.2 | PDF generation |
| @google/generative-ai | ^0.24.1 | Google AI (fallback) |
| openai | ^6.17.0 | OpenAI SDK (fallback) |

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

StudySphere Team

---

<p align="center">
  Made with ❤️ for students everywhere
</p>
