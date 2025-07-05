# Streetfood Sales & Expense Tracker

A full-stack web application for managing sales logs and expenses for streetfood vendors. Built with Node.js (Express) for the backend and React (MUI) for the frontend, with a MySQL database.

---

## Step-by-Step Guide to Run the Application

### 1. Clone the repository
```sh
git clone <your-repo-url>
cd streetfood
```

### 2. Install all dependencies (Monorepo Setup)
This project uses npm workspaces to manage dependencies for both backend and frontend.

#### Install all dependencies at once (recommended):
```sh
npm install
```

#### Or, install dependencies individually:
- **Backend dependencies:**
  ```sh
  cd backend
  npm install
  # Installs: express, cors, dotenv, mysql2, nodemon
  ```
- **Frontend dependencies:**
  ```sh
  cd ../frontend
  npm install
  # Installs: react, @mui/material, axios, react-toastify, lucide-react, etc.
  ```

### 3. Set up the MySQL database
Follow these steps to set up the MySQL database for this application:

#### 1. Install MySQL
- Download and install MySQL Community Server from [https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/)
- Follow the installation instructions for your operating system.

#### 2. Start MySQL Server
- Make sure your MySQL server is running locally.

#### 3. Download the SQL Files

#### 4. Import the Database Schema
- Open your MySQL client (e.g., MySQL Workbench, Sequel Ace, or command line).
- Run the contents of `db_setup.sql` to create the database and tables:
  ```sh
  # Example using the MySQL CLI:
  mysql -u <username> -p < db_setup.sql
  # Or open the file in your GUI client and execute all statements
  ```

#### 5. (Optional) Import Sample Data
- To add sample expenses, run:
  ```sh
  mysql -u <username> -p < expenses.sql
  ```

### 6. Configure database connection
- Edit `/backend/config/db.js` to match your MySQL username, password, and database name.

### 7. Start the application
```sh
npm run dev
```
This will concurrently start both the backend (API server) and frontend (React app).
- Backend runs on [http://localhost:3000](http://localhost:3000)
- Frontend runs on [http://localhost:5173](http://localhost:5173)

---

## Usage
- Open the frontend URL in your browser.
- Select a stall and date range to view or add sales logs and expenses.
- Use the Add buttons to create new sales logs or expenses.
- Net income is automatically calculated.

---

## Project Structure
```
/ (root)
  backend/      # Express API, models, controllers, routes, SQL
  frontend/     # React app (MUI, main UI)
  README.md     # This file
  package.json  # Monorepo config
```

---

## Troubleshooting
- If you change the database config, restart the backend server.
- If you add new dependencies, run `npm install` at the root.
- For MySQL errors, check your credentials and that the database is created.

---

## License
MIT
