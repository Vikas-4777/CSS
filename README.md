# 🎓 Course Selection System (CSS)

A premium, full-stack web application designed to streamline student course enrollments, automate conflict-free weekly timetable generation, and provide robust administrative oversight. Built with a modern, decoupled architecture using **Spring Boot 3.2** on the backend and **React 18 (Vite)** on the frontend.

---

## 🏗️ System Architecture & Data Flow

```
   ┌─────────────────────────────────────────────────────────┐
   │                       React UI                          │
   │  (Dashboards, Course Catalog, Timetable Grid, Analytics) │
   └────────────────────────────┬────────────────────────────┘
                                │ (Axios / JWT Auth)
                                ▼
   ┌─────────────────────────────────────────────────────────┐
   │                 REST Controller Layer                   │
   │       (Auth, Course, Enrollment, Timetable, Admin)      │
   └────────────────────────────┬────────────────────────────┘
                                ▼
   ┌─────────────────────────────────────────────────────────┐
   │                     Service Layer                       │
   │        (Business Logic, Timetable Gen, Waitlist)        │
   └────────────────────────────┬────────────────────────────┘
                                ▼
   ┌─────────────────────────────────────────────────────────┐
   │                  Data Access (JPA)                      │
   │     (UserRepository, CourseRepository, SectionRep)      │
   └────────────────────────────┬────────────────────────────┘
                                ▼
   ┌─────────────────────────────────────────────────────────┐
   │                     MySQL Database                      │
   │       (Persistent Storage, Foreign Key Constraints)      │
   └─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Backend
* **Spring Boot 3.2** (Java 17) — Enterprise-grade REST APIs.
* **Spring Security & JJWT** — Secure authentication and Role-Based Access Control (RBAC).
* **Spring Data JPA & Hibernate** — Object-Relational Mapping (ORM) and transaction management.
* **HikariCP** — Fast, reliable database connection pooling.
* **Lombok** — Boilerplate reduction.
* **Maven** — Dependency and build management.

### Frontend
* **React 18** + **Vite** — High-performance single-page application (SPA).
* **React Router Dom** — Client-side navigation & route protection.
* **Axios** — Promised-based HTTP client with interceptors for JWT token attachment.
* **jsPDF** — Dynamic client-side weekly timetable PDF generation.
* **Vanilla CSS** — Premium, customized UI design with responsive layouts and hover animations.

### Database
* **MySQL 8.0** — Relational database management.

---

## 🌟 Core Modules & Features

### 👨‍🎓 Student Module
* **Interactive Dashboard**: View enrollment status and overall progress.
* **Smart Catalog**: Browse courses, search by name, filter by availability, and view section capacities.
* **Dynamic Enrollment**: Enroll in sections (A, B, C, D) with automatic double-enrollment and schedule conflict prevention.
* **Timetable Grid**: A beautiful interactive calendar displaying weekly class schedules.
* **PDF Export**: Single-click PDF download of the personalized weekly timetable.
* **Waitlist Queue**: Auto-joins waitlists for fully enrolled sections (capacity: 50).
* **Drop Mechanism**: Drop courses, automatically promoting the next student on the waitlist.

### 👩‍🏫 Teacher Module
* **Course Creation**: Launch new courses (automatically generates sections A, B, C, D with 50-student capacity limits).
* **Section Rosters**: View all sections taught and check real-time enrollment lists.
* **Capacity Tracking**: Monitor class fill rates (e.g., `35/50` enrolled).
* **Course Deletion**: Drop courses, cleaning up student timetables and waitlists concurrently.

### 👑 Admin Module
* **Executive Analytics**: Global dashboard tracking total students, teachers, courses, and active enrollments.
* **User Management**: Add, view, activate/deactivate, or delete user accounts (Students, Teachers, Admins).
* **Global Monitoring**: Oversee all courses, timetables, and system status in real-time.

---

## 🧠 Smart Systems

### 1. Automatic Timetable Generation Algorithm
When a student enrolls in a course, the system automatically allocates class times without conflicts:
* **Time slots**: 9:00 AM - 5:00 PM split into 4 sessions (with breaks):
  * Session 1: `09:00 - 10:30`
  * Session 2: `10:45 - 12:15`
  * Session 3: `13:15 - 14:45`
  * Session 4: `15:00 - 16:30`
* **Distribution**: Distributes courses across weekdays (Monday-Friday) utilizing a pattern-matching algorithm based on Course ID (`courseId % 8`).
* **Conflict Guard**: Detects schedule overlaps and blocks enrollments if a time slot is already booked.

### 2. Waitlist System (FIFO)
* If a section is full (50/50), enrollment requests are automatically queued into the **Waitlist** in a First-In, First-Out order.
* When a student drops a course, the system triggers transactional processing to automatically enroll the first waitlisted student and clear their waitlist entry.

---

## 🗄️ Database Relationships

```
    ┌───────────┐          ┌────────────┐          ┌─────────────┐
    │   User    │1        N│   Course   │1        N│   Section   │
    │ (Student, ├─────────>│  (Created  ├─────────>│ (A, B, C, D │
    │  Teacher, │          │ by Teacher)│          │ Max Cap 50) │
    │  Admin)   │          └────────────┘          └──────┬──────┘
    └─────┬─────┘                                         │
          │1                                              │1
          ├─────────────────< Enrollment >────────────────┘
          │                   (N to N)
          ├───────< Timetable (Generated schedule slots)
          │
          └───────< Waitlist (Queue when sections are full)
