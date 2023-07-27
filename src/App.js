import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './css files/Header.css';
import './css files/SignIn.css';
import './css files/Profile.css';
import './css files/creatListing.css';
import './css files/ListingItem.css';
import Home from './pages/Home';
import Offers from './pages/Offers';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreatListing from './pages/creat-listing';
import EditListing from './pages/EditListing';
import Listings from './pages/Listings';
import Category from './pages/Category';


function App() {

  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/offers' element={<Offers />} />
          <Route path="/category/:categoryName/:listingId" element={<Listings />} />

          <Route path='profile' element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />} />
          </Route>

          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/category/:categoryType' element={<Category />} />

          <Route path='/creat-listing' element={<PrivateRoute />}>
            <Route path='/creat-listing' element={<CreatListing />} />
          </Route>

          <Route path='/edit-listing' element={<PrivateRoute />}>
            <Route path='/edit-listing/:listingId' element={<EditListing />} />
          </Route>

        </Routes>
      </Router>


      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;