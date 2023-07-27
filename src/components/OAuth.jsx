import React from 'react';
import { FcGoogle } from "react-icons/fc";
import { toast } from 'react-toastify';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { db } from '../firebase';
import { getDoc, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";


export default function OAuth() {
    const navigate = useNavigate();

    async function signUpGoogle() {

        try {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user
            console.log(user, result)
            const docRef = doc(db, "users", user.uid)
            const docSnap = await getDoc(docRef)
            if (!docSnap.exists()) {
                await setDoc(docRef, {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp(),
                })
            }
            navigate('/')

        } catch (error) {
            toast.error(error.massage)
            console.log(error)
        }
    }




    return (
        <button type='button' className="google" onClick={signUpGoogle}>
            <FcGoogle className="google-icon"></FcGoogle>
            Continue with google
        </button>
    )
};