```

---

## 🚀 Installation & Running Guide

### Prerequisites
* **Java 17** (JDK 17)
* **Node.js 18+** & **npm**
* **MySQL 8.0+**
* **Maven 3.6+**

### 1. Database Setup
Create the MySQL database and run the schema script:
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS course_selection;"
mysql -u root -p course_selection < backend/schema.sql
mysql -u root -p course_selection < backend/sample-data.sql
```
*Note: Update database credentials in [application.properties](file:///Users/s.p.vikas/Documents/VS%20Code/course-project/backend/src/main/resources/application.properties) if necessary.*

### 2. Launching Services
You can run the application using the startup script at the root directory:
```bash
chmod +x start.sh
./start.sh
```

Alternatively, launch the services manually:

**Backend Setup:**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
*Port: `http://localhost:8080`*

**Frontend Setup:**
```bash
cd frontend
npm install
npm run dev
```
*Port: `http://localhost:5173`*

---

## 🔑 Test Credentials
All test passwords are: `password123`

| Role | Email | Purpose |
|---|---|---|
| **Admin** | `admin@test.com` | Access system-wide dashboard & control users |
| **Teacher** | `john.smith@test.com` | Create courses, view sections & student roster |
| **Student** | `alice@test.com` | Enroll in courses, generate & download timetable |
| **Student** | `bob@test.com` | Enroll in courses, test timetable slots |

---

## 📁 Project Structure

```
course-project/
├── backend/                       # Spring Boot Backend
│   ├── src/main/java/.../
│   │   ├── config/                # Security Configurations (CORS, BCrypt, Filter Chain)
│   │   ├── controller/            # REST API Endpoints
│   │   ├── dto/                   # Request/Response Data Transfer Objects
│   │   ├── entity/                # JPA Database Entities
│   │   ├── repository/            # Spring Data JPA Repositories
│   │   ├── security/              # JWT Filtering & Utility classes
│   │   └── service/               # Core business logic implementation
│   ├── pom.xml                    # Maven dependencies
│   └── schema.sql                 # Database table structures
└── frontend/                      # React Frontend
    ├── src/
    │   ├── components/            # Reusable UI widgets (Sidebar, etc.)
    │   ├── pages/                 # Full-page application screens (Dashboards, Login/Register)
    │   ├── services/              # API HTTP client integrations (Axios)
    │   └── utils/                 # Local Storage & Authentication utilities
    ├── index.html
    └── vite.config.js             # Vite configuration
```

---

## 📄 License

This project is licensed under the MIT License.
