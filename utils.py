import io
import pandas as pd
from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

def generate_excel_report(report_type, *args, **kwargs):
    output = io.BytesIO()
    
    if report_type == 'student':
        student, suggestions, preferences = args
        
        # Create a Pandas Excel writer
        writer = pd.ExcelWriter(output, engine='xlsxwriter')
        
        # Student information
        student_data = {
            'Registration Number': [student.reg_no],
            'Name': [student.name],
            'Block': [student.block],
            'Room Number': [student.room_number]
        }
        student_df = pd.DataFrame(student_data)
        student_df.to_excel(writer, sheet_name='Student Info', index=False)
        
        # Mess preferences
        if preferences:
            pref_data = {
                'Mess Name': [p.mess_name for p in preferences],
                'Mess Type': [p.mess_type.name for p in preferences],
                'Date': [p.created_at.strftime('%Y-%m-%d') for p in preferences]
            }
            pref_df = pd.DataFrame(pref_data)
            pref_df.to_excel(writer, sheet_name='Mess Preferences', index=False)
        
        # Food suggestions
        if suggestions:
            sugg_data = {
                'Food Item': [s.food_item for s in suggestions],
                'Meal Type': [s.meal_type.name for s in suggestions],
                'Feasibility Score': [s.feasibility_score for s in suggestions],
                'Approved': [s.approved for s in suggestions],
                'Date': [s.created_at.strftime('%Y-%m-%d') for s in suggestions]
            }
            sugg_df = pd.DataFrame(sugg_data)
            sugg_df.to_excel(writer, sheet_name='Food Suggestions', index=False)
        
        writer.save()
    
    elif report_type == 'meal':
        meal_type, suggestions = args
        
        # Create a Pandas Excel writer
        writer = pd.ExcelWriter(output, engine='xlsxwriter')
        
        # Meal type statistics
        data = {
            'Food Item': [s.food_item for s in suggestions],
            'Student': [s.student.name for s in suggestions],
            'Reg No': [s.student.reg_no for s in suggestions],
            'Feasibility Score': [s.feasibility_score for s in suggestions],
            'Approved': [s.approved for s in suggestions],
            'Date': [s.created_at.strftime('%Y-%m-%d') for s in suggestions]
        }
        df = pd.DataFrame(data)
        df.to_excel(writer, sheet_name=f'{meal_type.name} Suggestions', index=False)
        
        # Summary sheet
        summary_data = {
            'Statistic': ['Total Suggestions', 'Average Feasibility', 'Approved Suggestions'],
            'Value': [
                len(suggestions),
                sum(s.feasibility_score for s in suggestions) / len(suggestions) if suggestions else 0,
                sum(1 for s in suggestions if s.approved)
            ]
        }
        summary_df = pd.DataFrame(summary_data)
        summary_df.to_excel(writer, sheet_name='Summary', index=False)
        
        writer.save()
    
    elif report_type in ['weekly', 'monthly']:
        menus = args[0]
        week = kwargs.get('week')
        month = kwargs.get('month')
        year = kwargs.get('year')
        
        # Create a Pandas Excel writer
        writer = pd.ExcelWriter(output, engine='xlsxwriter')
        
        # Convert month number to name
        month_name = datetime(year=int(year), month=int(month), day=1).strftime('%B')
        
        # Menu data
        data = {
            'Day': [menu.day_of_week for menu in menus],
            'Meal Type': [menu.meal_type.name for menu in menus],
            'Mess Type': [menu.mess_type.name for menu in menus],
            'Items': [menu.items for menu in menus]
        }
        df = pd.DataFrame(data)
        
        if report_type == 'weekly':
            sheet_name = f'Week {week} of {month_name} {year}'
        else:
            sheet_name = f'{month_name} {year}'
            
        df.to_excel(writer, sheet_name=sheet_name, index=False)
        
        writer.save()
    
    output.seek(0)
    return output

