<div align="center">

# 🚀 Smart Leads Dashboard

### Production-Grade Full-Stack CRM with TypeScript

A professional leads management dashboard demonstrating **production-style engineering practices** — featuring JWT authentication, role-based access control, server-side pagination, Zustand state management, Docker deployment, and a glassmorphism dark UI.

**Full MERN Stack · TypeScript Across the Board · Docker-Ready**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

[🔗 Live Demo](https://smart-leads-dashboard-ashy.vercel.app) · [💼 LinkedIn](https://www.linkedin.com/in/kiran-latwade-aimpoint) · [🐙 GitHub](https://github.com/latwadek-debug)

</div>

---

## 🎯 Why This Project

This isn't a tutorial CRUD app. Smart Leads Dashboard demonstrates the **full spectrum of full-stack engineering** — from database schema design to containerized deployment:

| Skill Demonstrated | How |
|-------------------|-----|
| **Type Safety** | TypeScript on both client and server — interfaces, generics, strict mode |
| **Authentication** | JWT with Axios interceptors, Zustand-managed auth state, secure token hydration |
| **Authorization** | Role-Based Access Control (RBAC) enforced at both React Router and Express middleware levels |
| **State Management** | Zustand over Redux/Context — atomic updates, no tree re-renders, interceptor-compatible |
| **Data Fetching** | TanStack Query with caching, deduplication, and optimistic updates — zero `useEffect` spaghetti |
| **Form Handling** | React Hook Form + Zod for type-safe validation before any API request fires |
| **API Design** | RESTful API with standardized `{ success, message, data, error }` response shape |
| **DevOps** | Docker multi-stage builds, Nginx static serving, docker-compose orchestration |

---

## ✨ Enterprise-Grade Features

- **🛡️ Secure Authentication** — JWT-based auth with Axios interceptors and secure `localStorage` hydration via Zustand
- **👥 Role-Based Access Control** — Sales reps see their pipelines; Admins oversee everything. Enforced at router + middleware levels
- **📊 Interactive Dashboard** — Real-time calculated metrics, visual data mapping, and recent activity tracking
- **⚡ Blazing Fast Data Tables** — Server-side pagination and debounced search powered by TanStack Query
- **🎨 Premium Glassmorphism UI** — Custom-built, Radix-inspired accessible component library (Modals, Dropdowns, Badges) in dark mode
- **📝 Bulletproof Forms** — React Hook Form + Zod ensures strict, type-safe validation
- **📈 CSV Data Export** — One-click raw CSV export streamed directly from the backend
- **🐳 Docker-Ready** — Full containerization with Nginx frontend + Node.js backend + MongoDB

---

## 🏗️ Architectural Decisions

This project avoids "tutorial code" entirely, opting for patterns used in high-growth startups:

1. **Feature-Sliced Design (Frontend)** — Modularized by domain (`features/auth`, `features/leads`) instead of technical type (`/components`, `/hooks`). Prevents monolithic scaling issues.

2. **Global Error Boundary (Backend)** — Custom Express middleware catches Mongoose validation errors, duplicate keys, and JWT expirations, standardizing all API responses.

3. **Zustand over Redux/Context** — Context API causes massive React tree re-renders. Redux is boilerplate-heavy. Zustand provides hyper-performant atomic state management with interceptor compatibility.

4. **TanStack Query Caching** — Eliminates the `useEffect` data-fetching spaghetti, providing out-of-the-box deduplication, caching, and optimistic UI updates.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite 6 | Build tool & dev server |
| Tailwind CSS v4 | Utility-first styling |
| Zustand | Global state management |
| TanStack Query | Server state & caching |
| React Hook Form | Form handling |
| Zod | Schema validation |
| Lucide React | Icon system |
| date-fns | Date formatting |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js 20 | Runtime |
| Express | HTTP framework |
| TypeScript | Type safety |
| MongoDB + Mongoose | Database & ODM |
| JWT + bcryptjs | Auth & password hashing |
| cors | Cross-origin handling |

### DevOps
| Technology | Purpose |
|-----------|---------|
| Docker | Containerization |
| Multi-stage builds | Optimized images |
| Nginx | Static file serving |
| docker-compose | Service orchestration |

---

## 📖 API Documentation

The RESTful API is strictly typed and protected via Bearer Tokens.

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/auth/register` | Public | Create a new user account |
| `POST` | `/api/auth/login` | Public | Authenticate and retrieve JWT |
| `GET` | `/api/auth/me` | Private | Hydrate user session on load |
| `GET` | `/api/leads` | Private | Retrieve paginated/filtered leads |
| `POST` | `/api/leads` | Private | Add a new lead to the CRM |
| `PUT` | `/api/leads/:id` | Private | Update an existing lead |
| `DELETE` | `/api/leads/:id` | Admin | Permanently delete a lead |
| `GET` | `/api/leads/export/csv` | Private | Download current view as CSV |
| `GET` | `/api/leads/stats/summary` | Private | Retrieve dashboard metrics |

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v20+)
- MongoDB running locally or on Atlas

### 1. Backend Setup
```bash
cd backend
npm install

# Create environment configuration
cp .env.example .env
# Edit .env → add your MONGODB_URI and JWT_SECRET

npm run dev
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```
Navigate to `http://localhost:3000`

### 3. Docker Deployment (Production)
```bash
# Full stack in one command
docker-compose up --build -d
```
- **Frontend** → Nginx on port 3000
- **Backend** → Node.js on port 5000
- **Database** → MongoDB on port 27017

---

## 📁 Project Structure

```
smart-leads-dashboard/
├── client/                     # React + TypeScript frontend
│   ├── src/
│   │   ├── features/           # Feature-sliced modules
│   │   │   ├── auth/           # Login, register, auth state
│   │   │   └── leads/          # Lead CRUD, table, dashboard
│   │   ├── components/         # Shared UI components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # API client, utilities
│   │   └── App.tsx             # Root component + routing
│   ├── Dockerfile              # Multi-stage build + Nginx
│   └── vite.config.ts
├── backend/                    # Express + TypeScript API
│   ├── src/
│   │   ├── controllers/        # Route handlers
│   │   ├── middleware/         # Auth, error handling, RBAC
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # API route definitions
│   │   └── server.ts          # Entry point
│   ├── Dockerfile             # Alpine Node image
│   └── tsconfig.json
└── docker-compose.yml         # Full stack orchestration
```

---

## 👤 Author

**Kiran Latwade** — Frontend-Focused Full Stack Developer

- 🌐 [Portfolio](https://aimpoint-portfolio.netlify.app)
- 💼 [LinkedIn](https://www.linkedin.com/in/kiran-latwade-aimpoint)
- 📧 [latwadek@gmail.com](mailto:latwadek@gmail.com)
- 🐙 [GitHub](https://github.com/latwadek-debug)

---

<div align="center">
  <sub>Designed and built by <b>Kiran Latwade</b> — Full-stack TypeScript, production-grade architecture.</sub>
</div>
