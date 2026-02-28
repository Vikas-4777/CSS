# 📁 Complete File Index

## 📚 Documentation Files

| File | Description | Lines |
|------|-------------|-------|
| [README.md](README.md) | Main project overview and setup instructions | ~200 |
| [SETUP.md](SETUP.md) | Detailed installation and configuration guide | ~300 |
| [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) | Architecture and technical details | ~400 |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Complete implementation checklist | ~500 |
| [API_DOCUMENTATION.md](API_DOCUMENTATION.md) | REST API endpoints reference | ~600 |
| [ARCHITECTURE_DIAGRAMS.md](ARCHITECTURE_DIAGRAMS.md) | Visual system diagrams | ~400 |

**Total Documentation: ~2400 lines**

---

## 🔧 Backend Files (Spring Boot)

### Configuration Files

| File | Purpose |
|------|---------|
| `backend/pom.xml` | Maven dependencies and build configuration |
| `backend/src/main/resources/application.properties` | Database and JWT configuration |
| `backend/schema.sql` | Database schema creation script |
| `backend/sample-data.sql` | Sample test data |

### Main Application

| File | Description |
|------|-------------|
| `backend/src/main/java/com/courseselection/CourseSelectionApplication.java` | Spring Boot main class |

### Security & Configuration (2 files)

| File | Purpose |
|------|---------|
| `config/SecurityConfig.java` | Spring Security, CORS, password encoder |
| `security/JwtUtil.java` | JWT token generation and validation |
| `security/JwtAuthFilter.java` | JWT authentication filter |

### Controllers (5 files)

| File | Endpoints | Purpose |
|------|-----------|---------|
| `controller/AuthController.java` | `/api/auth/*` | Login and registration |
| `controller/CourseController.java` | `/api/courses/*` | Course CRUD operations |
| `controller/EnrollmentController.java` | `/api/enrollments/*` | Enrollment management |
| `controller/TimetableController.java` | `/api/timetable/*` | Timetable retrieval |
| `controller/AdminController.java` | `/api/admin/*` | Admin operations |

### DTOs (7 files)

| File | Purpose |
|------|---------|
| `dto/LoginRequest.java` | Login request payload |
| `dto/RegisterRequest.java` | Registration request payload |
| `dto/AuthResponse.java` | Authentication response |
| `dto/CourseDTO.java` | Course data transfer |
| `dto/SectionDTO.java` | Section data transfer |
| `dto/EnrollmentDTO.java` | Enrollment data transfer |
| `dto/TimetableDTO.java` | Timetable data transfer |

### Entities (6 files)

| File | Table | Relationships |
|------|-------|---------------|
| `entity/User.java` | `users` | 1:N with Courses (teacher) |
| `entity/Course.java` | `courses` | N:1 with User, 1:N with Sections |
| `entity/Section.java` | `sections` | N:1 with Course, 1:N with Enrollments |
| `entity/Enrollment.java` | `enrollments` | N:1 with User, N:1 with Section |
| `entity/Timetable.java` | `timetable` | N:1 with User, N:1 with Course |
| `entity/Waitlist.java` | `waitlist` | N:1 with User, N:1 with Section |

### Repositories (6 files)

| File | Entity | Custom Methods |
|------|--------|----------------|
| `repository/UserRepository.java` | User | findByEmail, findByRole |
| `repository/CourseRepository.java` | Course | findByTeacherId |
| `repository/SectionRepository.java` | Section | findByCourseId |
| `repository/EnrollmentRepository.java` | Enrollment | findByStudentId, existsByStudentIdAndSectionCourseId |
| `repository/TimetableRepository.java` | Timetable | findByStudentId, existsByStudentIdAndDayAndTimeSlot |
| `repository/WaitlistRepository.java` | Waitlist | findBySectionIdOrderByAddedAtAsc |

### Services (5 files)

| File | Responsibilities |
|------|------------------|
| `service/AuthService.java` | User authentication, registration, JWT generation |
| `service/CourseService.java` | Course CRUD, section creation |
| `service/EnrollmentService.java` | Enrollment logic, timetable generation, waitlist |
| `service/TimetableService.java` | Timetable retrieval and formatting |
| `service/AdminService.java` | User management, analytics |

**Total Backend Files: 41 Java files + 4 config files = 45 files**

---

## 🎨 Frontend Files (React + Vite)

### Configuration Files

| File | Purpose |
|------|---------|
| `frontend/package.json` | npm dependencies and scripts |
| `frontend/vite.config.js` | Vite build configuration |
| `frontend/index.html` | HTML entry point |

### Main Application

| File | Purpose |
|------|---------|
| `frontend/src/main.jsx` | React entry point |
| `frontend/src/App.jsx` | Main app component with routing |
| `frontend/src/App.css` | Global styles (1800+ lines) |

### Pages (5 files)

| File | Route | Purpose |
|------|-------|---------|
| `pages/Login.jsx` | `/` | User login |
| `pages/Register.jsx` | `/register` | User registration |
| `pages/StudentDashboard.jsx` | `/student` | Student interface |
| `pages/TeacherDashboard.jsx` | `/teacher` | Teacher interface |
| `pages/AdminDashboard.jsx` | `/admin` | Admin interface |

### Components (1 file)

| File | Purpose |
|------|---------|
| `components/Sidebar.jsx` | Reusable sidebar navigation |

### Services (1 file)

| File | Purpose |
|------|---------|
| `services/api.js` | Axios API client with all endpoints |

### Utils (1 file)

| File | Purpose |
|------|---------|
| `utils/auth.js` | Authentication helper functions |

**Total Frontend Files: 12 files**

---

## 📊 Project Statistics

### Code Distribution