def generate_pdf_report(report_type, *args, **kwargs):
    output = io.BytesIO()
    
    # Create PDF document
    doc = SimpleDocTemplate(output, pagesize=letter)
    elements = []
    styles = getSampleStyleSheet()
    
    if report_type == 'student':
        student, suggestions, preferences = args
        
        # Add title
        title = Paragraph(f"Student Report: {student.name} ({student.reg_no})", styles['Title'])
        elements.append(title)
        elements.append(Spacer(1, 12))
        
        # Student information
        elements.append(Paragraph("Student Information", styles['Heading2']))
        student_data = [
            ["Registration Number", student.reg_no],
            ["Name", student.name],
            ["Block", student.block],
            ["Room Number", student.room_number]
        ]
        student_table = Table(student_data, colWidths=[200, 300])
        student_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('PADDING', (0, 0), (-1, -1), 6)
        ]))
        elements.append(student_table)
        elements.append(Spacer(1, 12))
        
        # Mess preferences
        if preferences:
            elements.append(Paragraph("Mess Preferences", styles['Heading2']))
            pref_data = [["Mess Name", "Mess Type", "Date"]]
            for p in preferences:
                pref_data.append([
                    p.mess_name,
                    p.mess_type.name,
                    p.created_at.strftime('%Y-%m-%d')
                ])
            pref_table = Table(pref_data, colWidths=[160, 160, 160])
            pref_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('PADDING', (0, 0), (-1, -1), 6)
            ]))
            elements.append(pref_table)
            elements.append(Spacer(1, 12))
        
        # Food suggestions
        if suggestions:
            elements.append(Paragraph("Food Suggestions", styles['Heading2']))
            sugg_data = [["Food Item", "Meal Type", "Feasibility", "Approved", "Date"]]
            for s in suggestions:
                sugg_data.append([
                    s.food_item,
                    s.meal_type.name,
                    str(s.feasibility_score),
                    "Yes" if s.approved else "No",
                    s.created_at.strftime('%Y-%m-%d')
                ])
            sugg_table = Table(sugg_data, colWidths=[120, 120, 80, 80, 100])
            sugg_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('PADDING', (0, 0), (-1, -1), 6)
            ]))
            elements.append(sugg_table)
    
    elif report_type == 'meal':
        meal_type, suggestions = args
        
        # Add title
        title = Paragraph(f"Meal Report: {meal_type.name}", styles['Title'])
        elements.append(title)
        elements.append(Spacer(1, 12))
        
        # Summary statistics
        elements.append(Paragraph("Summary Statistics", styles['Heading2']))
        summary_data = [
            ["Total Suggestions", str(len(suggestions))],
            ["Average Feasibility", str(sum(s.feasibility_score for s in suggestions) / len(suggestions) if suggestions else 0)],
            ["Approved Suggestions", str(sum(1 for s in suggestions if s.approved))]
        ]
        summary_table = Table(summary_data, colWidths=[200, 300])
        summary_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('PADDING', (0, 0), (-1, -1), 6)
        ]))
        elements.append(summary_table)
        elements.append(Spacer(1, 12))
        
        # Suggestion details
        if suggestions:
            elements.append(Paragraph("Suggestion Details", styles['Heading2']))
            sugg_data = [["Food Item", "Student", "Reg No", "Feasibility", "Approved", "Date"]]
            for s in suggestions:
                sugg_data.append([
                    s.food_item,
                    s.student.name,
                    s.student.reg_no,
                    str(s.feasibility_score),
                    "Yes" if s.approved else "No",
                    s.created_at.strftime('%Y-%m-%d')
                ])
            sugg_table = Table(sugg_data, colWidths=[100, 100, 80, 60, 60, 80])
            sugg_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('PADDING', (0, 0), (-1, -1), 6)
            ]))
            elements.append(sugg_table)
    
    elif report_type in ['weekly', 'monthly']:
        menus = args[0]
        week = kwargs.get('week')
        month = kwargs.get('month')
        year = kwargs.get('year')
        
        # Convert month number to name
        month_name = datetime(year=int(year), month=int(month), day=1).strftime('%B')
        
        # Add title
        if report_type == 'weekly':
            title = Paragraph(f"Weekly Menu Report: Week {week} of {month_name} {year}", styles['Title'])
        else:
            title = Paragraph(f"Monthly Menu Report: {month_name} {year}", styles['Title'])
        elements.append(title)
        elements.append(Spacer(1, 12))
        
        # Menu details
        if menus:
            elements.append(Paragraph("Menu Details", styles['Heading2']))
            menu_data = [["Day", "Meal Type", "Mess Type", "Items"]]
            
            # Map day numbers to names
            day_names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            
            for menu in menus:
                menu_data.append([
                    day_names[int(menu.day_of_week)],
                    menu.meal_type.name,
                    menu.mess_type.name,
                    menu.items
                ])
            menu_table = Table(menu_data, colWidths=[80, 100, 100, 200])
            menu_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('PADDING', (0, 0), (-1, -1), 6)
            ]))
            elements.append(menu_table)
    
    doc.build(elements)
    output.seek(0)
    return output
