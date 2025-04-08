import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './login.css';
import Header from '../../header/Header';
import { doc, setDoc } from "firebase/firestore";
import { db } from "C:/Users/tirth/OneDrive/Desktop/kushal/src/firebase/config";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
    
        if (!isSigningIn) {
            setIsSigningIn(true);
    
            try {
                const emailLower = email.toLowerCase().trim();
    
                // ✅ Save email in Firestore under collection "email"
                await setDoc(doc(db, "email", emailLower), {
                    email: emailLower,
                    savedAt: new Date().toISOString()
                });
    
                console.log("✅ Email saved to Firestore:", emailLower);
    
                // ✅ Navigate to /home with success message
                localStorage.setItem("user_email", emailLower); // save it locally
navigate('/home', {
    state: {
        successMessage: "Login Successful",
        email: emailLower
    }
});


    
            } catch (err) {
                console.error("❌ Error saving email:", err);
                toast.error("Something went wrong while saving your email.");
                setIsSigningIn(false);
            }
        }
    };
    

    const goToEmailPage = () => {
        navigate('/email');
    };

    return (
        <div>
            <Header />
            <ToastContainer />

            <main className="login-container">
                <div className='logon'>
                    <img src="https://t4.ftcdn.net/jpg/04/60/71/01/360_F_460710131_YkD6NsivdyYsHupNvO3Y8MPEwxTAhORh.jpg" alt="Login" />
                </div>

                <div className="login-card">
                    <div className="text-center">
                        <h3>Welcome Back</h3>
                    </div>

                    <form onSubmit={onSubmit}>
                        <div>
                            <label>Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ marginTop: "10px", marginBottom: "10px" }}
                            />
                        </div>

                        <button type="submit" disabled={isSigningIn}>
                            {isSigningIn ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <button onClick={goToEmailPage} className="email-page-btn" style={{ marginTop: '20px' }}>
                        Go to Email Page
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Login;
