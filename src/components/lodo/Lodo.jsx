import { useEffect, useState } from 'react';
import Header from "../header/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Lodo.css';
import DefImg from "C:/Users/tirth/OneDrive/Desktop/kp/src/assets/signup.png";
import { db } from "C:/Users/tirth/OneDrive/Desktop/kp/src/firebase/config";
import { doc, getDoc } from "firebase/firestore";

const Lodo = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [defaultPrompt, setDefaultPrompt] = useState('');
    const [promptImageURL, setPromptImageURL] = useState('');
    const UNSPLASH_ACCESS_KEY = 'FNxL47px-8y7SqgCmvjzVcz-73aUWYoleL3L9xg9h7s';
    const email = localStorage.getItem("user_email");

    useEffect(() => {
        if (location.state?.successMessage) {
            toast.success(location.state.successMessage, {
                position: "top-center",
                autoClose: 3000,
                theme: "dark"
            });
            navigate(location.pathname, { replace: true, state: {} });
        }

        fetchDefaultPrompt();
    }, [location, navigate]);

    const fetchDefaultPrompt = async () => {
        if (!email) {
            alert("❌ No email found in local storage.");
            return;
        }

        try {
            const docRef = doc(db, "email", email);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                throw new Error(`No document found for email: ${email}`);
            }

            const userPrompt = docSnap.data().prompt;
            if (!userPrompt) {
                throw new Error(`Prompt field missing in document for email: ${email}`);
            }

            console.log("🎯 Loaded prompt from Firestore:", userPrompt);
            setDefaultPrompt(userPrompt);
            generateImages(userPrompt);
        } catch (error) {
            console.error("❌ Firestore fetch error:", error);
            alert(`Error loading prompt: ${error.message}`);
        }
    };

    const generateImages = async (promptToUse) => {
        try {
            console.log("🔍 Fetching prompt image for:", promptToUse);

            const promptResponse = await fetch(
                `https://api.unsplash.com/search/photos?query=${promptToUse}&per_page=10`,
                {
                    headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
                }
            );

            if (!promptResponse.ok) throw new Error("Failed to fetch prompt images.");

            const promptData = await promptResponse.json();
            if (promptData.results.length === 0) {
                toast.warn("No images found for the prompt.");
                return;
            }

            const results = promptData.results;
            const randomPromptIndex = Math.floor(Math.random() * results.length);
            const selectedPromptImage = results[randomPromptIndex].urls.small;

            console.log(`✅ Selected prompt image (index ${randomPromptIndex}):`, selectedPromptImage);
            setPromptImageURL(selectedPromptImage); // 🔐 Save selected prompt image URL

            const randomResponse = await fetch(
                `https://api.unsplash.com/photos/random?count=11`,
                {
                    headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
                }
            );

            if (!randomResponse.ok) throw new Error("Failed to fetch random images.");

            const randomData = await randomResponse.json();
            let randomImages = randomData.map(image => image.urls.small);

            // Insert the prompt image at a random position
            const randomIndex = Math.floor(Math.random() * 12);
            randomImages.splice(randomIndex, 0, selectedPromptImage);

            setImages(randomImages);
        } catch (error) {
            console.error("❌ Error generating images:", error);
            toast.error("Error generating images.");
        }
    };

    const handleImageClick = (url) => {
        if (!promptImageURL) return;

        if (url === promptImageURL) {
            toast.success("🎉 Yesss! Correct image!", {
                position: "top-center",
                autoClose: 2000,
                theme: "colored"
            });
        } else {
            toast.error("🚫 Nooo! Wrong image!", {
                position: "top-center",
                autoClose: 2000,
                theme: "colored"
            });
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
                                <img
                                    style={{ width: '90%', cursor: 'pointer' }}
                                    src={url}
                                    alt={`Generated ${index}`}
                                    onClick={() => handleImageClick(url)}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="image">
                            <img style={{ width: '90%' }} src={DefImg} alt="Default" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Lodo;
