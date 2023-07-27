import { useEffect, useState } from "react";
import Slider from "../components/Slider";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import "../css files/home.css"
import ListingItem from "../components/ListingItem";

export default function Home() {
  const [offers, setOffers] = useState(null);
  const [rent, setRent] = useState(null);
  const [sale, setSale] = useState(null);



  async function fetchListings(var1, var2, var3) {
    try {
      const listingRef = collection(db, "listings");
      const q = query(listingRef, where(var1, "==", var2), limit(4));
      const docSnap = await getDocs(q);
      const listings = [];

      docSnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data()
        });
      });
      var3(listings);
    } catch (error) {
      console.log(error)
    };
  };
  //fetching Offers Listings
  useEffect(() => {

    fetchListings("offer", true, setOffers);
  }, []);


  //fetching houses for rents

  useEffect(() => {

    fetchListings("type", "rent", setRent)
  }, []);

  //fetch houses for sale

  useEffect(() => {
    fetchListings("type", "sell", setSale)
  }, []);



  return (
    <>
      <Slider></Slider>
      <div className="homePage">
        {offers && offers.length > 0 && (
          <div className="homePageOffers">
            <div >

              <h2>Recent offers</h2>
              <Link style={{ textDecoration: "none" }} to="/Offers">
                <span>Show more</span>
              </Link>
            </div>
            <div className="offersListingSection">
              {offers.map((list) => (
                <ListingItem className="homePageOfferLitsing" key={list.id} listing={list.data} />
              ))}
            </div>

          </div>


        )}

        {rent && rent.length > 0 && (

          <div className="homePageOffers">
            <div >

              <h2>Houses for rent</h2>
              <Link style={{ textDecoration: "none" }} to="/category/rent">
                <span>Show more</span>
              </Link>
            </div>
            <div className="offersListingSection">
              {rent.map((rent) => (
                <ListingItem className="homePageOfferLitsing" key={rent.id} listing={rent.data} />
              ))}
            </div>

          </div>

        )}

        {sale && sale.length > 0 && (

          <div className="homePageOffers">
            <div >

              <h2>Houses for sale</h2>
              <Link style={{ textDecoration: "none" }} to="/category/sell">
                <span>Show more</span>
              </Link>
            </div>
            <div className="offersListingSection">
              {sale.map((sale) => (
                <ListingItem className="homePageOfferLitsing" key={sale.id} listing={sale.data} />
              ))}
            </div>

          </div>

        )}


      </div>
    </>
  )
}
