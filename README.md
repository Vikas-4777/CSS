#Course Registration Platform

A full-stack web application for managing student course enrollments with automatic timetable generation, role-based access control, real-time seat availability tracking, and a robust waitlist system.

---

## 📖 Project Overview & Explanation

This platform is designed to digitize and manage the entire course enrollment workflow for educational institutions. The application separates users into three distinct roles (Students, Teachers, and Admins), each with tailored capabilities.

### How the System Works (Data Flow)

The application follows a standard **Three-Tier Architecture**:
1. **Presentation Layer (Frontend)**: A single-page application built with **React** and **Vite**. It handles the user interface, renders interactive elements like the timetable grid, and exports PDF files.
2. **Business Logic Layer (Backend)**: Built with **Java Spring Boot**. It exposes a secure REST API, validates business logic constraints (e.g., preventing class timetable conflicts, enforcing section capacities), and manages authentication.
3. **Data Link Layer (Database)**: Powered by **MySQL**, which stores user accounts, course sections, active enrollments, waitlists, and timetables.

```
┌──────────────────┐         REST API (JSON)         ┌──────────────────────┐
│  React Frontend  │ <=============================> │  Spring Boot Backend │
│   (Vite Port)    │     Axios HTTP Client + JWT     │     (Port 8080)      │
└──────────────────┘                                 └──────────┬───────────┘
                                                                │
                                                                │ Spring Data JPA
                                                                │ (Hibernate + JDBC)
                                                                ▼
                                                     ┌──────────────────────┐
                                                     │    MySQL Database    │
                                                     │     (coursedb)       │
                                                     └──────────────────────┘
```

### Component Connections & Integration

#### 1. Frontend to Backend Connection
- **Protocol**: HTTP/HTTPS REST endpoints.
- **Library**: **Axios** is used on the frontend to make asynchronous API requests to the backend controllers.
- **State Management & Routing**: **React Router DOM** manages page-level transitions.
- **JWT Authorization**: Upon successful login, the backend returns a JSON Web Token (JWT). The frontend stores this token and automatically attaches it to the `Authorization: Bearer <token>` header of every subsequent HTTP request.

#### 2. Backend to Database Connection
- **ORM / Data Access**: **Spring Data JPA** (Hibernate) abstraction layer. Java classes annotated with `@Entity` map directly to tables in MySQL.
- **Connection Configuration**: Credentials, URL, and database settings are managed in `backend/src/main/resources/application.properties`.
- **Database Driver**: `mysql-connector-j` translates JPA operations into standard SQL queries executed on the database server.

#### 3. Security & Authentication Flow
- **Encryption**: Passwords are securely hashed using **BCrypt** hashing algorithm (`BCryptPasswordEncoder`) before storing in the database.
- **Authorization Filters**: The `JwtAuthFilter` intercepts every incoming REST call, parses the JWT token, verifies its signature against the backend `jwt.secret`, and extracts user identity/roles.
- **Role-Based Access Control (RBAC)**: Spring Security intercepts requests and checks if the authenticated user's role (`STUDENT`, `TEACHER`, or `ADMIN`) matches the path restrictions configured in `SecurityConfig.java`.

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Spring Boot 3.2 (Java 17)
- **Database**: MySQL 8
- **Authentication**: JWT (JSON Web Tokens)

---

## 🌟 Key Features

### Student Module
- Register and login
- Browse all available courses
- View 4 sections (A, B, C, D) per course with capacity tracking (50 students max)
- Enroll in one section per course
- Automatic timetable generation (9 AM - 5 PM)
- View weekly timetable grid
- Export timetable as PDF (using `jspdf`)
- Drop courses
- Real-time seat availability
- Waitlist system when sections are full

### Teacher Module
- Login system
- Add new courses (automatically creates 4 sections)
- View all courses taught
- View students enrolled in each section
- Track section capacity (e.g., 32/50)
- Delete courses

### Admin Module
- View system analytics (total students, teachers, courses, enrollments)
- Manage all users (students, teachers, admins)
- Activate/deactivate user accounts
- Delete users
- View all courses in the system

