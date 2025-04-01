import os
import pymysql
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Database connection parameters
mysql_user = os.environ.get("MYSQL_USER", "root")
mysql_password = os.environ.get("MYSQL_PASSWORD", "password")
mysql_host = os.environ.get("MYSQL_HOST", "localhost")
mysql_port = int(os.environ.get("MYSQL_PORT", "3306"))
mysql_database = os.environ.get("MYSQL_DATABASE", "mess_menu_system")

def create_database():
    """Create the database if it doesn't exist."""
    try:
        # Connect to MySQL server without specifying a database
        conn = pymysql.connect(
            host=mysql_host,
            port=mysql_port,
            user=mysql_user,
            password=mysql_password
        )
        cursor = conn.cursor()
        
        # Check if database exists
        cursor.execute(f"SHOW DATABASES LIKE '{mysql_database}'")
        result = cursor.fetchone()
        
        if not result:
            print(f"Creating database '{mysql_database}'...")
            cursor.execute(f"CREATE DATABASE {mysql_database}")
            print(f"Database '{mysql_database}' created successfully.")
        else:
            print(f"Database '{mysql_database}' already exists.")
        
        conn.close()
        return True
    except Exception as e:
        print(f"Error creating database: {e}")
        return False

if __name__ == "__main__":
    create_database()