# 💊 PRESCRIPTO: Pharmaceutical Resource & Efficient Stock Control Repository for Inventory Procurement & Tracking Operations

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#) 
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](#)
[![SDG 3](https://img.shields.io/badge/SDG-3%20Good%20Health%20and%20Well--being-16A546)](#sdg-alignment)


## 🚀 Project Overview

Prescripto is a web-based inventory procurement and tracking system designed to streamline pharmaceutical operations for small-to-medium pharmacy chains. It tackles challenges such as manual transaction tracking, disorganized stock management, and fragmented multi-branch operations by providing:

- **🔍 Real-time Inventory Management:** Track stock levels, expiration dates, and low-stock alerts
- **💳 Point-of-Sale Interface:** Process sales with automated receipt generation and instant inventory updates
- **🔒 Role-Based Access Control:** Secure login with **Admin** and **Staff** roles to enforce permissions
- **🏬 Multi-Branch Support:** Centralized database for consolidated or branch-specific monitoring and reporting
- **🌍 Health Impact Tracking:** Monitor essential medicine availability supporting SDG 3 targets

**Technologies Utilized:**

| Layer        | Technology                                         |
|--------------|----------------------------------------------------|
| Frontend     | React.js, Vite, Tailwind CSS, TypeScript           |
| Backend      | Node.js, Express, TypeScript, JWT                  |
| Database     | MongoDB (Mongoose ODM)                             |


## 🌱 SDG Alignment <a name="sdg-alignment"></a>

<div align="center">
  <img src="https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-03.jpg" alt="SDG 3: Good Health and Well-being" width="180px">
</div>

Prescripto actively contributes to **UN Sustainable Development Goal 3: Good Health and Well-being** through:

- **📊 Essential Medicine Tracking:** Ensuring consistent availability of vital medications
- **⏱️ Expiration Management:** Reducing medicine waste and ensuring quality
- **📈 Accessibility Metrics:** Monitoring healthcare product access across communities
- **📋 Compliance Assurance:** Supporting safe and regulated pharmaceutical practices

By improving pharmaceutical inventory management, Prescripto helps ensure medicines reach those who need them most, directly supporting SDG Target 3.8: "Achieve universal health coverage, including financial risk protection, access to quality essential health-care services and access to safe, effective, quality and affordable essential medicines and vaccines for all."


## 💾 Installation Instructions

Follow these steps to get the project up and running locally:

### 1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/prescripto.git
   cd prescripto
   ```

### 2. **Setup Backend**
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

### 3. **Setup Frontend**
Navigate to the frontend directory, install dependencies, configure environment variables, and launch the app:

```bash
cd frontend
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


## 📖 Usage Instructions

Once the servers are running, explore the system:

### 1. **Access the Application**

Open your browser to:
```
http://localhost:3000
```

### 2. **Authentication**

Use sample credentials:

| Role  | Username             | Password        |
| ----- | -------------------- | --------------- |
| Admin | `BatangasCity_Admin` | `adminPassword` |
| Staff | `BatangasCity_User`  | `userPassword`  |

### 3. **Inventory Management**

#### ➕ Add a New Medicine

1. **Navigate:** **Inventory → Add New Medicine**
2. **Fill Form:** Fill up the Add New Medicine Form with the **required details**
3. **Submit:** Click **Add Item**

> **✅ Expected:** Medicine is added successfully to the inventory when redirected to **List of Medicines** page.

#### 🔎 Search & Sort

* **Search:** **Inventory → List of Medicines**, type `Amoxicillin`
* **Sort:** Click **Medicine Name** header for A→Z, click again for Z→A

### 4. **Process a Sale**

1. **Go to:** **Log Transaction** page
2. **Select Items:** e.g., `Paracetamol` quantity `2`
3. **Record Transaction:** Click **Save Transaction** button

> **✅ Expected:** Receipt generated; inventory updates automatically.

### 5. **Reports & Transactions**

* **📊 Dashboard:** View inventory summary from all branches (admin) or specific branches (staff)
* **📑 Transaction History:** **Transactions → History**. Use branch dropdown to sort logs by date and medicine name.


## 🤝 Contributions & Course Instructor

**Team 7 Members:**

* Aldrich Amiel A. Arenas
* Kobe Andrew S. Capinpin
* Mary Kristine A. De Jose
* Jake Maxim O. Elopre
* Nerine Rosette M. Recto

**Course Instructor:**

* Ms. Fatima Marie P. Agdon, MSCS


## 🙏 Acknowledgement

Special thanks to **Ms. Fatima Marie P. Agdon** for her guidance and support. Thanks to all team members for their dedication in making Prescripto a robust and user-friendly system that contributes to better healthcare access and sustainable development goals.

<div align="center">
  <i><b>Prescripto — Tracking pills today, transforming health tomorrow.</b></i><br><i>May 2025</i>
</div>
