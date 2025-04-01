#!/bin/bash
echo "Setting up Mess Menu Formation System..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -e .

# Check if python-dotenv is installed
if ! pip show python-dotenv > /dev/null 2>&1; then
    echo "Installing python-dotenv..."
    pip install python-dotenv
fi

# Initialize database
echo "Initializing database..."
python init_db.py

# Run the application
echo "Starting the application..."
python main.py