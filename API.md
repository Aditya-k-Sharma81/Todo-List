# 🔌 REST API Documentation & Specification

This API document details all available HTTP REST endpoints exposed by the Express backend server (`/api/todos`).

Base URL: `http://localhost:5000`

---

## 📋 Endpoint Summary Table

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | API Root Health Check & Endpoint Directory |
| `GET` | `/api/todos` | Fetch all tasks (supports search, filter & sort) |
| `GET` | `/api/todos/stats` | Get aggregated task statistics & completion rates |
| `GET` | `/api/todos/:id` | Fetch single task by ID |
| `POST` | `/api/todos` | Create a new task |
| `PUT` | `/api/todos/:id` | Update an existing task |
| `PATCH` | `/api/todos/:id/toggle` | Toggle completion status of a task |
| `PATCH` | `/api/todos/:id/subtasks/:subtaskId` | Toggle completion status of a specific subtask |
| `DELETE` | `/api/todos/:id` | Delete a task |

---

## 📄 Endpoint Details

### 1. GET `/api/todos`
Retrieve a list of tasks matching query parameter filters.

#### Query Parameters:
| Parameter | Type | Allowed Values | Description |
| :--- | :--- | :--- | :--- |
| `search` | String | Any text | Case-insensitive search on title or description |
| `status` | String | `all`, `active`, `completed` | Filter by completion status |
| `priority` | String | `all`, `High`, `Medium`, `Low` | Filter by priority level |
| `category` | String | `all`, `Work`, `Personal`, `Health`, `Finance`, `Shopping` | Filter by category tag |
| `sortBy` | String | `newest`, `oldest`, `priority`, `dueDate` | Order of returned array |

#### Sample Request:
```http
GET /api/todos?status=active&priority=High&sortBy=dueDate HTTP/1.1
Host: localhost:5000
```

#### Sample Response (`200 OK`):
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "todo-1725200000000",
      "title": "Setup CI/CD Pipeline",
      "description": "Configure GitHub Actions workflow for automated testing.",
      "completed": false,
      "priority": "High",
      "category": "Work",
      "dueDate": "2026-09-10",
      "subtasks": [
        {
          "id": "st-1",
          "title": "Create main.yml workflow",
          "completed": false
        }
      ],
      "createdAt": "2026-09-01T20:00:00.000Z",
      "updatedAt": "2026-09-01T20:00:00.000Z"
    }
  ]
}
```

---

### 2. GET `/api/todos/stats`
Get high-level aggregated metrics for the summary dashboard.

#### Sample Request:
```http
GET /api/todos/stats HTTP/1.1
Host: localhost:5000
```

#### Sample Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "total": 10,
    "completed": 6,
    "pending": 4,
    "highPriority": 2,
    "overdue": 1,
    "completionRate": 60
  }
}
```

---

### 3. GET `/api/todos/:id`
Fetch details for a single task item by its unique ID string.

#### Sample Request:
```http
GET /api/todos/todo-1725200000000 HTTP/1.1
Host: localhost:5000
```

#### Sample Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": "todo-1725200000000",
    "title": "Setup CI/CD Pipeline",
    "description": "Configure GitHub Actions workflow for automated testing.",
    "completed": false,
    "priority": "High",
    "category": "Work",
    "dueDate": "2026-09-10",
    "subtasks": [],
    "createdAt": "2026-09-01T20:00:00.000Z",
    "updatedAt": "2026-09-01T20:00:00.000Z"
  }
}
```

---

### 4. POST `/api/todos`
Create a new task item.

#### Request Body Schema:
```json
{
  "title": "Deploy Backend Server",
  "description": "Deploy Node.js application to cloud hosting service.",
  "priority": "High",
  "category": "Work",
  "dueDate": "2026-09-15",
  "subtasks": [
    { "title": "Configure environment variables" },
    { "title": "Run production build test" }
  ]
}
```

#### Sample Response (`201 Created`):
```json
{
  "success": true,
  "data": {
    "id": "todo-1725201234567",
    "title": "Deploy Backend Server",
    "description": "Deploy Node.js application to cloud hosting service.",
    "completed": false,
    "priority": "High",
    "category": "Work",
    "dueDate": "2026-09-15",
    "subtasks": [
      {
        "id": "st-1725201234567-0",
        "title": "Configure environment variables",
        "completed": false
      },
      {
        "id": "st-1725201234567-1",
        "title": "Run production build test",
        "completed": false
      }
    ],
    "createdAt": "2026-09-01T22:30:00.000Z",
    "updatedAt": "2026-09-01T22:30:00.000Z"
  }
}
```

---

### 5. PUT `/api/todos/:id`
Update an existing task object by ID.

#### Request Body Schema:
```json
{
  "title": "Updated Task Title",
  "priority": "Low",
  "completed": true
}
```

#### Sample Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": "todo-1725200000000",
    "title": "Updated Task Title",
    "priority": "Low",
    "completed": true,
    "updatedAt": "2026-09-01T22:35:00.000Z"
  }
}
```

---

### 6. PATCH `/api/todos/:id/toggle`
Toggle task completion status (`completed` becomes `!completed`). If completed becomes `true`, all subtasks are set to `true`.

#### Sample Request:
```http
PATCH /api/todos/todo-1725200000000/toggle HTTP/1.1
Host: localhost:5000
```

#### Sample Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": "todo-1725200000000",
    "completed": true,
    "subtasks": [
      { "id": "st-1", "title": "Task item", "completed": true }
    ]
  }
}
```

---

### 7. PATCH `/api/todos/:id/subtasks/:subtaskId`
Toggle a specific subtask completion status by subtask ID.

#### Sample Request:
```http
PATCH /api/todos/todo-1725200000000/subtasks/st-1 HTTP/1.1
Host: localhost:5000
```

#### Sample Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": "todo-1725200000000",
    "completed": false,
    "subtasks": [
      { "id": "st-1", "title": "Task item", "completed": true },
      { "id": "st-2", "title": "Task item 2", "completed": false }
    ]
  }
}
```

---

### 8. DELETE `/api/todos/:id`
Delete a task from the database by ID.

#### Sample Request:
```http
DELETE /api/todos/todo-1725200000000 HTTP/1.1
Host: localhost:5000
```

#### Sample Response (`200 OK`):
```json
{
  "success": true,
  "message": "Todo deleted successfully",
  "id": "todo-1725200000000"
}
```
