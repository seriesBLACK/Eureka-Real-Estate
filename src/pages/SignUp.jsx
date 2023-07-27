import { useState } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import OAuth from "../components/OAuth";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { db } from "../firebase"
import { serverTimestamp, setDoc, doc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


export default function SignUp() {

    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const { name, email, password } = formData;
    const navigate = useNavigate();
    function onChange(event) {
        setFormData((prevState) => ({
            ...prevState,
            [event.target.id]: event.target.value,
        }))
    }

    async function onSubmit(e) {
        e.preventDefault();
        try {
            const auth = getAuth();
            const userCredatial = createUserWithEmailAndPassword(auth, email, password);
            const user = (await userCredatial).user;
            updateProfile(auth.currentUser, {
                displayName: name
            })
            const formDataCopy = { ...formData }
            delete formDataCopy.password;
            formDataCopy.timestamp = serverTimestamp();
            await setDoc(doc(db, "users", user.uid), formDataCopy)
            navigate("/")
            toast.success("signed up");
        } catch (error) {
            toast.error("something went wrong");
        }
    }

    return (
        <section className='signInPage'>
            <h2>Sign up</h2>
            <div className="signInContainer">
                <img src="" alt="" />
                <form className="rigster" onSubmit={onSubmit}>
                    <input placeholder="Full name" type="text" id='name' value={name} onChange={onChange} />
                    <input placeholder="Email Address" type="email" id='email' value={email} onChange={onChange} />
                    <div className="password">
                        <input type={showPassword ? "text" : "password"} placeholder='Password' value={password} id="password" onChange={onChange} />

                        {showPassword ? (
                            <AiFillEye className="icon" onClick={() => setShowPassword((prevState) => !prevState)} />
                        ) : (<AiFillEyeInvisible className="icon" onClick={() => setShowPassword((prevState) => !prevState)} />)}
                    </div>

                    <button className="signinbtn" type="submit">Sign Up</button>
                    <div className="line">
                        <p className="or">OR</p>
                    </div>
                    <OAuth>

                    </OAuth>

                </form>

            </div>

        </section>

    )
}

