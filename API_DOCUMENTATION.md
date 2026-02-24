# API Documentation

Base URL: `http://localhost:8080/api`

## Authentication

All endpoints except `/auth/*` require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "STUDENT"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "STUDENT"
}
```

**Roles:** `STUDENT`, `TEACHER`, `ADMIN`

---

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "STUDENT"
}
```

---

## Course Endpoints

### Get All Courses
**GET** `/courses`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Data Structures",
    "credits": 4,
    "teacherId": 2,
    "teacherName": "Dr. Smith",
    "sections": [
      {
        "id": 1,
        "courseId": 1,
        "courseName": "Data Structures",
        "sectionName": "A",
        "capacity": 50,
        "enrolled": 32,
        "available": true
      }
    ]
  }
]
```

---

### Get Course by ID
**GET** `/courses/{id}`

**Response:**
```json
{
  "id": 1,
  "name": "Data Structures",
  "credits": 4,
  "teacherId": 2,
  "teacherName": "Dr. Smith",
  "sections": [...]
}
```

---

### Get Courses by Teacher
**GET** `/courses/teacher/{teacherId}`

**Response:** Same as Get All Courses

---

### Create Course
**POST** `/courses`

**Request Body:**
```json
{
  "name": "Machine Learning",
  "credits": 4,
  "teacherId": 2
}
```

**Response:**
```json
{
  "id": 5,
  "name": "Machine Learning",
  "credits": 4,
  "teacherId": 2,
  "teacherName": "Dr. Smith",
  "sections": [
    {
      "id": 17,
      "sectionName": "A",
      "capacity": 50,
      "enrolled": 0,
      "available": true
    },
    // Sections B, C, D automatically created
  ]
}
```

**Note:** Automatically creates 4 sections (A, B, C, D) with 50 capacity each.

---

### Delete Course
**DELETE** `/courses/{id}`

**Response:**
```json
{
  "message": "Course deleted"
}
```

---

## Enrollment Endpoints

### Enroll Student
**POST** `/enrollments`

**Request Body:**
```json
{
  "studentId": 1,
  "sectionId": 3
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Enrollment successful"
}
```

**Response (Section Full):**
```json
{
  "success": false,
  "message": "Section full. Added to waitlist."
}
```

**Business Rules:**
- Student cannot enroll in same course twice
- Section capacity must not exceed 50
- Automatically generates timetable entry
- Adds to waitlist if section is full

---

### Drop Course
**DELETE** `/enrollments?studentId={studentId}&courseId={courseId}`

**Response:**
```json
{
  "message": "Course dropped"
}
```

**Business Rules:**
- Removes enrollment
- Deletes timetable entry
- Processes waitlist (auto-enrolls next student)

---

### Get Student Enrollments
**GET** `/enrollments/student/{studentId}`

**Response:**
```json
[
  {
    "id": 1,
    "studentId": 1,
    "studentName": "John Doe",
    "sectionId": 3,
    "sectionName": "A",
    "courseId": 2,
    "courseName": "Database Systems",
    "enrolledAt": "2024-02-23T10:30:00"
  }
]
```

---

### Get Section Enrollments
**GET** `/enrollments/section/{sectionId}`

**Response:**
```json
[
  {
    "id": 1,
    "studentId": 1,
    "studentName": "John Doe",
    "sectionId": 3,
    "sectionName": "A",
    "courseId": 2,
    "courseName": "Database Systems",
    "enrolledAt": "2024-02-23T10:30:00"
  }
]
```

---

## Timetable Endpoints

### Get Student Timetable
**GET** `/timetable/student/{studentId}`

**Response:**
```json
[
  {
    "id": 1,
    "day": "Monday",
    "timeSlot": "09:00-10:30",
    "courseId": 1,
    "courseName": "Data Structures"
  },
  {
    "id": 2,
    "day": "Monday",
    "timeSlot": "10:45-12:15",
    "courseId": 2,
    "courseName": "Database Systems"
  }
]
```

**Time Slots:**
- `09:00-10:30` (Morning Session 1)
- `10:45-12:15` (Morning Session 2)
- `13:15-14:45` (Afternoon Session 1)
- `15:00-16:30` (Afternoon Session 2)

**Days:** Monday, Tuesday, Wednesday, Thursday, Friday

---

## Admin Endpoints

### Get All Users
**GET** `/admin/users`

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "STUDENT",
    "active": true
  }
]
```

