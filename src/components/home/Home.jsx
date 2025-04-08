import { useEffect, useRef, useState } from 'react';
import Header from "../header/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Home.css';
import DefImg from "C:/Users/tirth/OneDrive/Desktop/kushal/src/assets/signup.png";
import { db } from "C:/Users/tirth/OneDrive/Desktop/kushal/src/firebase/config";
import { doc, setDoc, getDoc } from "firebase/firestore";

const Home = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [currentPrompt, setCurrentPrompt] = useState('');
    let inputRef = useRef(null);

    const locationEmail = location.state?.email;
const storedEmail = localStorage.getItem("user_email");
const email = locationEmail || storedEmail || "guest";
 // fallback just in case
    const UNSPLASH_ACCESS_KEY = 'FNxL47px-8y7SqgCmvjzVcz-73aUWYoleL3L9xg9h7s';

    useEffect(() => {
        if (location.state?.successMessage) {
            toast.success(location.state.successMessage, {
                position: "top-center",
                autoClose: 3000,
                theme: "dark"
            });

            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    const storePromptInEmailDoc = async (prompt) => {
        try {
            const emailDocRef = doc(db, "email", email);
    
            await setDoc(emailDocRef, { prompt }, { merge: true }); // ✅ store as string
    
            console.log("✅ Prompt saved as string for email:", email);
            toast.success("Prompt confirmed and saved!", {
                position: "top-center",
                autoClose: 3000,
                theme: "colored"
            });
    
        } catch (error) {
            console.error("❌ Error saving prompt to email doc:", error);
            toast.error("Failed to save prompt.");
        }
    };
    

    const imageGenerator = async () => {
        const query = inputRef.current.value.trim().split(' ').slice(0, 5).join(' ');

        if (!query) {
            toast.warn("Please enter a prompt!");
            return;
        }

        setCurrentPrompt(query); // ✅ Store current prompt for later confirm

        try {
            const response = await fetch(
                `https://api.unsplash.com/search/photos?query=${query}&per_page=12`,
                {
                    headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
                }
            );

            if (!response.ok) throw new Error("Failed to fetch images.");

            const data = await response.json();
            if (data.results.length === 0) {
                toast.warn("No images found for this query.");
            }

            setImages(data.results.map(image => image.urls.small));
        } catch (error) {
            console.error("❌ Error fetching images:", error);
            toast.error("Error fetching images. Try again later.");
        }
    };

    return (
        <div className='ai-image-generator'>
            <Header />
            <ToastContainer />
            <div className="header">AI Image <span className='aiwala'>Generator</span></div>

            <div className="img-loading">
                <div className="images-grid">
                    {images.length > 0 ? (
                        images.map((url, index) => (
                            <div className="image" key={index}>
                                <img style={{ width: '90%' }} src={url} alt={`Generated ${index}`} />
                            </div>
                        ))
                    ) : (
                        <div className="image">
                            <img style={{ width: '90%' }} src={DefImg} alt="Default" />
                        </div>
                    )}
                </div>
            </div>

            <div className="search-box">
                <input type="text" ref={inputRef} className='search-input' placeholder='Enter up to 5 words' />
                <div className="generate-btn" onClick={imageGenerator}>Generate</div>
            </div>

            {/* ✅ Confirm Prompt Button (only shows after generation) */}
            {currentPrompt && images.length > 0 && (
                <div className="confirm-prompt-container">
                    <button className="confirm-btn" onClick={() => storePromptInEmailDoc(currentPrompt)}>
                        Confirm Prompt
                    </button>
                </div>
            )}
        </div>
    );
};

export default Home;
