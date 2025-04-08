from flask import Flask, request, jsonify
from flask_cors import CORS  # ✅ Add this
from firebase_init import db
from utils import generate_otp, send_email_otp
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)  # ✅ This enables CORS for all routes

@app.route("/send-otp", methods=["POST"])
def send_otp():
    data = request.json
    email = data.get("email")
    if not email:
        return jsonify({"error": "Email is required"}), 400

    otp = generate_otp()
    expires_at = datetime.utcnow() + timedelta(minutes=5)

    db.collection("emailOtps").document(email).set({
        "otp": otp,
        "expiresAt": expires_at
    })

    send_email_otp(email, otp)
    return jsonify({"message": "OTP sent successfully"}), 200

@app.route("/verify-otp", methods=["POST"])
def verify_otp():
    data = request.json
    email = data.get("email")
    user_otp = data.get("otp")

    doc = db.collection("emailOtps").document(email).get()
    if not doc.exists:
        return jsonify({"error": "OTP not found"}), 404

    record = doc.to_dict()
    if datetime.utcnow() > record["expiresAt"].replace(tzinfo=None):
        db.collection("emailOtps").document(email).delete()
        return jsonify({"error": "OTP expired"}), 400

    if user_otp != record["otp"]:
        return jsonify({"error": "Incorrect OTP"}), 401

    db.collection("emailOtps").document(email).delete()
    return jsonify({"message": "OTP verified successfully"}), 200

if __name__ == "__main__":
    app.run(debug=True)
