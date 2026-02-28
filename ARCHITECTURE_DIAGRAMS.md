# System Architecture & Flow Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Student    │  │   Teacher    │  │    Admin     │         │
│  │  Dashboard   │  │  Dashboard   │  │  Dashboard   │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                  │                  │                  │
│         └──────────────────┴──────────────────┘                 │
│                            │                                     │
│                    ┌───────▼────────┐                           │
│                    │  React Router  │                           │
│                    └───────┬────────┘                           │
│                            │                                     │
│                    ┌───────▼────────┐                           │
│                    │  API Service   │                           │
│                    │    (Axios)     │                           │
│                    └───────┬────────┘                           │
└────────────────────────────┼──────────────────────────────────┘
                             │ HTTP/REST + JWT
                             │
┌────────────────────────────▼──────────────────────────────────┐
│                      APPLICATION LAYER                         │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              Spring Security + JWT Filter                 │ │
│  └──────────────────────┬───────────────────────────────────┘ │
│                         │                                       │
│  ┌──────────────────────▼───────────────────────────────────┐ │
│  │                  REST Controllers                          │ │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐           │ │
│  │  │ Auth │ │Course│ │Enroll│ │Time- │ │Admin │           │ │
│  │  └──┬───┘ └──┬───┘ └──┬───┘ │table │ └──┬───┘           │ │
│  └─────┼────────┼────────┼──────┴──┬───────┼────────────────┘ │
│        │        │        │         │       │                   │
│  ┌─────▼────────▼────────▼─────────▼───────▼────────────────┐ │
│  │                   Service Layer                            │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │ │
│  │  │   Auth   │ │  Course  │ │Enrollment│ │  Admin   │    │ │
│  │  │ Service  │ │ Service  │ │ Service  │ │ Service  │    │ │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘    │ │
│  └───────┼────────────┼────────────┼────────────┼───────────┘ │
│          │            │            │            │              │
│  ┌───────▼────────────▼────────────▼────────────▼───────────┐ │
│  │              Repository Layer (Spring Data JPA)           │ │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐           │ │
│  │  │ User │ │Course│ │Section│Enroll-│Time- │ Waitlist│   │ │
│  │  │ Repo │ │ Repo │ │ Repo │ment   │table │  Repo   │   │ │
│  │  └──┬───┘ └──┬───┘ └──┬───┘ Repo  │ Repo │         │   │ │
│  └─────┼────────┼────────┼──────┴──┬───┴──┬───┴─────────────┘ │
└────────┼────────┼────────┼─────────┼──────┼────────────────────┘
         │        │        │         │      │
┌────────▼────────▼────────▼─────────▼──────▼────────────────────┐
│                      DATA LAYER                                  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    MySQL Database                         │  │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐           │  │
│  │  │users │ │courses│sections│enroll-│time- │ waitlist│   │  │
│  │  │      │ │      │ │      │ │ments │table │         │   │  │
│  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
┌─────────┐                                                    ┌─────────┐
│ Client  │                                                    │ Server  │
└────┬────┘                                                    └────┬────┘
     │                                                              │
     │  1. POST /api/auth/login                                    │
     │     { email, password }                                     │
     ├────────────────────────────────────────────────────────────>│
     │                                                              │
     │                                      2. Validate Credentials│
     │                                         (BCrypt compare)     │
     │                                                              │
     │                                      3. Generate JWT Token  │
     │                                         (userId, role, exp)  │
     │                                                              │
     │  4. Return Token + User Info                                │
     │<────────────────────────────────────────────────────────────┤
     │     { token, userId, name, role }                           │
     │                                                              │
     │  5. Store Token in localStorage                             │
     │                                                              │
     │  6. Subsequent Requests                                     │
     │     Authorization: Bearer <token>                           │
     ├────────────────────────────────────────────────────────────>│
     │                                                              │
     │                                      7. Validate Token       │
     │                                         (JwtAuthFilter)      │
     │                                                              │
     │                                      8. Extract User Info    │
     │                                         (email, role)        │
     │                                                              │
     │                                      9. Set Authentication   │
     │                                         Context              │
     │                                                              │
     │  10. Return Protected Resource                              │
     │<────────────────────────────────────────────────────────────┤
     │                                                              │
