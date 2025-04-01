import json
import os
import io
from datetime import datetime
from flask import render_template, redirect, url_for, flash, request, jsonify, session, send_file
from flask_login import login_user, logout_user, login_required, current_user
from urllib.parse import urlparse
from app import app, db
from models import User, Student, MessType, MealType, MessPreference, FoodSuggestion, Menu
from utils import generate_excel_report, generate_pdf_report

# Helper function to serialize objects for JSON response
def serialize_object(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    
    if hasattr(obj, '__dict__'):
        result = {}
        for key, value in obj.__dict__.items():
            if key.startswith('_'):  # Skip SQLAlchemy internal attributes
                continue
            if isinstance(value, list):
                result[key] = [serialize_object(item) for item in value]
            else:
                result[key] = serialize_object(value)
        return result
    
    return obj

# Initialize database with default data
def initialize_db():
    # Add mess types if they don't exist
    mess_types = ["Veg", "Non-Veg", "Special", "Night Mess"]
    for type_name in mess_types:
        if not MessType.query.filter_by(name=type_name).first():
            db.session.add(MessType(name=type_name))
    
    # Add meal types if they don't exist
    meal_types = ["Breakfast", "Lunch", "Snacks", "Dinner", "Night Mess"]
    for type_name in meal_types:
        if not MealType.query.filter_by(name=type_name).first():
            db.session.add(MealType(name=type_name))
    
    # Create admin user if it doesn't exist
    if not User.query.filter_by(username='admin').first():
        admin = User(username='admin', email='admin@example.com', is_admin=True)
        admin.set_password('admin123')
        db.session.add(admin)
    
    db.session.commit()

# Run initialization
with app.app_context():
    initialize_db()

# Home route
@app.route('/')
def index():
    return render_template('index.html')

# User registration
@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        reg_no = request.form.get('reg_no')
        name = request.form.get('name')
        block = request.form.get('block')
        room_number = request.form.get('room_number')
        
        # Check if username or email already exists
        if User.query.filter_by(username=username).first():
            flash('Username already exists', 'danger')
            return redirect(url_for('register'))
        
        if User.query.filter_by(email=email).first():
            flash('Email already registered', 'danger')
            return redirect(url_for('register'))
        
        # Check if registration number already exists
        if Student.query.filter_by(reg_no=reg_no).first():
            flash('Registration number already exists', 'danger')
            return redirect(url_for('register'))
        
        # Create user
        user = User(username=username, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.flush()  # Flush to get the user ID before commit
        
        # Create student profile
        student = Student(
            reg_no=reg_no,
            name=name,
            block=block,
            room_number=room_number,
            user_id=user.id
        )
        db.session.add(student)
        db.session.commit()
        
        flash('Registration successful. Please login.', 'success')
        return redirect(url_for('login'))
    
    return render_template('register.html')

# User login
@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        remember_me = 'remember_me' in request.form
        
        user = User.query.filter_by(username=username).first()
        
        if not user or not user.check_password(password):
            flash('Invalid username or password', 'danger')
            return redirect(url_for('login'))
        
        login_user(user, remember=remember_me)
        next_page = request.args.get('next')
        
        if not next_page or urlparse(next_page).netloc != '':
            if user.is_admin:
                next_page = url_for('admin')
            else:
                next_page = url_for('dashboard')
                
        return redirect(next_page)
    
    return render_template('login.html')

# User logout
@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out', 'info')
    return redirect(url_for('index'))

# Student dashboard
@app.route('/dashboard')
@login_required
def dashboard():
    if current_user.is_admin:
        return redirect(url_for('admin'))
    
    student = Student.query.filter_by(user_id=current_user.id).first()
    if not student:
        flash('Student profile not found', 'danger')
        return redirect(url_for('index'))
    
    # Get current mess preference
    mess_preference = MessPreference.query.filter_by(student_id=student.id).order_by(MessPreference.created_at.desc()).first()
    
    # Get student's food suggestions
    suggestions = FoodSuggestion.query.filter_by(student_id=student.id).order_by(FoodSuggestion.created_at.desc()).all()
    
    # Get mess types and meal types for dropdown
    mess_types = MessType.query.all()
    meal_types = MealType.query.all()
    
    return render_template(
        'dashboard.html', 
        student=student, 
        mess_preference=mess_preference, 
        suggestions=suggestions,
        mess_types=mess_types,
        meal_types=meal_types
    )

# Update mess preference
@app.route('/update_mess_preference', methods=['POST'])
@login_required
def update_mess_preference():
    student = Student.query.filter_by(user_id=current_user.id).first()
    if not student:
        if request.is_json:
            return jsonify({'error': 'Student profile not found'}), 404
        flash('Student profile not found', 'danger')
        return redirect(url_for('dashboard'))
    
    # Check if the request is a JSON request (from React) or form data
    if request.is_json:
        data = request.get_json()
        mess_name = data.get('mess_name')
        mess_type_id = data.get('mess_type')
    else:
        mess_name = request.form.get('mess_name')
        mess_type_id = request.form.get('mess_type')
    
    if not mess_name or not mess_type_id:
        if request.is_json:
            return jsonify({'error': 'All fields are required'}), 400
        flash('All fields are required', 'danger')
        return redirect(url_for('dashboard'))
    
    # Create new mess preference
    preference = MessPreference(
        mess_name=mess_name,
        student_id=student.id,
        mess_type_id=mess_type_id
    )
    db.session.add(preference)
    db.session.commit()
    
    if request.is_json:
        return jsonify({'success': True, 'message': 'Mess preference updated successfully'})
    
    flash('Mess preference updated successfully', 'success')
    return redirect(url_for('dashboard'))

# Food suggestion form
@app.route('/food_suggestion', methods=['GET', 'POST'])
@login_required
def food_suggestion():
    student = Student.query.filter_by(user_id=current_user.id).first()
    if not student:
        flash('Student profile not found', 'danger')
        return redirect(url_for('dashboard'))
    
    meal_types = MealType.query.all()
    
    if request.method == 'POST':
        food_item = request.form.get('food_item')
        meal_type_id = request.form.get('meal_type')
        feasibility_score = request.form.get('feasibility_score')
        
        if not food_item or not meal_type_id or not feasibility_score:
            flash('All fields are required', 'danger')
            return redirect(url_for('food_suggestion'))
        
        # Create new food suggestion
        suggestion = FoodSuggestion(
            food_item=food_item,
            meal_type_id=meal_type_id,
            student_id=student.id,
            feasibility_score=feasibility_score
        )
        db.session.add(suggestion)
        db.session.commit()
        
        flash('Food suggestion submitted successfully', 'success')
        return redirect(url_for('dashboard'))
    
    return render_template('food_suggestion.html', meal_types=meal_types)

# Report generation
@app.route('/report', methods=['GET', 'POST'])
@login_required
def report():
    if request.method == 'POST':
        report_type = request.form.get('report_type')
        format_type = request.form.get('format_type')
        filter_type = request.form.get('filter_type')
        filter_value = request.form.get('filter_value')
        
        if report_type == 'student':
            if filter_type == 'reg_no':
                student = Student.query.filter_by(reg_no=filter_value).first()
                if not student:
                    flash('Student not found', 'danger')
                    return redirect(url_for('report'))
                
                suggestions = FoodSuggestion.query.filter_by(student_id=student.id).all()
                preferences = MessPreference.query.filter_by(student_id=student.id).all()
                
                # Generate report
                if format_type == 'excel':
                    output = generate_excel_report('student', student, suggestions, preferences)
                    return send_file(
                        io.BytesIO(output.getvalue()),
                        as_attachment=True,
                        download_name=f'student_report_{student.reg_no}.xlsx',
                        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    )
                else:  # PDF
                    output = generate_pdf_report('student', student, suggestions, preferences)
                    return send_file(
                        io.BytesIO(output.getvalue()),
                        as_attachment=True,
                        download_name=f'student_report_{student.reg_no}.pdf',
                        mimetype='application/pdf'
                    )
        
        elif report_type == 'meal':
            meal_type = MealType.query.filter_by(id=filter_value).first()
            if not meal_type:
                flash('Meal type not found', 'danger')
                return redirect(url_for('report'))
            
            suggestions = FoodSuggestion.query.filter_by(meal_type_id=meal_type.id).all()
            
            # Generate report
            if format_type == 'excel':
                output = generate_excel_report('meal', meal_type, suggestions)
                return send_file(
                    io.BytesIO(output.getvalue()),
                    as_attachment=True,
                    download_name=f'meal_report_{meal_type.name}.xlsx',
                    mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                )
            else:  # PDF
                output = generate_pdf_report('meal', meal_type, suggestions)
                return send_file(
                    io.BytesIO(output.getvalue()),
                    as_attachment=True,
                    download_name=f'meal_report_{meal_type.name}.pdf',
                    mimetype='application/pdf'
                )
                
        elif report_type == 'weekly' or report_type == 'monthly':
            week = request.form.get('week')
            month = request.form.get('month')
            year = request.form.get('year')
            
            if report_type == 'weekly':
                menus = Menu.query.filter_by(week_number=week, month=month, year=year).all()
            else:  # monthly
                menus = Menu.query.filter_by(month=month, year=year).all()
            
            # Generate report
            if format_type == 'excel':
                output = generate_excel_report(report_type, menus, week=week, month=month, year=year)
                return send_file(
                    io.BytesIO(output.getvalue()),
                    as_attachment=True,
                    download_name=f'{report_type}_report_{month}_{year}.xlsx',
                    mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                )
            else:  # PDF
                output = generate_pdf_report(report_type, menus, week=week, month=month, year=year)
                return send_file(
                    io.BytesIO(output.getvalue()),
                    as_attachment=True,
                    download_name=f'{report_type}_report_{month}_{year}.pdf',
                    mimetype='application/pdf'
                )
    
    # Get data for filter dropdowns
    students = Student.query.all()
    meal_types = MealType.query.all()
    
    return render_template('report.html', students=students, meal_types=meal_types)

# Admin dashboard
@app.route('/admin')
@login_required
def admin():
    if not current_user.is_admin:
        flash('Access denied', 'danger')
        return redirect(url_for('dashboard'))
    
    # Get counts for dashboard stats
    student_count = Student.query.count()
    suggestion_count = FoodSuggestion.query.count()
    pending_suggestions = FoodSuggestion.query.filter_by(approved=False).count()
    
    # Get recent suggestions
    recent_suggestions = FoodSuggestion.query.order_by(FoodSuggestion.created_at.desc()).limit(10).all()
    
    # Get data for charts
    mess_types = MessType.query.all()
    mess_preferences = {}
    for mess_type in mess_types:
        count = MessPreference.query.filter_by(mess_type_id=mess_type.id).count()
        mess_preferences[mess_type.name] = count
    
    meal_types = MealType.query.all()
    meal_suggestions = {}
    for meal_type in meal_types:
        count = FoodSuggestion.query.filter_by(meal_type_id=meal_type.id).count()
        meal_suggestions[meal_type.name] = count
    
    return render_template(
        'admin.html',
        student_count=student_count,
        suggestion_count=suggestion_count,
        pending_suggestions=pending_suggestions,
        recent_suggestions=recent_suggestions,
        mess_preferences=json.dumps(mess_preferences),
        meal_suggestions=json.dumps(meal_suggestions)
    )

# Admin: Manage food suggestions
@app.route('/admin/suggestions')
@login_required
def admin_suggestions():
    if not current_user.is_admin:
        flash('Access denied', 'danger')
        return redirect(url_for('dashboard'))
    
    suggestions = FoodSuggestion.query.order_by(FoodSuggestion.created_at.desc()).all()
    
    return render_template('admin_suggestions.html', suggestions=suggestions)

# Admin: Approve suggestion
@app.route('/admin/approve_suggestion/<int:suggestion_id>')
@login_required
def approve_suggestion(suggestion_id):
    if not current_user.is_admin:
        flash('Access denied', 'danger')
        return redirect(url_for('dashboard'))
    
    suggestion = FoodSuggestion.query.get_or_404(suggestion_id)
    suggestion.approved = True
    db.session.commit()
    
    flash('Suggestion approved', 'success')
    return redirect(url_for('admin_suggestions'))

# Admin: Create menu
@app.route('/admin/menu', methods=['GET', 'POST'])
@login_required
def admin_menu():
    if not current_user.is_admin:
        flash('Access denied', 'danger')
        return redirect(url_for('dashboard'))
    
    meal_types = MealType.query.all()
    mess_types = MessType.query.all()
    
    if request.method == 'POST':
        meal_type_id = request.form.get('meal_type')
        mess_type_id = request.form.get('mess_type')
        day_of_week = request.form.get('day_of_week')
        week_number = request.form.get('week_number')
        month = request.form.get('month')
        year = request.form.get('year')
        items = request.form.get('items')
        
        # Create or update menu
        menu = Menu.query.filter_by(
            meal_type_id=meal_type_id,
            mess_type_id=mess_type_id,
            day_of_week=day_of_week,
            week_number=week_number,
            month=month,
            year=year
        ).first()
        
        if menu:
            menu.items = items
        else:
            menu = Menu(
                meal_type_id=meal_type_id,
                mess_type_id=mess_type_id,
                day_of_week=day_of_week,
                week_number=week_number,
                month=month,
                year=year,
                items=items
            )
            db.session.add(menu)
            
        db.session.commit()
        flash('Menu updated successfully', 'success')
        return redirect(url_for('admin_menu'))
    
    # Get existing menus
    menus = Menu.query.order_by(Menu.year.desc(), Menu.month.desc(), Menu.week_number.desc()).all()
    
    return render_template('admin_menu.html', meal_types=meal_types, mess_types=mess_types, menus=menus)

# View menu for students
@app.route('/menu')
@login_required
def view_menu():
    meal_types = MealType.query.all()
    mess_types = MessType.query.all()
    
    # Get student's mess preference
    student = Student.query.filter_by(user_id=current_user.id).first()
    mess_preference = None
    if student:
        mess_preference = MessPreference.query.filter_by(student_id=student.id).order_by(MessPreference.created_at.desc()).first()
    
    # Get current week, month, year
    now = datetime.now()
    week_number = int(now.strftime('%W')) % 4 + 1  # Convert to 1-4 for month weeks
    month = now.month
    year = now.year
    
    # Get menus for the current week
    menus = Menu.query.filter_by(week_number=week_number, month=month, year=year)
    
    # If student has a mess preference, filter by mess type
    if mess_preference:
        menus = menus.filter_by(mess_type_id=mess_preference.mess_type_id)
    
    menus = menus.all()
    
    return render_template('menu.html', menus=menus, meal_types=meal_types, mess_types=mess_types)

# API endpoint for dashboard data
@app.route('/api/dashboard_data')
@login_required
def dashboard_data():
    if current_user.is_admin:
        return jsonify({'error': 'Admin users do not have a dashboard'})
    
    student = Student.query.filter_by(user_id=current_user.id).first()
    if not student:
        return jsonify({'error': 'Student profile not found'})
    
    # Get current mess preference
    mess_preference = MessPreference.query.filter_by(student_id=student.id).order_by(MessPreference.created_at.desc()).first()
    
    # Get student's food suggestions
    suggestions = FoodSuggestion.query.filter_by(student_id=student.id).order_by(FoodSuggestion.created_at.desc()).all()
    
    # Get mess types for dropdown
    mess_types = MessType.query.all()
    
    # Prepare response data with serialization
    student_data = {
        'id': student.id,
        'reg_no': student.reg_no,
        'name': student.name,
        'block': student.block,
        'room_number': student.room_number
    }
    
    mess_preference_data = None
    if mess_preference:
        mess_preference_data = {
            'id': mess_preference.id,
            'mess_name': mess_preference.mess_name,
            'created_at': mess_preference.created_at.isoformat(),
            'mess_type': {
                'id': mess_preference.mess_type.id,
                'name': mess_preference.mess_type.name
            }
        }
    
    suggestions_data = []
    for suggestion in suggestions:
        suggestions_data.append({
            'id': suggestion.id,
            'food_item': suggestion.food_item,
            'feasibility_score': suggestion.feasibility_score,
            'approved': suggestion.approved,
            'created_at': suggestion.created_at.isoformat(),
            'meal_type': {
                'id': suggestion.meal_type.id,
                'name': suggestion.meal_type.name
            }
        })
    
    mess_types_data = []
    for mess_type in mess_types:
        mess_types_data.append({
            'id': mess_type.id,
            'name': mess_type.name
        })
    
    return jsonify({
        'student': student_data,
        'mess_preference': mess_preference_data,
        'suggestions': suggestions_data,
        'mess_types': mess_types_data
    })