```
Backend (Java):
- Controllers:     ~500 lines
- Services:        ~800 lines
- Repositories:    ~150 lines
- Entities:        ~300 lines
- DTOs:            ~200 lines
- Security:        ~300 lines
- Config:          ~100 lines
Total Backend:     ~2,350 lines

Frontend (React):
- Pages:           ~1,200 lines
- Components:      ~100 lines
- Services:        ~150 lines
- Utils:           ~50 lines
- Styles:          ~1,800 lines
Total Frontend:    ~3,300 lines

Documentation:     ~2,400 lines

GRAND TOTAL:       ~8,050 lines of code
```

### File Count by Type

| Type | Count |
|------|-------|
| Java Files | 41 |
| JavaScript/JSX Files | 9 |
| CSS Files | 1 |
| SQL Files | 2 |
| XML Files | 1 |
| Properties Files | 1 |
| JSON Files | 1 |
| Markdown Files | 6 |
| Config Files | 3 |
| **Total** | **65 files** |

---

## 🗂️ Directory Structure

```
course-project/
│
├── 📄 Documentation (6 files)
│   ├── README.md
│   ├── SETUP.md
│   ├── PROJECT_OVERVIEW.md
│   ├── PROJECT_SUMMARY.md
│   ├── API_DOCUMENTATION.md
│   └── ARCHITECTURE_DIAGRAMS.md
│
├── 🔧 Backend (45 files)
│   ├── pom.xml
│   ├── schema.sql
│   ├── sample-data.sql
│   └── src/main/
│       ├── java/com/courseselection/
│       │   ├── CourseSelectionApplication.java (1)
│       │   ├── config/ (1)
│       │   ├── controller/ (5)
│       │   ├── dto/ (7)
│       │   ├── entity/ (6)
│       │   ├── repository/ (6)
│       │   ├── security/ (2)
│       │   └── service/ (5)
│       └── resources/
│           └── application.properties
│
├── 🎨 Frontend (12 files)
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── App.css
│       ├── components/ (1)
│       ├── pages/ (5)
│       ├── services/ (1)
│       └── utils/ (1)
│
└── 🛠️ Other
    ├── .gitignore
    └── start.sh
```

---

## 🔍 Quick Navigation Guide

### For Setup
1. Start with [SETUP.md](SETUP.md)
2. Check [README.md](README.md) for overview
3. Run `start.sh` or follow manual steps

### For Development
1. Backend code: `backend/src/main/java/com/courseselection/`
2. Frontend code: `frontend/src/`
3. Database: `backend/schema.sql` and `backend/sample-data.sql`

### For API Reference
1. [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - All endpoints
2. Controllers in `backend/src/main/java/com/courseselection/controller/`

### For Architecture Understanding
1. [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) - System design
2. [ARCHITECTURE_DIAGRAMS.md](ARCHITECTURE_DIAGRAMS.md) - Visual diagrams
3. Entity relationships in `backend/src/main/java/com/courseselection/entity/`

### For Testing
1. Use credentials from `backend/sample-data.sql`
2. Test endpoints with Postman or curl
3. Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for examples

---

## 📦 Dependencies

### Backend Dependencies (from pom.xml)
- spring-boot-starter-web
- spring-boot-starter-data-jpa
- spring-boot-starter-security
- spring-boot-starter-validation
- mysql-connector-j
- jjwt-api, jjwt-impl, jjwt-jackson (0.11.5)
- lombok

### Frontend Dependencies (from package.json)
- react (^18.2.0)
- react-dom (^18.2.0)
- react-router-dom (^6.20.0)
- axios (^1.6.2)
- jspdf (^2.5.1)
- vite (^5.0.8)
- @vitejs/plugin-react (^4.2.1)

---

## 🎯 Key Features by File

### Student Features
- **Login.jsx**: Authentication
- **StudentDashboard.jsx**: Course browsing, enrollment, timetable
- **EnrollmentService.java**: Enrollment logic, conflict detection
- **TimetableService.java**: Timetable generation

### Teacher Features
- **TeacherDashboard.jsx**: Course management UI
- **CourseService.java**: Course CRUD, section creation
- **EnrollmentService.java**: View enrolled students

### Admin Features
- **AdminDashboard.jsx**: User management, analytics
- **AdminService.java**: User operations, system stats

### Smart Features
- **EnrollmentService.java**: Waitlist, conflict detection
- **TimetableService.java**: Auto-scheduling
- **WaitlistRepository.java**: FIFO queue management

---

## 🔐 Security Files

| File | Purpose |
|------|---------|
| `SecurityConfig.java` | Spring Security configuration |
| `JwtUtil.java` | Token generation/validation |
| `JwtAuthFilter.java` | Request authentication |
| `AuthService.java` | User authentication logic |

---

## 📝 Notes

- All Java files use Lombok for boilerplate reduction
- All React components are functional with hooks
- API follows RESTful conventions
- Database uses InnoDB engine with foreign keys
- JWT tokens expire after 24 hours
- Passwords are BCrypt hashed
- CORS enabled for localhost:5173

---

## 🚀 Getting Started Checklist

- [ ] Read [README.md](README.md)
- [ ] Follow [SETUP.md](SETUP.md)
- [ ] Import `schema.sql` to MySQL
- [ ] (Optional) Import `sample-data.sql`
- [ ] Update `application.properties` with DB credentials
- [ ] Run backend: `mvn spring-boot:run`
- [ ] Run frontend: `npm run dev`
- [ ] Access: http://localhost:5173
- [ ] Test with sample accounts

---

**Last Updated**: February 2024
**Total Files**: 65
**Total Lines**: ~8,050
**Status**: ✅ Complete and Ready to Deploy
