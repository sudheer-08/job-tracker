# Job Tracker

A full-stack job application tracker for managing your job search pipeline — from first application through interviews and offers.

## Features

- **User authentication** — Register, log in, and manage your own applications
- **Application CRUD** — Track company, role, status, source, job URL, applied date, and follow-up date
- **Pipeline statuses** — Applied → Screening → Interview → Offer, plus Rejected and Withdrawn
- **Dashboard** — Stats, status distribution, monthly trends, pipeline funnel, follow-up reminders, and recent activity
- **Search & filters** — Filter applications by status, source, and keyword search with pagination
- **Status history** — Automatic audit trail when an application's status changes
- **Notes** — Attach notes to individual applications
- **Documents** — Upload resumes and related files (stored via Cloudinary)
- **Soft delete** — Move applications to trash and restore them later
- **Follow-up reminders** — Overdue, due today, and upcoming follow-ups based on follow-up dates
- **Resume Analyzer** — Analyze a resume against a job description to get structured feedback


## Tech Stack

| Layer    | Technologies |
| -------- | ------------ |
| Frontend | React 19, Vite, React Router, TanStack Query, Tailwind CSS, Recharts |
| Backend  | Node.js, Express 5, Prisma, PostgreSQL |
| Auth     | JWT, bcrypt |
| Storage  | Cloudinary (documents) |

## Project Structure

```
job-tracker/
├── backend/
│   ├── prisma/          # Schema and migrations
│   └── src/
│       ├── config/      # Prisma, Cloudinary
│       ├── controllers/
│       ├── middleware/  # Auth, file upload
│       ├── routes/
│       ├── services/
│       └── utils/
└── frontend/
    └── src/
        ├── api/         # Axios API clients
        ├── components/
        ├── context/     # Auth context
        ├── hooks/
        ├── pages/
        └── utils/
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [PostgreSQL](https://www.postgresql.org/) database
- [Cloudinary](https://cloudinary.com/) account (for document uploads)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd job-tracker
```

### 2. Backend setup

```bash
cd backend
npm install
```

Copy the environment file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
| -------- | ----------- |
| `PORT` | API server port (default: `5000`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `1d`) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

Run database migrations:

```bash
npx prisma migrate deploy
```

Start the API server:

```bash
npm run dev
```

The backend runs at `http://localhost:5000`.

### 3. Frontend setup

In a separate terminal:

```bash
cd frontend
npm install
cp .env.example .env
```

| Variable | Description |
| -------- | ----------- |
| `VITE_API_URL` | Backend API URL (default: `http://localhost:5000`) |

Start the dev server:

```bash
npm run dev
```

The frontend runs at `http://localhost:5173`. Vite proxies `/api` requests to the backend during development.

### 4. Build for production

```bash
# Frontend
cd frontend
npm run build
npm run preview

# Backend
cd backend
npm start
```

## Resume Analyzer

The app includes a Resume Analyzer page at `/resume`.

- **Backend:** `POST /api/resume/analyze`
- **Purpose:** analyze an uploaded resume against a provided job description and return structured feedback.

## API Overview

All protected routes require a `Authorization: Bearer <token>` header.


| Endpoint | Description |
| -------- | ----------- |
| `POST /api/auth/register` | Create an account |
| `POST /api/auth/login` | Log in |
| `GET /api/auth/me` | Get current user |
| `GET/POST /api/applications` | List / create applications |
| `GET/PUT/DELETE /api/applications/:id` | Read / update / soft-delete |
| `GET /api/applications/trash` | List trashed applications |
| `POST /api/applications/:id/restore` | Restore from trash |
| `GET /api/applications/:id/history` | Status change history |
| `GET /api/dashboard/overview` | Full dashboard data |
| `GET /api/reminders` | Follow-up reminders |
| `GET/POST /api/notes` | Application notes |
| `POST /api/documents` | Upload a document |
| `GET /api/documents/:applicationId` | List documents for an application |
| `POST /api/resume/analyze` | Analyze a resume against a job description |

## Application Pipeline


```
APPLIED → SCREENING → INTERVIEW → OFFER
                  ↘ REJECTED
                  ↘ WITHDRAWN
```

**Sources:** LinkedIn, Indeed, Referral, Company Site, Other
