import { getAuth, updateProfile } from 'firebase/auth';
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from "../firebase";
import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import ListingItem from '../components/ListingItem';


export default function Profile() {
  const navigate = useNavigate();
  const auth = getAuth();

  //Hooks
  const [changeDetail, setChangeDetail] = useState(false);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });


  const { name, email } = formData
  function onLogOut() {
    auth.signOut();
    navigate('/');
    toast.success('signed out')
  }


  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  //change name funcation
  async function onSubmit() {
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name
        })
      }
      toast.success("Profile updated");
    } catch (error) {
      toast.error("could not update profile")

    }
  }



  async function fetchUserListings() {
    const q = query(
      collection(db, "listings"),
      where("userRef", "==", auth.currentUser.uid));


    let listings = [];
    const querySnap = await getDocs(q);
    querySnap.forEach((doc) => {
      return listings.push({
        id: doc.id,
        data: doc.data(),
      });

    });
    setListing(listings);
    setLoading(false);
  };


  useEffect(() => {
    fetchUserListings();
  }, [auth.currentUser.uid]);

  async function onDelete(listingId) {
    if (window.confirm("Are you sure you want to delete the listing?")) {
      await deleteDoc(doc(db, "listings", listingId))
      const updatedListings = listing.filter(
        (listing) => listing.id !== listingId
      );
      setListing(updatedListings);
      toast.success("Deleted");
    } else {
      toast.error("Not deleted")
    }

  }
  function onEdit(listingId) {
    navigate(`/edit-listing/${listingId}`)
  }

  return (

    <>
      <section className='profileBody'>
        <h1 className='profileHeading'>Profile</h1>
        <form className='profileInput'>
          <input type="text" id='name' value={name} className='profileinput' disabled={!changeDetail} onChange={onChange} />
          <input type="text" id='name' value={email} className='profileinput' disabled />
          <div className='editsignout'>
            <p>Change your name <span onClick={() => {
              changeDetail && onSubmit();
              setChangeDetail((prevState) => !prevState)
            }}> {changeDetail ? "Applay" : "Edit"}</span></p>
            <p onClick={onLogOut} className='signOut'>Sign out</p>
          </div>

          <Link to="/creat-listing" className='link'>
            <button className='sellBtn'>
              Sell or Rent a house
            </button>
          </Link>

        </form>
      </section>

      {!loading && listing.length > 0 && (
        <>
          <h2 className='profileHeading'>My Listing</h2>
          <div className='listing'>

            {listing.map((listing) => (
              <ListingItem
                key={listing.id}
                id={listing.id}
                listing={listing.data}
                onDelete={() => onDelete(listing.id)}
                onEdit={() => onEdit(listing.id)}

              />
            ))}

          </div>
        </>
      )}
    </>


  )
}
