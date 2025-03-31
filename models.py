from datetime import datetime
from app import db, login_manager
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    student = db.relationship('Student', backref='user', uselist=False)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def __repr__(self):
        return f'<User {self.username}>'

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    reg_no = db.Column(db.String(20), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    block = db.Column(db.String(50), nullable=False)
    room_number = db.Column(db.String(10), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    mess_preferences = db.relationship('MessPreference', backref='student', lazy=True)
    food_suggestions = db.relationship('FoodSuggestion', backref='student', lazy=True)
    
    def __repr__(self):
        return f'<Student {self.reg_no}>'

class MessType(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    preferences = db.relationship('MessPreference', backref='mess_type', lazy=True)
    
    def __repr__(self):
        return f'<MessType {self.name}>'

class MealType(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    suggestions = db.relationship('FoodSuggestion', backref='meal_type', lazy=True)
    
    def __repr__(self):
        return f'<MealType {self.name}>'

class MessPreference(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    mess_name = db.Column(db.String(100), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)
    mess_type_id = db.Column(db.Integer, db.ForeignKey('mess_type.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<MessPreference {self.mess_name}>'

class FoodSuggestion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    food_item = db.Column(db.String(100), nullable=False)
    meal_type_id = db.Column(db.Integer, db.ForeignKey('meal_type.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)
    feasibility_score = db.Column(db.Integer, nullable=False)  # Score from 1-5
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    approved = db.Column(db.Boolean, default=False)
    
    def __repr__(self):
        return f'<FoodSuggestion {self.food_item}>'

class Menu(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    meal_type_id = db.Column(db.Integer, db.ForeignKey('meal_type.id'), nullable=False)
    mess_type_id = db.Column(db.Integer, db.ForeignKey('mess_type.id'), nullable=False)
    day_of_week = db.Column(db.Integer, nullable=False)  # 0-6 for Monday-Sunday
    week_number = db.Column(db.Integer, nullable=False)  # Week number of the month
    month = db.Column(db.Integer, nullable=False)  # 1-12 for Jan-Dec
    year = db.Column(db.Integer, nullable=False)
    items = db.Column(db.Text, nullable=False)  # JSON string of menu items
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    meal_type = db.relationship('MealType')
    mess_type = db.relationship('MessType')
    
    def __repr__(self):
        return f'<Menu for {self.mess_type.name}, {self.meal_type.name}, Week {self.week_number}>'
