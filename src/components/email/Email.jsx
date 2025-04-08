import React, { useState } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useNavigate } from "react-router-dom";

const EmailPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const emailLower = email.toLowerCase().trim();

            // 🔍 Query Firestore for the entered email
            const q = query(collection(db, "email"), where("email", "==", emailLower));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                console.log(`✅ Email "${emailLower}" found in Firestore`);

                // ✅ Save email to localStorage
                localStorage.setItem("user_email", emailLower);

                // ✅ Navigate to Lodo with success message
                navigate("/lodo", {
                    state: { successMessage: "✅ Email verified successfully!" }
                });
            } else {
                alert(`❌ Email "${email}" is NOT registered.`);
            }
        } catch (error) {
            console.error("🚨 Error checking email:", error);
            alert(`⚠️ Error checking email: ${error.message}`);
        }

        setLoading(false);
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2>Check Email in Firestore</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ padding: '10px', width: '250px', marginBottom: '10px' }}
                />
                <br />
                <button type="submit" disabled={loading} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                    {loading ? 'Checking...' : 'Check Email'}
                </button>
            </form>
        </div>
    );
};

export default EmailPage;
