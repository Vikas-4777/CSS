# Quick Setup Guide

## Step-by-Step Installation

### 1. Prerequisites Check

Ensure you have installed:
- ✅ Java 17 or higher (`java -version`)
- ✅ Maven 3.6+ (`mvn -version`)
- ✅ MySQL 8.0+ (`mysql --version`)
- ✅ Node.js 18+ (`node -version`)
- ✅ npm (`npm -version`)

### 2. Database Setup

**Option A: Using MySQL Command Line**
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE course_selection_db;

# Exit MySQL
exit;

# Import schema
mysql -u root -p course_selection_db < backend/schema.sql

# (Optional) Import sample data
mysql -u root -p course_selection_db < backend/sample-data.sql
```

**Option B: Using MySQL Workbench**
1. Open MySQL Workbench
2. Create new schema: `course_selection_db`
3. Open and execute `backend/schema.sql`
4. (Optional) Execute `backend/sample-data.sql`

### 3. Configure Database Connection

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### 4. Start Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Wait for: `Started CourseSelectionApplication in X seconds`

Backend runs on: **http://localhost:8080**

### 5. Start Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: **http://localhost:5173**

### 6. Access Application

Open browser: **http://localhost:5173**

## Test Accounts

If you imported sample-data.sql, use these credentials:

**Password for all accounts: `password123`**

| Role | Email | Description |
|------|-------|-------------|
| Admin | admin@test.com | Full system access |
| Teacher | john.smith@test.com | Course management |
| Teacher | sarah.johnson@test.com | Course management |
| Student | alice@test.com | Course enrollment |
| Student | bob@test.com | Course enrollment |

## Quick Start Script

For Unix/Linux/Mac:
```bash
chmod +x start.sh
./start.sh
```

## Troubleshooting

### Port Already in Use

**Backend (8080):**
```bash
# Find process
lsof -i :8080
# Kill process
kill -9 <PID>
```

**Frontend (5173):**
```bash
# Find process
lsof -i :5173
# Kill process
kill -9 <PID>
```

### MySQL Connection Failed

1. Check MySQL is running:
   ```bash
   # Mac
   brew services list
   
   # Linux
   sudo systemctl status mysql
   ```

2. Verify credentials in `application.properties`

3. Test connection:
   ```bash
   mysql -u root -p -e "SHOW DATABASES;"
   ```

### Maven Build Failed

```bash
# Clear Maven cache
mvn clean

# Rebuild
mvn clean install -U
```

### npm Install Failed

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## API Testing

Use Postman or curl to test APIs:

**Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@test.com","password":"password123"}'
```

**Get Courses (with token):**
```bash
curl -X GET http://localhost:8080/api/courses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Development Tips

### Hot Reload

- **Frontend**: Vite provides instant hot reload
- **Backend**: Use Spring Boot DevTools for auto-restart

### Database Changes

After modifying entities:
```bash
# Drop and recreate tables
mysql -u root -p course_selection_db < backend/schema.sql
```

Or set in `application.properties`:
```properties
spring.jpa.hibernate.ddl-auto=create-drop
```

### View Logs

**Backend logs**: Console output from `mvn spring-boot:run`

**Frontend logs**: Browser console (F12)

## Production Deployment

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
# Deploy 'dist' folder to web server
```

### Environment Variables

For production, use environment variables:

```bash
export DB_URL=jdbc:mysql://production-host:3306/course_selection_db
export DB_USER=prod_user
export DB_PASS=secure_password
export JWT_SECRET=your-256-bit-secret
```

## Next Steps

1. ✅ Register a new student account
2. ✅ Browse available courses
3. ✅ Enroll in courses
4. ✅ View your timetable
5. ✅ Export timetable as PDF

## Support

For issues:
1. Check logs for error messages
2. Verify all services are running
3. Ensure database is accessible
4. Check firewall settings

## Features to Explore

- 🎓 Student: Course enrollment with real-time capacity
- 👨‍🏫 Teacher: Course and section management
- 👨‍💼 Admin: User management and analytics
- 📅 Automatic timetable generation
- 📊 Waitlist system
- 🔍 Search and filter courses
- 📄 PDF export
- 🔐 JWT authentication
