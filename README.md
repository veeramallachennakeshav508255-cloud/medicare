# CareConnect AI – AI-Powered Hospital Appointment and Patient Assistance System

A modern, responsive, and clinical-grade healthcare platform built with **React.js** and designed for seamless integration with **Spring Boot REST APIs**.

---

## 🌟 Key Features

### 1. Landing Page & Visuals
- **Hero Section**: Headline *"Smarter Healthcare. Simpler Appointments."*, 1-click CTA buttons (*Find a Doctor*, *Ask AI Assistant*), interactive symptom pills, and high-fidelity 3D/flat vector medical illustration.
- **Live Hospital Stats**: Patients treated (15,000+), certified specialists (120+), satisfaction rate (98.6%), and average wait time (< 15 min).
- **Core Feature Cards**:
  - 🤖 **AI Health Assistant**: Natural language clinical triage & emergency detection.
  - 🔍 **Doctor Discovery**: Verified profiles, ratings, hospital locations, and transparent consultation fees.
  - 📅 **Easy Appointment Booking**: 5-step wizard with slot conflict prevention.
  - 🔒 **Secure Patient Records**: HIPAA-ready digital prescriptions and consultation records.
- **Clinical Departments & Specialists**: Center of excellence breakdown with direct booking links.
- **Emergency Hotline Ribbon**: Direct access to 24/7 trauma & emergency assistance.

---

### 2. AI Health Assistant (Chatbot)
- Prominent interactive natural language chat interface.
- Try: *"I have fever, cough and sore throat."*
- Intelligent triage engine analyzes symptoms, identifies potential respiratory/viral causes, highlights **red flag symptoms to monitor**, provides home supportive care tips, and **recommends matching doctors with a direct 1-click booking button**.
- **Urgent Emergency Alerts**: Immediately detects acute cardiac/respiratory red flags (e.g., chest pain, shortness of breath) and prompts emergency dialing (911).
- Prominently displays the medical disclaimer: *"CareConnect AI does not provide medical diagnosis."*

---

### 3. Doctor Search & Discovery
- **Search bar**: Name, symptom, or keyword matching.
- **Specialty filter**: Cardiology, Neurology, Orthopedics, Pediatrics, Dermatology, General Medicine, ENT, Gastroenterology.
- **Campus filter**: Multiple medical centers and pavilions.
- **Availability filter**: Available Today vs Any Availability.
- **Sorting**: Highest Rating, Experience, Consultation Fee (Low to High / High to Low).
- **Doctor Cards**: Photo, verified status, qualifications, experience, rating, fee, next available slot, and booking button.
- **Doctor Profile Modal**: Complete credentials, clinic hours, languages spoken, and bio.

---

### 4. Multi-Step Appointment Booking Process
A smooth 5-step wizard:
1. **Select Doctor**: Pre-selected from card or browse doctors.
2. **Select Date**: Interactive selector across the next 7 days.
3. **Select Available Time**: Slot conflict prevention dynamically disables booked slots. Choose in-person clinic or video telehealth.
4. **Enter Patient Details**: Contact info, chief complaint, symptoms, and optional medical notes.
5. **Instant Confirmation**: Generates reference ID (e.g., `CC-2026-8812`), booking summary, and syncs across all dashboards.

---

### 5. Role-Based Dashboards
- **Patient Dashboard**: Next upcoming appointment with countdown, full appointment history (All, Confirmed, Pending, Completed, Cancelled), favorite doctors, notifications, and prescription viewer.
- **Doctor Dashboard**: Today's active consultation queue, 1-click status updater (Confirm, Cancel), **Prescription & Clinical Notes Generator**, patient directory, and weekly schedule management.
- **Admin Dashboard**: Executive KPI cards, interactive 7-day/30-day appointment trends bar chart, department patient load progress bars, and doctor duty status toggle.

---

### 6. Authentication
- Clean Login and Register interface.
- Role switcher (Patient / Doctor / Admin).
- **⚡ 1-Click Demo Profile Logins**:
  - **Patient**: `patient@careconnect.ai` (Alex Morgan)
  - **Doctor**: `dr.sarah@careconnect.ai` (Dr. Sarah Mitchell)
  - **Admin**: `admin@careconnect.ai` (Eleanor Vance)
- Forgot password workflow simulation.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Lucide Icons, Vanilla CSS Design System (Custom variables, glassmorphism, responsive grid).
- **API Client**: Axios with request & response interceptors, JWT Bearer token injection, and dual-mode graceful fallback.
- **Backend Architecture**: Spring Boot 3.x, Spring Data JPA, Spring Security, JWT (ready in `/backend`).

---

## 🚀 How to Run the Project

### 1. Frontend (React + Vite)
```powershell
# Navigate to the frontend directory
cd frontend

# Install packages
npm install

# Start Vite dev server
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

### 2. Spring Boot Backend (Optional)
The frontend works out-of-the-box in demo mode, but can seamlessly connect to your Spring Boot REST server:

The backend requires Java 25 (the latest LTS release) and Maven.

```powershell
# Navigate to the backend directory
cd backend

# Configure local backend secrets (keep these out of source control)
$env:JWT_SECRET = "<your-unique-secret-at-least-32-characters>"
# Set only if your local H2 database uses a password
$env:DB_PASSWORD = "<your-local-database-password>"

# Run with Maven
mvn spring-boot:run
```
The REST API will listen on `http://localhost:8080`.
Frontend endpoints:
- `POST /api/auth/login` & `POST /api/auth/register`
- `GET /api/doctors` & `PATCH /api/doctors/{id}/availability`
- `GET /api/appointments` & `POST /api/appointments`
- `POST /api/prescriptions`
- `POST /api/ai/triage`