```

## Course Enrollment Flow

```
┌─────────┐                                                    ┌─────────┐
│ Student │                                                    │ System  │
└────┬────┘                                                    └────┬────┘
     │                                                              │
     │  1. Browse Courses                                          │
     ├────────────────────────────────────────────────────────────>│
     │                                                              │
     │  2. Display Courses with Sections                           │
     │     (A, B, C, D with capacity)                              │
     │<────────────────────────────────────────────────────────────┤
     │                                                              │
     │  3. Select Section and Enroll                               │
     ├────────────────────────────────────────────────────────────>│
     │                                                              │
     │                                      4. Check if already    │
     │                                         enrolled in course  │
     │                                              │               │
     │                                              ▼               │
     │                                         ┌─────────┐          │
     │                                         │ Already │          │
     │                                         │Enrolled?│          │
     │                                         └────┬────┘          │
     │                                              │               │
     │                                    ┌─────────┴─────────┐    │
     │                                    │                   │    │
     │                                   Yes                 No    │
     │                                    │                   │    │
     │  5. Error: Already Enrolled       │                   │    │
     │<───────────────────────────────────┤                   │    │
     │                                                        │    │
     │                                      6. Check Section  │    │
     │                                         Capacity       │    │
     │                                              │         │    │
     │                                              ▼         │    │
     │                                         ┌─────────┐    │    │
     │                                         │ Section │    │    │
     │                                         │  Full?  │    │    │
     │                                         └────┬────┘    │    │
     │                                              │         │    │
     │                                    ┌─────────┴─────────┐    │
     │                                    │                   │    │
     │                                   Yes                 No    │
     │                                    │                   │    │
     │  7. Add to Waitlist               │                   │    │
     │<───────────────────────────────────┤                   │    │
     │                                                        │    │
     │                                      8. Check Time     │    │
     │                                         Conflicts      │    │
     │                                              │         │    │
     │                                              ▼         │    │
     │                                         ┌─────────┐    │    │
     │                                         │Conflict?│    │    │
     │                                         └────┬────┘    │    │
     │                                              │         │    │
     │                                    ┌─────────┴─────────┐    │
     │                                    │                   │    │
     │                                   Yes                 No    │
     │                                    │                   │    │
     │  9. Error: Time Conflict          │                   │    │
     │<───────────────────────────────────┤                   │    │
     │                                                        │    │
     │                                      10. Create        │    │
     │                                          Enrollment    │    │
     │                                                        │    │
     │                                      11. Update        │    │
     │                                          Capacity      │    │
     │                                                        │    │
     │                                      12. Generate      │    │
     │                                          Timetable     │    │
     │                                                        │    │
     │  13. Success: Enrolled                                │    │
     │<────────────────────────────────────────────────────────────┤
     │                                                              │
```

## Timetable Generation Algorithm

```
START
  │
  ▼
┌─────────────────────────┐
│ Student Enrolls in      │
│ Course                  │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Initialize:             │
│ days = [Mon-Fri]        │
│ slots = [4 time slots]  │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ FOR each day            │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ FOR each time slot      │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Check if slot is        │
│ available for student   │
└───────────┬─────────────┘
            │
            ▼
       ┌────────┐
       │Available│
       │   ?    │
       └────┬───┘
            │
      ┌─────┴─────┐
      │           │
     Yes         No
      │           │
      ▼           ▼
┌──────────┐  ┌──────────┐
│ Assign   │  │ Continue │
│ Slot     │  │ Loop     │
└────┬─────┘  └──────────┘
     │
     ▼
┌──────────────────────────┐
│ Create Timetable Entry:  │
│ - student_id             │
│ - course_id              │
│ - day                    │
│ - time_slot              │
└────┬─────────────────────┘
     │
     ▼
┌──────────────────────────┐
│ RETURN Success           │
└──────────────────────────┘

Time Slots:
- 09:00-10:30 (Morning 1)
- 10:45-12:15 (Morning 2)
- 13:15-14:45 (Afternoon 1)
- 15:00-16:30 (Afternoon 2)
```

## Waitlist Processing Flow

```
┌─────────────────────────┐
│ Section Reaches         │
│ Capacity (50)           │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ New Enrollment Attempt  │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Add Student to Waitlist │
│ (FIFO - First In First  │
│  Out)                   │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Notify Student:         │
│ "Added to Waitlist"     │
└─────────────────────────┘

            ⋮
            
