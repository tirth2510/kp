import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './login.css';
import Header from '../../header/Header';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "C:/Users/tirth/OneDrive/Desktop/kp/src/firebase/config";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [isOtpValid, setIsOtpValid] = useState(false);
    const [isSigningIn, setIsSigningIn] = useState(false);

    const handleSendOtp = async () => {
        const trimmedEmail = email.toLowerCase().trim();
    
        if (!trimmedEmail) {
            toast.error("Please enter a valid email.");
            return;
        }
    
        try {
            const response = await fetch('https://flaskotp.onrender.com/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: trimmedEmail })
            });
    
            if (!response.ok) {
                throw new Error('Failed to send OTP');
            }
    
            toast.success("OTP sent to your email.");
            setOtpSent(true);
        } catch (error) {
            console.error("Error sending OTP:", error);
            toast.error("Failed to send OTP.");
        }
    };
    

    const verifyOtp = async () => {
        const trimmedEmail = email.toLowerCase().trim();

        try {
            const otpDoc = await getDoc(doc(db, "emailOtps", trimmedEmail));
            if (otpDoc.exists()) {
                const storedOtp = otpDoc.data().otp;
                if (otp === storedOtp) {
                    toast.success("OTP verified successfully.");
                    setIsOtpValid(true);
                } else {
                    toast.error("Invalid OTP.");
                    setIsOtpValid(false);
                }
            } else {
                toast.error("No OTP found for this email.");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            toast.error("Error verifying OTP.");
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!isSigningIn) {
            setIsSigningIn(true);

            try {
                const emailLower = email.toLowerCase().trim();

                await setDoc(doc(db, "email", emailLower), {
                    email: emailLower,
                    savedAt: new Date().toISOString()
                });

                console.log("✅ Email saved to Firestore:", emailLower);
                localStorage.setItem("user_email", emailLower);

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
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setOtpSent(false);
                                    setIsOtpValid(false);
                                    setOtp('');
                                }}
                                style={{ marginTop: "10px", marginBottom: "10px" }}
                            />
                            <button type="button" onClick={handleSendOtp} style={{ marginLeft: "10px" }}>
                                Send OTP
                            </button>
                        </div>

                        {otpSent && (
                            <div style={{ marginTop: "15px" }}>
                                <label>Enter OTP</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    style={{ marginTop: "10px", marginBottom: "10px" }}
                                />
                                <button type="button" onClick={verifyOtp} style={{ marginLeft: "10px" }}>
                                    Verify OTP
                                </button>
                            </div>
                        )}

                        <button type="submit" disabled={!isOtpValid || isSigningIn}>
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