---

### Toggle User Status
**PUT** `/admin/users/{userId}/toggle`

**Response:**
```json
{
  "message": "User status updated"
}
```

**Effect:** Toggles `active` field between true/false

---

### Delete User
**DELETE** `/admin/users/{userId}`

**Response:**
```json
{
  "message": "User deleted"
}
```

---

### Get Analytics
**GET** `/admin/analytics`

**Response:**
```json
{
  "totalStudents": 150,
  "totalTeachers": 25,
  "totalCourses": 40,
  "totalEnrollments": 450
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid input data"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "error": "Access denied"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Common Error Messages

### Enrollment Errors
- `"Already enrolled in this course"`
- `"Section full. Added to waitlist."`
- `"No available time slot"`
- `"Student not found"`
- `"Section not found"`

### Authentication Errors
- `"Email already exists"`
- `"Invalid credentials"`
- `"Account is deactivated"`

### Course Errors
- `"Teacher not found"`
- `"Course not found"`

---

## Rate Limiting

Currently no rate limiting implemented. Consider adding in production:
- 100 requests per minute per IP
- 1000 requests per hour per user

---

## CORS Configuration

Allowed Origins: `http://localhost:5173`

Allowed Methods: `GET`, `POST`, `PUT`, `DELETE`

Allowed Headers: All

---

## JWT Token

**Expiration:** 24 hours (86400000 ms)

**Claims:**
- `sub`: User email
- `userId`: User ID
- `role`: User role
- `iat`: Issued at
- `exp`: Expiration time

**Example Token Payload:**
```json
{
  "sub": "john@example.com",
  "userId": 1,
  "role": "STUDENT",
  "iat": 1708689600,
  "exp": 1708776000
}
```

---

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@test.com","password":"password123"}'
```

### Get Courses (Authenticated)
```bash
curl -X GET http://localhost:8080/api/courses \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Enroll in Course
```bash
curl -X POST http://localhost:8080/api/enrollments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"studentId":1,"sectionId":3}'
```

---

## Testing with Postman

1. **Import Collection**: Create new collection "Course Selection API"

2. **Set Environment Variables**:
   - `baseUrl`: `http://localhost:8080/api`
   - `token`: (set after login)

3. **Login Request**:
   - Method: POST
   - URL: `{{baseUrl}}/auth/login`
   - Body: JSON with email/password
   - Save token from response

4. **Authenticated Requests**:
   - Add header: `Authorization: Bearer {{token}}`

---

## WebSocket Support (Future)

Not currently implemented. Consider adding for:
- Real-time enrollment updates
- Live capacity changes
- Instant notifications

---

## API Versioning

Current version: v1 (implicit)

Future versions should use URL versioning:
- `/api/v1/courses`
- `/api/v2/courses`

---

## Best Practices

1. **Always validate input** on both client and server
2. **Use HTTPS** in production
3. **Rotate JWT secrets** regularly
4. **Log all API calls** for auditing
5. **Implement rate limiting** in production
6. **Use API gateway** for microservices
7. **Cache frequently accessed data**
8. **Implement pagination** for large datasets

---

## Pagination (Future Enhancement)

Example implementation:
```
GET /api/courses?page=0&size=10&sort=name,asc
```

Response:
```json
{
  "content": [...],
  "totalPages": 5,
  "totalElements": 50,
  "size": 10,
  "number": 0
}
```

---

## API Status Codes

- `200 OK`: Successful GET, PUT
- `201 Created`: Successful POST
- `204 No Content`: Successful DELETE
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Missing/invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Duplicate resource
- `500 Internal Server Error`: Server error

---

**Last Updated:** February 2024
**API Version:** 1.0
