import { useState } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import OAuth from "../components/OAuth";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';



export default function SignIn() {
    const navigate = useNavigate();


    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const { email, password } = formData;

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
            const userCredatial = await signInWithEmailAndPassword(auth, email, password);
            if (userCredatial.user) {
                navigate('/')
            }
            toast.success("signed in")
        } catch (error) {
            toast.error("something went wrong");
            console.log(error);
        }

    }

    return (
        <section className='signInPage'>
            <h2>Sign in</h2>
            <div className="signInContainer">
                <img src="" alt="" />
                <form onSubmit={onSubmit} className="rigster">
                    <input placeholder="Email Address" type="email" id='email' value={email} onChange={onChange} />
                    <div className="password">
                        <input type={showPassword ? "text" : "password"} placeholder='Password' value={password} id="password" onChange={onChange} />

                        {showPassword ? (
                            <AiFillEye className="icon" onClick={() => setShowPassword((prevState) => !prevState)} />
                        ) : (<AiFillEyeInvisible className="icon" onClick={() => setShowPassword((prevState) => !prevState)} />)}
                    </div>
                    <div className="moreOpetions">
                        <p>Don't have an account? <Link to={"/Sign-up"} className="signupbtn"> Rigster</Link> </p>
                        <Link to={"/forgot-password"} className="forgotbtn">Forgot password?</Link>
                    </div>

                    <button className="signinbtn" type="submit">Sign in</button>
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

