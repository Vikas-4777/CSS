# Course Selection System - Project Overview

## 🎯 Project Summary

A comprehensive full-stack web application for managing student course enrollments with intelligent timetable generation, built with modern technologies and clean architecture.

## 🏗️ Architecture

### Backend Architecture (Spring Boot)

```
┌─────────────────────────────────────────┐
│           REST Controllers              │
│  (AuthController, CourseController,     │
│   EnrollmentController, etc.)           │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│          Service Layer                   │
│  (Business Logic, Validation,            │
│   Timetable Generation)                  │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│       Repository Layer (JPA)             │
│  (Data Access, Query Methods)            │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│          MySQL Database                  │
│  (Persistent Storage)                    │
└──────────────────────────────────────────┘
```

### Frontend Architecture (React)

```
┌─────────────────────────────────────────┐
│              Pages                       │
│  (Login, Register, Dashboards)           │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│           Components                     │
│  (Sidebar, Tables, Cards)                │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│          Services (API)                  │
│  (Axios HTTP Client)                     │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Backend REST API                 │
└──────────────────────────────────────────┘
```

## 📊 Database Schema

### Entity Relationships

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

1. **users**: User accounts (students, teachers, admins)
2. **courses**: Course information
3. **sections**: Course sections (A, B, C, D)
4. **enrollments**: Student-section relationships
5. **timetable**: Generated schedules
6. **waitlist**: Queue for full sections

## 🔐 Security Implementation

### JWT Authentication Flow

```
1. User Login
   ↓
2. Validate Credentials
   ↓
3. Generate JWT Token
   ↓
4. Return Token to Client
   ↓
5. Client Stores Token
   ↓
6. Include Token in Headers
   ↓
7. Backend Validates Token
   ↓
8. Grant Access to Resources
```

### Security Features

- ✅ Password encryption (BCrypt)
- ✅ JWT token-based authentication
- ✅ Role-based access control (RBAC)
- ✅ CORS configuration
- ✅ Stateless session management
- ✅ Protected API endpoints

## 🎓 Core Features

### 1. Student Module

**Course Enrollment:**
- Browse all available courses
- View 4 sections per course (A, B, C, D)
- Real-time capacity tracking (X/50)
- One section per course constraint
- Duplicate enrollment prevention

**Timetable Management:**
- Automatic generation on enrollment
- Time slots: 9:00 AM - 5:00 PM
- Includes breaks (morning, lunch, afternoon)
- Conflict detection
- Weekly grid view
- PDF export functionality

**Course Management:**
- View enrolled courses
- Drop courses before deadline
- Enrollment history

### 2. Teacher Module

**Course Management:**
- Create new courses
- Automatic section generation (A, B, C, D)
- View all taught courses
- Delete courses

**Section Management:**
- View section capacity (e.g., 32/50)
- Track enrolled students
- View student lists per section

### 3. Admin Module

**User Management:**
- View all users (students, teachers, admins)
- Activate/deactivate accounts
- Delete users
- Role-based filtering

**System Analytics:**
- Total students count
- Total teachers count
- Total courses count
- Total enrollments count

**Course Oversight:**
- View all courses
- Monitor section capacities
- System-wide statistics

## 🚀 Smart Features

### 1. Automatic Timetable Generation

**Algorithm:**
```
For each enrolled course:
  1. Find available time slot
  2. Check for conflicts
  3. Assign to earliest available slot
  4. Update timetable
```

**Time Slots:**
- Morning: 09:00-10:30, 10:45-12:15
- Afternoon: 13:15-14:45, 15:00-16:30
- Days: Monday to Friday

### 2. Waitlist System

**Flow:**
```
Section Full?
  ↓ Yes
Add to Waitlist (FIFO)
  ↓
Student Drops Course?
  ↓ Yes
Auto-enroll First in Waitlist
  ↓
Send Notification
```

### 3. Conflict Detection

**Checks:**
- ✅ Same course enrollment
- ✅ Time slot conflicts
- ✅ Section capacity
- ✅ Maximum course load

### 4. Search & Filter

- Search by course name
- Filter by availability
- Sort by credits
- Real-time updates

