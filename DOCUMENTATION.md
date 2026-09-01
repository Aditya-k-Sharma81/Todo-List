# 📖 Technical Documentation

Welcome to the technical architecture and installation documentation for the **MERN Stack Todo & Task Management System**.

---

## 🏗️ System Architecture

The application is structured into a modern decoupled architecture:
* **Frontend**: Single Page Application (SPA) created with **React 18** and **Vite**, styled with custom CSS Glassmorphism design system.
* **Backend**: RESTful API server built with **Node.js** and **Express.js**.
* **Database Layer**: Dual-mode Data Access Object (DAO) that automatically handles connection to **MongoDB** or falls back to a **Local JSON File Store** (`server/data/todos.json`).

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
│                 (React 18 + Vite SPA)                       │
│  [TodoListPage] ── [FilterBar] ── [TodoCard] ── [TodoModal] │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / REST API (fetch)
┌──────────────────────────────▼──────────────────────────────┐
│                      Server Layer                           │
│                 (Node.js + Express.js)                      │
│ [server.js] ──► [todoRoutes.js] ──► [todoController.js]     │
└──────────────────────────────┬──────────────────────────────┘
                               │ DAO Layer
             ┌─────────────────┴─────────────────┐
             │            TodoDAO                │
             └────────┬─────────────────┬────────┘
                      │                 │
             MongoDB Connected?         │ (No)
             (Yes)    │                 │
        ┌─────────────▼──────┐   ┌──────▼─────────────┐
        │  MongoDB Database  │   │  JSON File DB      │
        │  (Mongoose Schema) │   │ (data/todos.json)  │
        └────────────────────┘   └────────────────────┘
```

---

## 💻 Tech Stack Specification

### Frontend Stack (`/client`)
| Technology | Description |
| :--- | :--- |
| **React 18** | UI component library with Hooks (`useState`, `useEffect`, `useMemo`) |
| **Vite** | Fast Next-gen frontend tooling and build bundle server |
| **React Router DOM v6** | Client-side page navigation (`/` and `/todo?id=...`) |
| **Lucide React** | Modern SVG icon kit for search, filter, grid, calendar icons |
| **Vanilla CSS3** | Custom design system with CSS custom properties, glassmorphism, responsive grid |

### Backend Stack (`/server`)
| Technology | Description |
| :--- | :--- |
| **Node.js** | JavaScript runtime environment |
| **Express.js** | Web application framework for REST API endpoints |
| **Mongoose** | MongoDB Object Data Modeling (ODM) library |
| **Cors & Dotenv** | Middleware for Cross-Origin Request handling and environment variables |
| **Custom DAO** | Hybrid persistence engine supporting file backup |

---

## 🗄️ Database Design & Unified DAO Pattern

The system implements a flexible **Unified Data Access Object (`TodoDAO`)** inside [`server/models/Todo.js`](file:///d:/React%20Js/Todo/server/models/Todo.js).

### Data Schema Definition
Each Todo object adheres to the following structure:

```json
{
  "id": "todo-1725200000000",
  "title": "Complete Project Documentation",
  "description": "Write comprehensive .md files for features, architecture, and API.",
  "completed": false,
  "priority": "High",
  "category": "Work",
  "dueDate": "2026-09-05",
  "subtasks": [
    {
      "id": "st-1",
      "title": "Draft README.md",
      "completed": true
    },
    {
      "id": "st-2",
      "title": "Write API.md reference",
      "completed": false
    }
  ],
  "createdAt": "2026-09-01T22:00:00.000Z",
  "updatedAt": "2026-09-01T22:30:00.000Z"
}
```

### Dual Database Fallback Mechanism
1. Upon server initialisation, [`server/config/db.js`](file:///d:/React%20Js/Todo/server/config/db.js) attempts to connect to MongoDB using `MONGODB_URI`.
2. If MongoDB is available, `TodoDAO` routes all read/write requests to MongoDB through `MongoTodo` (Mongoose Model).
3. If MongoDB is absent or fails to connect, `isMongoConnected` flag is set to `false`, and `TodoDAO` automatically routes read/write requests to `server/data/todos.json`.
4. This guarantees that **the application will always run flawlessly out-of-the-box without requiring MongoDB installation**.

---

## 🔄 End-to-End Data Flow

1. **User Action**: User filters or searches tasks on the frontend (`FilterBar.jsx`).
2. **State & API Call**: `TodoListPage.jsx` triggers `api.getTodos(filters)` via [`client/src/services/api.js`](file:///d:/React%20Js/Todo/client/src/services/api.js).
3. **HTTP Request**: An HTTP `GET` request is sent to `/api/todos?search=docs&priority=High`.
4. **Express Routing**: [`server/routes/todoRoutes.js`](file:///d:/React%20Js/Todo/server/routes/todoRoutes.js) maps the route to `exports.getTodos` in [`server/controllers/todoController.js`](file:///d:/React%20Js/Todo/server/controllers/todoController.js).
5. **Data Retrieval & Processing**:
   * Controller fetches items via `TodoDAO.find()`.
   * Applies requested query filters (`search`, `status`, `priority`, `category`) and sorting order (`priority`, `dueDate`, `newest`, `oldest`).
6. **JSON Response**: Server responds with a `200 OK` JSON object:
   ```json
   {
     "success": true,
     "count": 1,
     "data": [ ... ]
   }
   ```
7. **UI Update**: React state updates, and component re-renders with subtle micro-animations.

---

## 🛠️ Step-by-Step Installation & Deployment

### Step 1: Clone or Open Project Workspace
```bash
git clone <YOUR_GIT_REPO_URL>
cd Todo
```

### Step 2: Configure Environment (Optional)
Create a `.env` file in the `server/` directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/tododb
```

### Step 3: Launch Services
1. **Server**:
   ```bash
   cd server
   npm install
   npm run dev
   ```
2. **Client**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

---

## 🧪 Testing & Verification

* **Frontend Dev Server**: Navigate to `http://localhost:3000` (or the Vite assigned port).
* **API Health Check**: Visit `http://localhost:5000/` in browser or curl:
  ```bash
  curl http://localhost:5000/api/todos
  ```
