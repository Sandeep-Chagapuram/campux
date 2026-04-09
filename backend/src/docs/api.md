# API Documentation (v1)

Base URL: `/api`

## Auth
- `POST /auth/login` - login with username or email (`identifier`) and password
- `GET /auth/me` - get current user profile (JWT required)
- `POST /auth/change-password` - change password on first login (JWT required)

## Admin (role: admin)
- `GET /admin/master-data`
- `POST /admin/branches`
- `PUT /admin/branches/:id`
- `DELETE /admin/branches/:id`
- `POST /admin/sections`
- `PUT /admin/sections/:id`
- `DELETE /admin/sections/:id`
- `POST /admin/faculty`
- `DELETE /admin/faculty/:id`
- `POST /admin/students`
- `PUT /admin/students/:id`
- `DELETE /admin/students/:id`
- `PUT /admin/config/periods`

## Faculty (role: faculty)
- `GET /faculty/scope`
- `GET /faculty/students/:sectionId`
- `POST /faculty/students` - faculty adds student in assigned sections
- `POST /faculty/attendance`

## Student (role: student)
- `GET /student/dashboard`

## Logs (admin/faculty)
- `GET /logs?date=YYYY-MM-DD&branch=<id>&section=<id>`
