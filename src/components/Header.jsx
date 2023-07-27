import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "./logo2.png";


export default function Header() {

    const [pageState, setPageState] = useState("Sign in");
    const navigate = useNavigate();
    const auth = getAuth();
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setPageState("Profile");
            } else { setPageState("Sign in") }
        })
    }, [auth])



    return (
        <header className='header'>
            <div className='container'>
                <img src={logo} alt="" onClick={() => { navigate('/') }} />
                <nav className='nav'>
                    <a href="" onClick={() => { navigate('/') }}>Home</a>
                    <a href="" onClick={() => { navigate('Offers') }}>Offers</a>
                    <a href="" onClick={() => { navigate('profile') }}>{pageState}</a>
                </nav>
            </div>
        </header >
    )
}


