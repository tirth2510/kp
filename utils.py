# utils.py
import random
import smtplib
from datetime import datetime, timedelta
from email.mime.text import MIMEText

def generate_otp():
    return str(random.randint(100000, 999999))

def send_email_otp(email, otp):
    msg = MIMEText(f"Your OTP is: {otp}\nIt will expire in 5 minutes.")
    msg['Subject'] = "Your OTP Code"
    msg['From'] = "tirth25102003@gmail.com"
    msg['To'] = email

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        smtp.login("tirth25102003@gmail.com", "passkey")
        smtp.send_message(msg)
