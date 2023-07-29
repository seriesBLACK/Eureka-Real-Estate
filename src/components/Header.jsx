import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from "./logo2.png";
import { RxHamburgerMenu } from "react-icons/rx"
import "../css files/navBar.css";
import { FaTimes, FaHome } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { MdLocalOffer } from "react-icons/md"


export default function Header() {

  const [pageState, setPageState] = useState("Sign in");
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setPageState("Profile");
      } else { setPageState("Sign in") }
    })
  }, [auth])

  function handelClick() {
    setIsActive(!isActive);
  }



  return (
    <>

      <header className='header'>
        <div className='container'>
          <img src={logo} alt="" onClick={() => { navigate('/') }} />
          {window.innerWidth <= 500 ? <RxHamburgerMenu className='RxHamburgerMenu' onClick={handelClick} /> :

            <nav className='nav'>
              <a href="" onClick={() => { navigate('/') }}>Home</a>
              <a href="" onClick={() => { navigate('Offers') }}>Offers</a>
              <a href="" onClick={() => { navigate('profile') }}>{pageState}</a>
            </nav>

          }


        </div>
      </header >
      <div className={`navbar ${isActive ? 'show' : 'hide'}`}>
        <Link to="/">
          <FaHome className='navIcon' />
        </Link>
        <Link to="/Offers">
          <MdLocalOffer className='navIcon' />
        </Link>
        <Link to="/sign-in">
          <CgProfile className='navIcon' />
        </Link>
        <FaTimes onClick={handelClick} className='navIcon' />
      </div>

    </>


  )

}


