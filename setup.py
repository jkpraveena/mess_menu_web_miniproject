from setuptools import setup, find_packages

setup(
    name="mess_menu_system",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "flask",
        "flask-login",
        "flask-sqlalchemy",
        "pymysql",
        "email-validator",
        "reportlab",
        "xlsxwriter",
        "gunicorn",
    ],
)