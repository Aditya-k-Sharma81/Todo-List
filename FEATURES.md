# ✨ Features & Functional Specification

This document provides a detailed breakdown of all user-facing features, technical capabilities, components, and workflow logic implemented in the **MERN Stack Todo Application**.

---

## 📌 Comprehensive Feature Matrix

| Category | Feature Name | Description | Status |
| :--- | :--- | :--- | :--- |
| **Core CRUD** | Task Creation | Add tasks with title, description, priority, category, due date & subtasks | ✅ Implemented |
| **Core CRUD** | Task Editing | Full inline / modal update of task properties | ✅ Implemented |
| **Core CRUD** | Task Deletion | Remove tasks from storage with state update | ✅ Implemented |
| **Core CRUD** | Toggle Completion | Toggle main task completion status | ✅ Implemented |
| **Subtasks** | Checklist Items | Add, remove, and toggle subtasks | ✅ Implemented |
| **Subtasks** | Cascade Sync | Automatic completion sync between parent task & subtasks | ✅ Implemented |
| **Search & Filter** | Live Search | Instant text match on task title and description | ✅ Implemented |
| **Search & Filter** | Status Filter | Filter by `All`, `Active`, or `Completed` | ✅ Implemented |
| **Search & Filter** | Priority Filter | Filter by `High`, `Medium`, or `Low` priority | ✅ Implemented |
| **Search & Filter** | Category Filter | Filter by tags: `Work`, `Personal`, `Health`, `Finance`, `Shopping` | ✅ Implemented |
| **Sorting** | Dynamic Sorting | Sort by `Newest First`, `Oldest First`, `Priority Rank`, or `Due Date` | ✅ Implemented |
| **View Modes** | Layout Switcher | Toggle between responsive Grid View and compact List View | ✅ Implemented |
| **Analytics** | Metrics Dashboard | Real-time statistics: Total, Completed, Pending, High Priority, Overdue & Completion Rate % | ✅ Implemented |
| **Pages** | Single Task View | Deep-dive dedicated view for individual tasks (`/todo?id=...`) | ✅ Implemented |
| **Persistence** | Zero-Config DB Fallback | Automatic fallback from MongoDB to File DB (`todos.json`) | ✅ Implemented |
| **Design** | Glassmorphism UI | Sleek dark theme UI with blur panels, hover effects, CSS variables | ✅ Implemented |

---

## 🔍 Feature Breakdown & Logic Details

### 1. Task Lifecycle & Subtask Cascade Logic

Tasks contain both metadata attributes and an array of nested subtasks.

```
Todo Object
 ├── Title (Required)
 ├── Description (Optional)
 ├── Priority (High | Medium | Low)
 ├── Category (Work | Personal | Health | Finance | Shopping)
 ├── Due Date (YYYY-MM-DD)
 ├── Completed (Boolean)
 └── Subtasks [ Array of { id, title, completed } ]
```

#### Cascade Synchronization Rule 1: Parent to Subtasks
When a user marks a task as **Completed**, all attached subtasks are automatically updated to `completed: true`.

#### Cascade Synchronization Rule 2: Subtasks to Parent
When a user toggles individual subtasks, the backend checks if **all** subtasks under that task are completed:
* If all subtasks are checked `true` $\rightarrow$ Parent task becomes `completed: true`.
* If any subtask is unchecked `false` $\rightarrow$ Parent task becomes `completed: false`.

---

### 2. Search, Filtering & Sorting System

The filtering engine works seamlessly on both client and backend controller ([`server/controllers/todoController.js`](file:///d:/React%20Js/Todo/server/controllers/todoController.js)).

```
User Query Inputs ──► FilterBar.jsx
                      ├── Search Query (Text search in Title & Description)
                      ├── Status Tab (All / Active / Completed)
                      ├── Priority Selector (All / High / Medium / Low)
                      ├── Category Selector (All / Work / Personal / Health / Finance / Shopping)
                      └── Sort By (Newest / Oldest / Priority Rank / Due Date)
```

#### Sorting Algorithms:
* **Priority Rank**: Orders tasks by weight: `High (3) > Medium (2) > Low (1)`.
* **Due Date**: Orders tasks chronologically by `dueDate`. Items without due dates are pushed to the end.
* **Newest / Oldest**: Orders by ISO timestamp `createdAt`.

---

### 3. Analytics Dashboard & Real-Time Metrics

Component: [`StatsSummary.jsx`](file:///d:/React%20Js/Todo/client/src/components/StatsSummary.jsx)

The dashboard presents aggregated metrics fetched from `/api/todos/stats`:

1. **Total Tasks**: Total count of all tasks.
2. **Completed Tasks**: Count of tasks where `completed === true`.
3. **Pending Tasks**: Count of tasks where `completed === false`.
4. **High Priority**: Pending tasks with `priority === 'High'`.
5. **Overdue Tasks**: Pending tasks with `dueDate < today`.
6. **Completion Rate %**: Calculated as $\left(\frac{\text{Completed}}{\text{Total}}\right) \times 100$, rendered with a dynamic progress bar.

---

### 4. Interactive UI Components & Navigation

* **Navbar** ([`Navbar.jsx`](file:///d:/React%20Js/Todo/client/src/components/Navbar.jsx)): Top header featuring project branding, quick "+ New Task" modal launcher, and responsive navigation links.
* **TodoCard** ([`TodoCard.jsx`](file:///d:/React%20Js/Todo/client/src/components/TodoCard.jsx)): Interactive card component rendering priority badges, category tags, due date status (highlighted red if overdue), subtask checklist, completion toggle, edit button, and delete action.
* **TodoModal** ([`TodoModal.jsx`](file:///d:/React%20Js/Todo/client/src/components/TodoModal.jsx)): Modal interface for adding new tasks or editing existing tasks with dynamic subtask input fields.
* **SingleTodoPage** ([`SingleTodoPage.jsx`](file:///d:/React%20Js/Todo/client/src/pages/SingleTodoPage.jsx)): Dedicated detail page for viewing full task details, subtask progress, creation dates, and performing task updates.

---

### 5. Seamless Database Fallback Persistence

* Primary Engine: **MongoDB** with Mongoose ORM.
* Fallback Engine: **Local File System** storing JSON data in `server/data/todos.json`.
* Design Benefit: Guaranteed 100% uptime and functionality regardless of database setup environment.
