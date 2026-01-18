# TaskFlow API Reference

Base URL: `http://localhost:5000/api`

## Projects

### Create Project
**POST** `/projects`
```json
{
  "name": "Project Name",
  "description": "Optional description"
}
```

### Get All Projects
**GET** `/projects`

### Get Single Project
**GET** `/projects/:id`

### Get Project with Tasks
**GET** `/projects/:id/tasks`

### Update Project
**PUT** `/projects/:id`

### Delete Project
**DELETE** `/projects/:id`

---

## Tasks

### Create Task
**POST** `/tasks`
```json
{
  "title": "Task title",
  "description": "Optional description",
  "dueDate": "2025-01-20",
  "project": "project_id_here"
}
```

### Get All Tasks
**GET** `/tasks`

Query parameters:
- `?completed=true` - Filter by completion status
- `?project=PROJECT_ID` - Filter by project
- `?sortBy=dueDate:asc` - Sort (options: `createdAt`, `dueDate`, `title`)

### Search Tasks
**GET** `/tasks/search?q=keyword(title)`

### Get Overdue Tasks
**GET** `/tasks/overdue/list`

### Get Upcoming Tasks (Next 7 Days)
**GET** `/tasks/upcoming/week`

### Get Tasks by Project
**GET** `/tasks/project/:projectId`

### Get Single Task
**GET** `/tasks/:id`

### Update Task
**PUT** `/tasks/:id`

### Toggle Task Completion
**PATCH** `/tasks/:id/complete`

### Bulk Complete Project Tasks
**PATCH** `/tasks/project/:projectId/complete-all`

### Delete Task
**DELETE** `/tasks/:id`