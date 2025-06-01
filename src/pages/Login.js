import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Login.tsx
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const Login = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user)
                navigate("/admin"); // already logged in
        });
        return () => unsubscribe();
    }, [navigate]);
    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, provider);
            navigate("/admin");
        }
        catch (err) {
            alert("Login failed. Please try again.");
            console.error(err);
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-100 px-4", children: _jsxs("div", { className: "bg-white p-8 rounded shadow-md text-center", children: [_jsx("h1", { className: "text-2xl font-bold mb-4", children: "Lootara Admin Login" }), _jsx("button", { onClick: signInWithGoogle, className: "bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600", children: "Sign in with Google" })] }) }));
};
export default Login;
