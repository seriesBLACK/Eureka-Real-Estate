import { useState } from "react";
import { Link } from "react-router-dom";
import OAuth from "../components/OAuth";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";

export default function ForgotPassword() {

    const [email, setEmail] = useState("");

    function onChange(event) {
        setEmail(event.target.value)

    }

    async function onSubmit(e) {
        e.preventDefault();

        try {
            const auth = getAuth();
            await sendPasswordResetEmail(auth, email);
            toast.success("An email got sent");

        } catch (error) {
            console.log(error);
            toast.error('Email does not exsist')

        }
    }

    return (
        <section className='signInPage'>
            <h2>verify your email</h2>
            <div className="signInContainer">
                <img src="" alt="" />
                <form className="rigster" onSubmit={onSubmit}>
                    <input placeholder="Email Address" type="email" id='email' value={email} onChange={onChange} />
                    <div className="moreOpetions">

                        <Link to={"/Sign-up"} >or go to<span className="signupbtn"> Sing up page</span></Link>

                    </div>

                    <button className="signinbtn" type="submit">SEND VERVACTION CODE</button>
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

