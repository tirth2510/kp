import { BrowserRouter as Router } from 'react-router-dom';
import { useRoutes } from "react-router-dom";
import Login from "./components/auth/Login/Login";
import Register from "./components/auth/Register/Register";
import Home from "./components/home/Home";
import Email from "./components/email/Email";
import Start from './components/intro/Start';
import Lodo from './components/lodo/Lodo'; // ✅ Import Lodo
import { AuthProvider } from "./contexts/authcontexts";
import './App.css';
import 'tailwindcss/tailwind.css';

function AppRoutes() {
  const routesArray = [
    {
      path: "/",
      element: <Start />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/email",
      element: <Email />,
    },
    {
      path: "/lodo", // ✅ New route for Lodo.jsx
      element: <Lodo />,
    },
    {
      path: "*",
      element: <div className="text-center mt-10 text-2xl font-bold">404 - Page Not Found</div>,
    },
  ];

  return useRoutes(routesArray);
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="w-full h-screen flex flex-col">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
