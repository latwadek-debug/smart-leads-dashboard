<div align="center">
  
# 🚀 Smart Leads Dashboard

**A Premium, Production-Grade SaaS Lead Management CRM**

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC.svg)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)

[View Live Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## 🌟 Overview

Smart Leads Dashboard is a professional, full-stack Customer Relationship Management (CRM) tool designed for modern sales teams. Built with a focus on **clean architecture**, **extreme type safety**, and an **exceptional user experience**, this project demonstrates senior-level engineering practices from database to DOM.

### 📸 Screenshots
*(Add your screenshots here)*

| Dashboard Overview | Lead Management |
|:---:|:---:|
| ![Dashboard Placeholder](https://via.placeholder.com/600x350/0f172a/ffffff?text=Dashboard+Overview+UI) | ![Leads Placeholder](https://via.placeholder.com/600x350/0f172a/ffffff?text=Lead+Table+UI) |

---

## ✨ Enterprise-Grade Features

* **🛡️ Secure Authentication**: Robust JWT-based authentication with Axios interceptors and secure `localStorage` hydration via Zustand.
* **👥 Role-Based Access Control (RBAC)**: Enforced at both the React Router and Express middleware levels. Sales reps view their pipelines; Admins oversee everything.
* **📊 Interactive Dashboard**: Real-time calculated metrics, visual data mapping, and recent activity tracking.
* **⚡ Blazing Fast Data Tables**: Server-side pagination and debounced search powered by TanStack Query for zero UI lag.
* **🎨 Premium UI/UX**: Custom-built, Radix-inspired accessible component library (Modals, Dropdowns, Badges) wrapped in a beautiful Glassmorphism Dark Mode.
* **📝 Bulletproof Forms**: React Hook Form coupled with Zod ensures strict, type-safe validation before a single API request fires.
* **📈 Data Portability**: One-click raw CSV export streams directly from the backend.

---

## 🏗️ Architectural Decisions

This project avoids "tutorial code" entirely, opting instead for patterns used in high-growth startups:

1. **Feature-Sliced Design (Frontend)**: Instead of grouping by technical type (`/components`, `/hooks`), the codebase is modularized by domain (`features/auth`, `features/leads`). This prevents monolithic scaling issues.
2. **Global Error Boundary (Backend)**: A custom Express error middleware catches Mongoose validation errors, duplicate keys, and JWT expirations, standardizing all API responses into a predictable `{ success, message, data, error }` interface.
3. **Zustand over Redux/Context**: Context API causes massive React tree re-renders. Redux is boilerplate-heavy. Zustand provides hyper-performant atomic state management, allowing us to interact with the auth state directly inside Axios interceptors.
4. **TanStack Query Caching**: Eliminates the `useEffect` spaghetti commonly found in React data fetching, providing out-of-the-box deduplication, caching, and optimistic UI updates.

---

## 🛠️ Tech Stack

**Client:** React 19, TypeScript, Vite, Tailwind CSS v4, Zustand, TanStack Query, React Hook Form, Zod, Lucide React, date-fns.

**Server:** Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, bcryptjs, cors.

**DevOps:** Docker, Multi-stage builds, Nginx.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (v20+)
- MongoDB running locally or on Atlas.

### 1. Backend Setup
```bash
cd backend
npm install

# Create environment configuration
cp .env.example .env
# Edit .env and insert your MONGODB_URI and JWT_SECRET

npm run dev
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```
Navigate to `http://localhost:3000`

---

## 🐳 Docker Deployment (Production)

The entire ecosystem is fully containerized for seamless deployment to AWS, DigitalOcean, or Render.

```bash
# Ensure your .env file is present in the root or backend folder
docker-compose up --build -d
```
* **Frontend** is served statically via ultra-fast **Nginx** (Port 80 mapped to 3000).
* **Backend** runs a lightweight Alpine Node image (Port 5000).
* **Database** spins up an isolated Mongo container (Port 27017).

---

## 📖 API Documentation Summary

The RESTful API is strictly typed and protected via Bearer Tokens.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create a new user account |
| POST | `/api/auth/login` | Public | Authenticate and retrieve JWT |
| GET | `/api/auth/me` | Private | Hydrate user session on load |
| GET | `/api/leads` | Private | Retrieve paginated/filtered leads |
| POST | `/api/leads` | Private | Add a new lead to the CRM |
| PUT | `/api/leads/:id` | Private | Update an existing lead |
| DELETE | `/api/leads/:id` | Admin | Permanently delete a lead |
| GET | `/api/leads/export/csv` | Private | Download current view as CSV |
| GET | `/api/leads/stats/summary`| Private | Retrieve dashboard metrics |

---

<div align="center">
  Designed and built by <b>Kiran Latwade</b>. <br/>
  <a href="https://linkedin.com/in/kiran-latwade-aimpoint">LinkedIn</a> · <a href="https://aimpoint-portfolio.netlify.app">Portfolio</a>
</div>
