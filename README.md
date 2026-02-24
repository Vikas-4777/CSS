# Course Selection System

A full-stack web application for managing student course enrollments with automatic timetable generation.

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Spring Boot 3.2 (Java 17)
- **Database**: MySQL 8
- **Authentication**: JWT

## Features

### Student Module
- Register and login
- Browse all available courses
- View 4 sections (A, B, C, D) per course with capacity tracking (50 students max)
- Enroll in one section per course
- Automatic timetable generation (9 AM - 5 PM)
- View weekly timetable grid
- Export timetable as PDF
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

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+
- Node.js 18+ and npm

## Database Setup

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

## Backend Setup

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

## Frontend Setup

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

## Default Test Accounts

After running the schema.sql, you can use these accounts (password: "password"):

- **Admin**: admin@test.com
- **Teacher**: teacher@test.com
- **Student**: student@test.com

Note: The passwords in schema.sql are bcrypt hashed. You'll need to register new accounts or update the hashes.

## API Endpoints

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

## Project Structure

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

## Key Features Implementation

### Automatic Timetable Generation
- Time slots: 09:00-10:30, 10:45-12:15, 13:15-14:45, 15:00-16:30
- Includes breaks between sessions
- Prevents time conflicts
- Distributes courses across weekdays

### Enrollment Constraints
- Students cannot enroll in the same course twice
- Section capacity limited to 50 students
- Automatic waitlist when section is full
- Real-time capacity updates

### Waitlist System
- Automatically adds students to waitlist when section is full
- FIFO processing when spots become available
- Automatic enrollment from waitlist when student drops

### Search and Filter
- Search courses by name
- Real-time filtering
- Sort by availability

## Building for Production

### Backend
```bash
cd backend
mvn clean package
java -jar target/course-selection-system-1.0.0.jar
```

### Frontend
```bash
cd frontend
npm run build
```

Deploy the `dist` folder to your web server.

## Troubleshooting

### Backend won't start
- Check MySQL is running
- Verify database credentials
- Ensure port 8080 is available

### Frontend can't connect to backend
- Verify backend is running on port 8080
- Check CORS configuration in SecurityConfig.java
- Update API_URL in frontend/src/services/api.js if needed

### Database errors
- Run schema.sql to create tables
- Check Hibernate ddl-auto setting
- Verify MySQL version compatibility

## License

MIT License
