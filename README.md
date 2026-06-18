# Course Selection System

A full-stack web application designed to digitize and manage the university course registration process.

---

## 🎯 Why We Created This (Purpose)
Manual course registration is often prone to scheduling conflicts, lack of real-time seat availability visibility, and inefficient waitlisting. We created this platform to:
- **Automate Timetable Generation**: Prevent manual scheduling errors by auto-scheduling course sections without conflicts.
- **Enforce Constraints**: Set hard limits on section capacities (50 students max) and handle overflow dynamically via a first-in, first-out (FIFO) waitlist.
- **Improve Role Transparency**: Provide distinct, dedicated dashboards for **Students** (to register and view timetables), **Teachers** (to manage courses and view rosters), and **Admins** (to monitor analytics and manage users).

---

## 🛠️ Technologies & Code We Used
The project is built using a modern full-stack developer stack:
- **Frontend**: React 18 (built with Vite) for a responsive single-page user interface, combined with Axios for API communication and jsPDF for exporting timetables.
- **Backend**: Java Spring Boot 3.2 (with Maven) handling the core business logic, REST controllers, and API configurations.
- **Database**: MySQL 8 storing persistent records of users, courses, sections, and enrollments.
- **Security**: Spring Security + JSON Web Tokens (JWT) for stateless session handling and BCrypt for secure password hashing.

---

## 🔗 How It Is All Connected

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

1. **Frontend ↔ Backend (Axios REST APIs)**:
   - The React frontend makes HTTP calls (GET, POST, PUT, DELETE) to Spring Boot controllers using **Axios**.
   - Upon login, the backend returns a secure **JWT token** to the client. The frontend attaches this token to the `Authorization` header of all subsequent API calls.
2. **Backend ↔ Database (Spring Data JPA)**:
   - The Spring Boot backend connects to the MySQL instance using credentials stored in `application.properties`.
   - Instead of writing raw SQL, we use **Spring Data JPA** to map our Java entities (like `User` and `Course`) directly to the MySQL database tables.
