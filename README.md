# College Management System (MERN)

Production-ready, scalable MERN stack application for college attendance management, communication, and analytics.

## Tech Stack
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express.js (MVC)
- Database: MongoDB + Mongoose
- Auth: JWT RBAC (Admin, Faculty, Student)
- Messaging: Nodemailer + whatsapp-web.js (with delay handling)
- Scheduler: node-cron (daily 6 PM reports)

## Project Structure
```txt
.
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── docs
│   │   ├── middlewares
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   └── utils
│   ├── .env.example
│   └── package.json
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── hooks
│   │   ├── pages
│   │   └── services
│   ├── .env.example
│   └── package.json
└── README.md
```

## Key Features (v1)
- Role-based system for admin/faculty/student
- Admin CRUD for branches/sections/students/faculty and period config
- Faculty per-period attendance marking and daily logs
- Student attendance analytics:
  - Total periods
  - Attended periods
  - Attendance percentage
  - Leaves remaining for 75% compliance
- Notifications:
  - Daily student email report
  - Parent absence alerts via email + WhatsApp (with delay)
- Daily 6 PM cron automation

## Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Environment Variables
See `backend/.env.example` and `frontend/.env.example`.

## API Docs
Basic API docs are available at:
- `backend/src/docs/api.md`

## Production Deployment

### Backend (Render / Railway)
- Deploy `backend` as a persistent web service (not serverless) because:
  - `whatsapp-web.js` needs a long-running process/session
  - `node-cron` must keep running for scheduled tasks
- Set environment variables in deployment dashboard
- Attach a managed MongoDB instance (Atlas recommended)
- Use `npm start` as start command

### Frontend (Vercel / Netlify / Render static)
- Deploy `frontend` as static build:
  - Build command: `npm run build`
  - Publish directory: `dist`
- Set `VITE_API_BASE_URL` to backend public URL

## Scalability Notes
- MVC + service layer keeps business logic isolated
- Indexed schemas for attendance-heavy queries
- Centralized error and validation middleware
- Stateless JWT auth supports horizontal scaling
- Messaging and cron can be moved to dedicated worker services later
