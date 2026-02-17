# TutorHub Backend API

TutorHub Backend is a scalable and secure RESTful API built to power the TutorHub platform.  
It follows a clean MVC architecture with centralized error handling, strong validation, and role-based access control.

---

## 🚀 Overview

This backend service manages:

- User authentication and authorization
- Role-based dashboards (Admin, Tutor, Student)
- Tutor profile management
- Dynamic time-slot scheduling
- Booking system
- Reviews and ratings
- Secure data handling with validation

The system is structured for scalability, maintainability, and clean separation of concerns.

---

## 🏗️ Architecture Pattern

This project follows a **Modular Layered Architecture (MVC-inspired structure)**  
Each feature is organized as an independent module with clear separation of concerns.

### Layer Breakdown

- **Controller Layer**
  - Handles HTTP requests and responses
  - Calls service functions
  - Sends formatted API responses

- **Service Layer**
  - Contains business logic
  - Communicates with the database layer
  - Keeps controllers clean and thin

- **Data Access Layer (Prisma)**
  - Prisma ORM handles database operations
  - Schema defines models and relationships

- **Routing Layer**
  - Defines API endpoints
  - Connects routes to controllers

- **Middleware Layer**
  - Authentication & Authorization
  - Global error handling
  
 ## 🚀 Installation & Setup

Follow these steps to run the project locally.

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/sorifulhasan300/skill-bridge-backend
cd skill-bridge-backend