---

## 📊 Database Schema

```
Users (1) ──────< (N) Courses
  │                      │
  │                      │
  │                (1) ──┴──< (N) Sections
  │                              │
  │                              │
  └──< (N) Enrollments (N) >────┘
  │
  └──< (N) Timetable
  │
  └──< (N) Waitlist
```

### Tables
1. **users**: Stores details of all accounts (students, teachers, admins) with active status flags and BCrypt passwords.
2. **courses**: Represents academic courses with credits and mapping to teachers.
3. **sections**: Stores capacity (50 max), current enrollment count, and section names (A, B, C, D) for each course.
4. **enrollments**: Many-to-many join table connecting students to specific sections.
5. **timetable**: Stores generated scheduling blocks (days and time slots) for students' selected courses.
6. **waitlist**: Queue tracking students who attempted to enroll in full sections (FIFO order).

---

## 📦 Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+
- Node.js 18+ and npm

---

## 🚀 Getting Started

### 1. Database Setup

1. Install MySQL and start the service
2. Create database and tables:
```bash
mysql -u root -p < backend/schema.sql
```
3. Update database credentials in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=your_password
```

### 2. Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```
2. Build the project:
```bash
mvn clean install
```
3. Run the application:
```bash
mvn spring-boot:run
```
Backend will start on `http://localhost:8080`

### 3. Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```
2. Install dependencies:
```bash
npm install
```
3. Start development server:
```bash
npm run dev
```
Frontend will start on `http://localhost:5173`

---

## 🔐 Default Test Accounts

After running the `schema.sql`, you can use these default test accounts (passwords are bcrypt hashed):

- **Admin**: `admin@test.com` (password: "password")
- **Teacher**: `teacher@test.com` (password: "password")
- **Student**: `student@test.com` (password: "password")

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/{id}` - Get course by ID
- `GET /api/courses/teacher/{teacherId}` - Get courses by teacher
- `POST /api/courses` - Create course (creates 4 sections automatically)
- `DELETE /api/courses/{id}` - Delete course

### Enrollments
- `POST /api/enrollments` - Enroll student
- `DELETE /api/enrollments` - Drop course
- `GET /api/enrollments/student/{studentId}` - Get student enrollments
- `GET /api/enrollments/section/{sectionId}` - Get section enrollments

### Timetable
- `GET /api/timetable/student/{studentId}` - Get student timetable

### Admin
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/{userId}/toggle` - Toggle user active status
- `DELETE /api/admin/users/{userId}` - Delete user
- `GET /api/admin/analytics` - Get system analytics

---

## 📂 Project Structure

```
course-project/
├── backend/
│   ├── src/main/java/com/courseselection/
│   │   ├── config/          # Security configuration
│   │   ├── controller/      # REST controllers
│   │   ├── dto/             # Data transfer objects
│   │   ├── entity/          # JPA entities
│   │   ├── repository/      # Data repositories
│   │   ├── security/        # JWT utilities
│   │   └── service/         # Business logic
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── pom.xml
│   └── schema.sql
└── frontend/
    ├── src/
    │   ├── components/      # Reusable components
    │   ├── pages/           # Page components
    │   ├── services/        # API services
    │   ├── utils/           # Utility functions
    │   ├── App.jsx
    │   ├── App.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 🎓 Core Implementations Detail

### Automatic Timetable Generation
- Time slots: 09:00-10:30, 10:45-12:15, 13:15-14:45, 15:00-16:30
- Includes designated breaks between sessions
- Prevents scheduling conflicts by checking current enrollments before assigning slots
- Distributes courses evenly across weekdays

### Enrollment Constraints
- Students cannot enroll in the same course twice
- Section capacity limited to 50 students
- Automatic waitlist when section is full
- Real-time capacity updates

### Waitlist System
- Automatically places students on a waitlist when a section is full
- First-In, First-Out (FIFO) processing when spots become available
- Automatic enrollment from waitlist when a student drops the section

---

## 🛡️ License

MIT License
