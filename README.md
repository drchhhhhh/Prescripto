# 💊 Prescripto: Pharmaceutical Resource & Efficient Stock Control Repository

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](#)

---

## 🚀 Project Overview

Prescripto is a web-based inventory procurement and tracking system designed to streamline pharmaceutical operations for small-to-medium pharmacy chains. It tackles challenges such as manual transaction tracking, disorganized stock management, and fragmented multi-branch operations by providing:

- **🔍 Real-time Inventory Management:** Track stock levels, expiration dates, and receive low-stock alerts.
- **💳 Point-of-Sale Interface:** Process sales with automated receipt generation and instant inventory updates.
- **🔒 Role-Based Access Control:** Secure login with **Admin** and **Staff** roles to enforce permissions.
- **🏬 Multi-Branch Support:** Centralized database for consolidated or branch-specific monitoring and reporting.

**Technologies Utilized:**

| Layer        | Technology                                         |
|--------------|----------------------------------------------------|
| Frontend     | React.js, Vite, Tailwind CSS, TypeScript, Recharts |
| Backend      | Node.js, Express, TypeScript, JWT                  |
| Database     | MongoDB (Mongoose ODM)                             |

---

## 💾 Installation Instructions

Follow these steps to get the project up and running locally:

### 1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/prescripto.git
   cd prescripto
   ```
### 🔧2. Setup Backend
Navigate to the backend directory, install dependencies, configure environment variables, and start the server:
```bash
cd backend
npm install                  # Install dependencies
cp .env.example .env         # Copy example environment file
```
Edit the `.env` file with your MongoDB URI, JWT secret, and port:
```ini
MONGO_URI=<your MongoDB URI>
JWT_SECRET=<your JWT secret>
PORT=5000
```
Then run:
```bash
npm run dev                  # Start the backend server
```

The API will be available at `http://localhost:5000/api`.

### 🔧 3. Setup Frontend
Navigate to the frontend directory, install dependencies, configure environment variables, and launch the app:

```bash
cd ../frontend
npm install                  # Install dependencies
cp .env.example .env         # Copy example environment file
```

Open `.env` and set the API URL:
```ini
VITE_API_URL=http://localhost:5000/api
```

Finally, start the frontend:

```bash
npm run dev                  # Launch the frontend app
```

The application will be accessible at `http://localhost:3000`.

---

## 📖 Usage Instructions

Once the servers are running, explore the system:

### 1. Access the Application

Open your browser to:
```
http://localhost:3000
```

### 2. Authentication

Use sample credentials or create your own:

| Role  | Username             | Password        |
| ----- | -------------------- | --------------- |
| Admin | `BatangasCity_Admin` | `adminPassword` |
| Staff | `BatangasCity_User`  | `userPassword`  |

### 3. Inventory Management

#### ➕ Add a New Medicine

1. **Navigate:** **Inventory → Add New Medicine**
2. **Fill Form:**
3. **Submit:** Click **Add Item**.

> **✅ Expected:** “Medicine added successfully” notification appears, and entry displays in **List of Medicines**.

#### 🔎 Search & Sort

* **Search:** **Inventory → List of Medicines**, type `Amoxicillin`.
* **Sort:** Click **Medicine Name** header for A→Z, click again for Z→A.
* **Filter:** **Dashboard → Medicine Shortage**, choose `Low Stock`.

### 4. Process a Sale

1. **Go to:** **Point of Sale (POS)**
2. **Select Items:** e.g., `Paracetamol` quantity `2`
3. **Checkout:** Click **Checkout**

> **✅ Expected:** Receipt generated; inventory updates automatically.

### 5. Reports & Transactions

* **📊 Dashboard:** View daily sales summary and custom date ranges.
* **📑 Transaction History:** **Transactions → History**. Use branch dropdown to filter logs by branch or view all.

---

## 🤝 Contributions & Course Instructor

**Team 7 Members:**

* Aldrich Amiel A. Arenas
* Kobe Andrew S. Capinpin
* Mary Kristine A. De Jose
* Jake Maxim O. Elopre
* Nerine Rosette M. Recto

**Course Instructor:**

* Ms. Fatima Marie P. Agdon, MSCS

---

## 🙏 Acknowledgement

Special thanks to **Ms. Fatima Marie P. Agdon** for her guidance and support. Thanks to all team members for their dedication in making Prescripto a robust and user-friendly system.

```
```