┌─────────────────────────┐
│ Student Drops Course    │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Delete Enrollment       │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Decrement Section       │
│ Capacity                │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Check Waitlist          │
└───────────┬─────────────┘
            │
            ▼
       ┌────────┐
       │Waitlist│
       │ Empty? │
       └────┬───┘
            │
      ┌─────┴─────┐
      │           │
     Yes         No
      │           │
      ▼           ▼
┌──────────┐  ┌──────────────────┐
│   END    │  │ Get First Student│
└──────────┘  │ from Waitlist    │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │ Auto-Enroll      │
              │ Student          │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │ Remove from      │
              │ Waitlist         │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │ Notify Student:  │
              │ "Enrolled from   │
              │  Waitlist"       │
              └──────────────────┘
```

## Database Entity Relationships

```
┌──────────────────┐
│      User        │
│──────────────────│
│ PK: id           │
│    name          │
│    email         │
│    password      │
│    role          │
│    active        │
└────────┬─────────┘
         │
         │ 1:N (teacher)
         │
         ▼
┌──────────────────┐
│     Course       │
│──────────────────│
│ PK: id           │
│    name          │
│    credits       │
│ FK: teacher_id   │
└────────┬─────────┘
         │
         │ 1:N
         │
         ▼
┌──────────────────┐
│     Section      │
│──────────────────│
│ PK: id           │
│ FK: course_id    │
│    section_name  │
│    capacity      │
│    enrolled      │
└────────┬─────────┘
         │
         │ N:M (via Enrollment)
         │
         ▼
┌──────────────────┐
│   Enrollment     │
│──────────────────│
│ PK: id           │
│ FK: student_id   │──┐
│ FK: section_id   │  │
│    enrolled_at   │  │
└──────────────────┘  │
                      │
         ┌────────────┘
         │
         ▼
┌──────────────────┐
│    Timetable     │
│──────────────────│
│ PK: id           │
│ FK: student_id   │
│ FK: course_id    │
│    day           │
│    time_slot     │
└──────────────────┘

┌──────────────────┐
│    Waitlist      │
│──────────────────│
│ PK: id           │
│ FK: student_id   │
│ FK: section_id   │
│    added_at      │
└──────────────────┘
```

## User Role Permissions

```
┌─────────────────────────────────────────────────────────┐
│                    PERMISSIONS MATRIX                    │
├─────────────────┬───────────┬───────────┬──────────────┤
│    Feature      │  Student  │  Teacher  │    Admin     │
├─────────────────┼───────────┼───────────┼──────────────┤
│ View Courses    │     ✓     │     ✓     │      ✓       │
│ Enroll Course   │     ✓     │     ✗     │      ✗       │
│ Drop Course     │     ✓     │     ✗     │      ✗       │
│ View Timetable  │     ✓     │     ✗     │      ✗       │
│ Export PDF      │     ✓     │     ✗     │      ✗       │
│ Create Course   │     ✗     │     ✓     │      ✗       │
│ Delete Course   │     ✗     │     ✓     │      ✗       │
│ View Students   │     ✗     │     ✓     │      ✓       │
│ Manage Users    │     ✗     │     ✗     │      ✓       │
│ View Analytics  │     ✗     │     ✗     │      ✓       │
│ System Control  │     ✗     │     ✗     │      ✓       │
└─────────────────┴───────────┴───────────┴──────────────┘
```

## Request/Response Flow

```
Client Request
     │
     ▼
┌─────────────────┐
│  HTTP Request   │
│  + JWT Token    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ JwtAuthFilter   │
│ - Validate Token│
│ - Extract Claims│
│ - Set Auth      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Controller     │
│ - Route Request │
│ - Validate Input│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Service       │
│ - Business Logic│
│ - Validation    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Repository     │
│ - Database Query│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Database     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Entity → DTO   │
│  Conversion     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ JSON Response   │
└────────┬────────┘
         │
         ▼
    Client
```

---

**Visual representations of the Course Selection System architecture and workflows**
