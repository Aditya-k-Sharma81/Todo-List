# 🚀 Premium MERN Stack Todo & Task Management System

A full-stack, feature-rich Task Management Application built with **React (Vite)**, **Node.js**, **Express**, **MongoDB** (with automatic zero-config **File DB fallback**), and modern Glassmorphism UI styling.

---

## 📚 Documentation Index

To explore the detailed technical documentation, feature breakdown, and API specifications, check out the following Markdown files in this repository:

* 📄 [DOCUMENTATION.md](file:///d:/React%20Js/Todo/DOCUMENTATION.md) — Comprehensive technical architecture, architecture overview, system workflow, database design, and installation instructions.
* 📄 [FEATURES.md](file:///d:/React%20Js/Todo/FEATURES.md) — Exhaustive documentation of all features, UI components, filters, search, metrics, subtasks, and persistence mechanisms.
* 📄 [API.md](file:///d:/React%20Js/Todo/API.md) — Complete REST API reference guide with request/response payloads, query parameters, and endpoints.

---

## ✨ Key Features At A Glance

* **📋 Advanced Task Lifecycle**: Full CRUD (Create, Read, Update, Delete) capabilities with support for Title, Description, Priority level, Category, Due Date, and nested Subtask checklists.
* **🔍 Smart Search & Multi-Criteria Filtering**: Instant real-time search across task titles and descriptions, filtered by Status (*All*, *Active*, *Completed*), Priority (*High*, *Medium*, *Low*), and Category (*Work*, *Personal*, *Health*, *Finance*, *Shopping*).
* **⚡ Multi-Property Sorting**: Sort tasks dynamically by *Newest First*, *Oldest First*, *Priority Rank*, or *Due Date*.
* **📊 Analytics Dashboard**: Real-time summary cards displaying Total Tasks, Completed Count, Pending Count, High Priority Tasks, Overdue Tasks, and Completion Rate percentage bar.
* **☑️ Nested Subtask System & Cascade Synchronization**:
  * Toggling a main task to completed automatically marks all its subtasks as completed.
  * Completing all subtasks automatically updates the parent task status to completed.
* **💾 Dual DB Persistence with Zero-Downtime Fallback**:
  * **MongoDB** (Mongoose schema) when connected.
  * **Local JSON File DB** (`server/data/todos.json`) fallback when MongoDB server is offline.
* **🎨 Modern Glassmorphism UI & Dual Layout Modes**: Toggle seamlessly between responsive **Grid View** and compact **List View** with sleek animations and CSS variables theme system.

---

## 📁 Repository Structure

```
Todo/
├── README.md               # Quick overview & entry point
├── DOCUMENTATION.md        # Architecture & setup guide
├── FEATURES.md             # Detailed breakdown of features
├── API.md                  # REST API specification
├── client/                 # Frontend React (Vite) Application
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── App.jsx         # App router & layout container
│       ├── index.css       # Global CSS tokens & glassmorphism styles
│       ├── components/     # UI Components (Navbar, TodoCard, FilterBar, etc.)
│       ├── pages/          # Page Views (TodoListPage, SingleTodoPage)
│       └── services/       # API integration client (api.js)
└── server/                 # Backend Node.js / Express API Server
    ├── server.js           # Server startup script
    ├── package.json
    ├── config/             # DB Connection & Fallback handling (db.js)
    ├── controllers/        # Route Handlers (todoController.js)
    ├── models/             # Data Access Object & Schema (Todo.js)
    ├── routes/             # API Router definitions (todoRoutes.js)
    └── data/               # Persistent JSON file storage (todos.json)
```

---

## ⚡ Quick Start Guide

### Prerequisites
* **Node.js** (v16.0.0 or higher)
* **npm** (v7.0.0 or higher)
* **MongoDB** (Optional; the application seamlessly runs on File DB if MongoDB is not installed/running)

---

### 1️⃣ Start Backend Server

```bash
cd server
npm install
npm run dev
# Server will start at http://localhost:5000
```

*Note: If MongoDB is running on `mongodb://127.0.0.1:27017/tododb`, it will connect automatically. If not, the server logs `MongoDB connection not active. Switched seamlessly to File DB persistence.` and operates smoothly.*

---

### 2️⃣ Start Frontend Client

In a new terminal window:

```bash
cd client
npm install
npm run dev
# Client dev server will open at http://localhost:3000
```

---

## 📌 How to Check In Code & Share Git Repository

If you are setting up or submitting this project to a remote Git host (GitHub, GitLab, Bitbucket), follow these commands:

### Step 1: Initialize Git Repository (if not done)
```bash
git init
```

### Step 2: Add Files & Commit Changes
```bash
git add .
git commit -m "feat: complete MERN todo app implementation with full markdown documentation"
```

### Step 3: Link to Remote Repository & Push
```bash
git branch -M main
git remote add origin <YOUR_REPOSITORY_GIT_URL>
git push -u origin main
```

Replace `<YOUR_REPOSITORY_GIT_URL>` with your repository URL (e.g. `https://github.com/your-username/todo-app.git`).
