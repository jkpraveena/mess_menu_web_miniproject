# Mess Menu Formation System

A web application for collecting student data, managing mess preferences, and generating reports.

## Features

- Student registration and login
- Mess preference management
- Food suggestion submission
- Menu viewing
- Report generation in Excel/PDF formats
- Admin dashboard with approval system
- React components for enhanced UI

## Setup for VS Code

### Prerequisites

- Python 3.8+
- MySQL server
- VS Code

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/mess-menu-system.git
   cd mess-menu-system
   ```

2. **Create a virtual environment**

   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**

   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies**

   ```bash
   pip install -e .
   ```

5. **Create MySQL database**

   ```sql
   CREATE DATABASE mess_menu_system;
   ```

6. **Create a .env file**

   Create a file named `.env` in the project root with the following content:

   ```
   FLASK_APP=main.py
   FLASK_ENV=development
   SESSION_SECRET=your-secret-key
   MYSQL_USER=root
   MYSQL_PASSWORD=your-mysql-password
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_DATABASE=mess_menu_system
   ```

   Replace `your-secret-key` and `your-mysql-password` with your own values.

7. **Run the application**

   ```bash
   python main.py
   ```

   Or using Flask CLI:

   ```bash
   flask run
   ```

8. **Access the application**

   Open a browser and go to http://localhost:5000

## Default Admin Credentials

- Username: admin
- Password: admin123

## Project Structure

- `app.py`: Flask application setup and database configuration
- `main.py`: Entry point for running the application
- `models.py`: Database models for SQLAlchemy
- `routes.py`: Route handlers for all application endpoints
- `utils.py`: Utility functions for report generation
- `templates/`: HTML templates using Jinja2
- `static/`: Static files (CSS, JavaScript, etc.)
  - `css/`: Custom CSS styles
  - `js/`: JavaScript files
    - `react/`: React components
    - `main.js`: Main JavaScript functions
    - `validation.js`: Form validation functions
    - `charts.js`: Chart generation functions

## Development Notes

- The application uses Blueprint for CSS styling with a dark theme
- Form validation is handled both client-side and server-side
- React components are used for the dashboard UI
- Report generation supports both Excel and PDF formats