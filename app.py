import os
import logging
import pymysql
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from flask_login import LoginManager

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Register MySQL driver
pymysql.install_as_MySQLdb()

# Create base class for SQLAlchemy models
class Base(DeclarativeBase):
    pass

# Initialize Flask extensions
db = SQLAlchemy(model_class=Base)
login_manager = LoginManager()

# Create the app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key")

# MySQL database configuration
# Use environment variables if available, otherwise use default values for local development
mysql_user = os.environ.get("MYSQL_USER", "root")
mysql_password = os.environ.get("MYSQL_PASSWORD", "password")
mysql_host = os.environ.get("MYSQL_HOST", "localhost")
mysql_port = os.environ.get("MYSQL_PORT", "3306")
mysql_database = os.environ.get("MYSQL_DATABASE", "mess_menu_system")

# Configure the database
mysql_uri = f"mysql://{mysql_user}:{mysql_password}@{mysql_host}:{mysql_port}/{mysql_database}"
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", mysql_uri)
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize extensions with the app
db.init_app(app)
login_manager.init_app(app)
login_manager.login_view = 'login'

with app.app_context():
    # Import models here to avoid circular imports
    import models
    
    # Drop all tables and create them again (reset the database)
    db.drop_all()
    db.create_all()
