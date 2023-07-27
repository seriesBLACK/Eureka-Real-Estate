import { useEffect, useState } from "react";
import Contact from "../components/contact";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { MdLocationOn } from "react-icons/md";
import { useParams } from "react-router-dom";
import Spinner from "../components/spinner";
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FaShare, FaBed, FaBath, FaParking, FaChair } from "react-icons/fa";
import { getAuth } from "firebase/auth";
import "../css files/listings.css";

export default function Listings() {
  const auth = getAuth();
  const params = useParams();
  const [contactLandLord, setContactLandLord] = useState(false)
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLink, setShareLink] = useState(false)
  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }

    }
    fetchListing()
  }, [params.listingId])
  if (loading) {
    return <Spinner />
  }



  return (
    <main>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        autoplay={{ delay: 3000 }}
      >

        {listing.imgUrls.map((url, index) => (

          <SwiperSlide key={index}>
            <div className="imgSwiper" style={{
              background: `url(${listing.imgUrls[index]}) center no-repeat`,
              backgroundSize: "cover",
            }}>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="shareIcon" onClick={() => {
        navigator.clipboard.writeText(window.location.href);
        setShareLink(true);
        setTimeout(() => {
          setShareLink(false);
        }, 2000)
      }}>
        <FaShare style={{ fontSize: "20px" }}></FaShare>
      </div>
      {shareLink && <p className="linkCopied">Link copied</p>}
      <div className="mainListingInfo">
        <div className="mainCardInfo">
          <p className="listingP price">{`${listing.name} - $${listing.offer ?
            listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 
            ${listing.type === "rent" && " / month"}`}</p>
          <div className="listingAddress">

            <MdLocationOn className="listingIcon" />
            <p className="listingAddressPargraph">{listing.address}</p>

          </div>
          <p className="listingTypeButton">{listing.type === "rent" ? "Rent" : "sale"}</p>
          <p><span style={{ fontWeight: "700" }}>Description: </span>{listing.description}</p>
          <div className="bedsBaths">

            <FaBed style={{ marginTop: "5px", fontSize: "20px" }}></FaBed>
            <p><span></span>{listing.Beds > 1 ? " Beds" : "1 Bed"}</p>
            <FaBath style={{ marginTop: "5px", fontSize: "17px", marginLeft: "10px" }}></FaBath>
            <p>{listing.Baths > 1 ? " Baths" : "1 Bath"}</p>

            <FaParking style={{ marginTop: "5px", fontSize: "17px", marginLeft: "13px" }}></FaParking>
            <p>{listing.parking ? "Parking spot" : "No parking"}</p>
            <FaChair style={{ marginTop: "5px", fontSize: "17px", marginLeft: "13px" }}></FaChair>
            <p>{listing.furnished ? "furnished" : "Not furnished"}</p>
          </div>

          {listing.userRef !== auth.currentUser?.uid && !contactLandLord && (

            <button onClick={() => { setContactLandLord(true) }} className="contactLandLord">Contact landlord</button>

          )}
          {contactLandLord && (
            <Contact userRef={listing.userRef} listing={listing} />
          )}
        </div>




      </div>

    </main>
  )

}
