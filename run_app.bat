@echo off
echo Setting up Mess Menu Formation System...

REM Check if virtual environment exists
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate

REM Install dependencies
echo Installing dependencies...
pip install -e .

REM Check if python-dotenv is installed
pip show python-dotenv >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing python-dotenv...
    pip install python-dotenv
)

REM Initialize database
echo Initializing database...
python init_db.py

REM Run the application
echo Starting the application...
python main.py

pause