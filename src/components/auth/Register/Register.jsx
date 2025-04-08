import { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "C:/Users/tirth/OneDrive/Desktop/kp/src/contexts/authcontexts";
import { doCreateUserWithEmailAndPassword } from "C:/Users/tirth/OneDrive/Desktop/kp/src/firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Firestore imports
import "./register.css"; 
import Header from "../../header/Header";

const Register = () => {
  const navigate = useNavigate();
  const db = getFirestore(); // Initialize Firestore
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { userLoggedIn } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isRegistering) {
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        setIsRegistering(true);
        try {
            const userCredential = await doCreateUserWithEmailAndPassword(email, password);

            // Store the email directly as the document ID in Firestore under "email" collection
            await setDoc(doc(db, "email", email), {
                email: email,
                createdAt: new Date()
            });

            // Show an alert to inform user
            alert("A verification email has been sent to your email address. Please verify your email before logging in.");
            
            navigate('/login');  // Redirect to login page
        } catch (error) {
            setErrorMessage(error.message);
            setIsRegistering(false);
        }
    }
  };

  return (
    <>
    <Header />
      {userLoggedIn && <Navigate to={"/home"} replace={true} />}

      <main>
        <div className="image-cont1">
          <img
            src="https://img.freepik.com/free-photo/3d-illustration-computer-monitor-login-screen_107791-16390.jpg"
            alt="Security"
            className="main-img"
          />
        </div>

        <div className="container">
          <div className="text-center mb-6">
            <div className="mt-2">
              <h3>Create a New Account</h3>
            </div>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label>Email</label>
              <input
                type="email"
                style={{ marginTop: "10px" }}
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label>Password</label>
              <input
                disabled={isRegistering}
                type="password"
                style={{ marginTop: "10px" }}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label>Confirm Password</label>
              <input
                disabled={isRegistering}
                type="password"
                style={{ marginTop: "10px" }}
                autoComplete="off"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {errorMessage && (
              <span className="error-message">{errorMessage}</span>
            )}

            <button
              type="submit"
              disabled={isRegistering}
              style={{ marginTop: "10px", marginBottom: "5px" }}
              className={isRegistering ? "disabled" : ""}
            >
              {isRegistering ? "Sign Up..." : "Sign Up"}
            </button>
            <div className="text-sm text-center">
              Already have an account?{" "}
              <Link to={"/login"} className="text-center">
                Continue
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default Register;