## 📱 UI/UX Design

### Design Principles

1. **Clean & Minimal**: No clutter, focus on functionality
2. **Professional**: Business-appropriate color scheme
3. **Responsive**: Works on all screen sizes
4. **Intuitive**: Easy navigation, clear actions
5. **Consistent**: Uniform styling across pages

### Color Palette

- Primary: `#667eea` (Purple-blue)
- Secondary: `#6c757d` (Gray)
- Success: `#28a745` (Green)
- Danger: `#dc3545` (Red)
- Background: `#f5f7fa` (Light gray)
- Text: `#2c3e50` (Dark blue-gray)

### Components

- **Sidebar Navigation**: Fixed left sidebar
- **Cards**: White background, subtle shadow
- **Tables**: Clean rows, hover effects
- **Buttons**: Rounded, color-coded by action
- **Forms**: Simple, clear labels
- **Modals**: Centered overlay

## 🔄 API Design

### RESTful Principles

- **GET**: Retrieve resources
- **POST**: Create resources
- **PUT**: Update resources
- **DELETE**: Remove resources

### Response Format

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Handling

```json
{
  "error": "Error message",
  "status": 400
}
```

## 📈 Performance Optimizations

1. **Database Indexing**: On foreign keys and search fields
2. **Lazy Loading**: JPA relationships
3. **Connection Pooling**: HikariCP
4. **Frontend Caching**: React state management
5. **Efficient Queries**: JPA query methods

## 🧪 Testing Strategy

### Backend Testing
- Unit tests for services
- Integration tests for controllers
- Repository tests

### Frontend Testing
- Component testing
- API integration testing
- E2E testing

## 📦 Deployment

### Development
```bash
Backend: mvn spring-boot:run
Frontend: npm run dev
```

### Production
```bash
Backend: java -jar app.jar
Frontend: npm run build → Deploy dist/
```

## 🔮 Future Enhancements

1. **Email Notifications**: Enrollment confirmations
2. **Mobile App**: React Native version
3. **Grade Management**: Track student grades
4. **Attendance System**: Mark attendance
5. **Course Prerequisites**: Enforce requirements
6. **Payment Integration**: Course fees
7. **Discussion Forums**: Course-specific forums
8. **File Sharing**: Course materials
9. **Calendar Integration**: Export to Google Calendar
10. **Advanced Analytics**: Enrollment trends

## 📚 Technology Stack Details

### Backend
- **Spring Boot 3.2**: Framework
- **Spring Security**: Authentication
- **Spring Data JPA**: ORM
- **Hibernate**: JPA implementation
- **MySQL Connector**: Database driver
- **JJWT**: JWT library
- **Lombok**: Boilerplate reduction
- **Maven**: Build tool

### Frontend
- **React 18**: UI library
- **Vite**: Build tool
- **React Router**: Navigation
- **Axios**: HTTP client
- **jsPDF**: PDF generation

### Database
- **MySQL 8**: Relational database
- **InnoDB**: Storage engine

## 🎯 Key Achievements

✅ Full CRUD operations for all entities
✅ JWT-based authentication system
✅ Role-based access control
✅ Automatic timetable generation
✅ Real-time capacity tracking
✅ Waitlist management
✅ PDF export functionality
✅ Responsive design
✅ Clean architecture
✅ RESTful API design
✅ Comprehensive error handling
✅ Input validation
✅ Transaction management

## 📝 Code Quality

- **Layered Architecture**: Separation of concerns
- **DTOs**: Clean API contracts
- **Service Layer**: Business logic isolation
- **Repository Pattern**: Data access abstraction
- **Component Reusability**: DRY principle
- **Consistent Naming**: Clear conventions
- **Error Handling**: Graceful failures
- **Code Comments**: Where necessary

## 🎓 Learning Outcomes

This project demonstrates:
- Full-stack development skills
- RESTful API design
- Database modeling
- Authentication & authorization
- State management
- Responsive UI design
- Problem-solving (timetable generation)
- Software architecture
- Version control
- Documentation

---

**Built with ❤️ using modern web technologies**
