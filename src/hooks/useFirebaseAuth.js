// useFirebaseAuth.ts
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
export const useFirebaseAuth = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                navigate("/login");
                return;
            }
            const docSnap = await getDoc(doc(db, "admins", user.uid));
            if (!docSnap.exists()) {
                alert("Access denied. You are not an admin.");
                auth.signOut();
                navigate("/login");
            }
        });
        return () => unsubscribe();
    }, [navigate]);
};
