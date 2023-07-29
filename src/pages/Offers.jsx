import { collection, getDocs, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../firebase"
import Spinner from "../components/spinner";
import ListingItem from "../components/ListingItem";
import "../css files/offer.css";

export default function Offers() {
    const [loading, setLoading] = useState(true);
    const [offers, setOffers] = useState(null);

    async function fetchOffers() {
        try {
            const listingOffers = collection(db, "listings");
            const q = query(listingOffers, where("offer", "==", true));
            const snapQuery = await getDocs(q);
            const listing = []
            snapQuery.forEach((doc) => {
                return listing.push({
                    id: doc.id,
                    data: doc.data()
                });
            });
            setOffers(listing);
            // setLoading(false);
        } catch (error) {
            console.log(error);
        }






    };

    useEffect(() => {
        fetchOffers()
    }, []);

    if (loading) {
        <Spinner></Spinner>
    }
    return (
        <>
            {offers && offers.length > 0 && (
                <div className="offersPage">
                    <h2 style={{ textAlign: "center", marginBottom: "40px" }}>Offers</h2>
                    <div style={{ marginLeft: "20px" }} className="offersListingSection">
                        {offers.map((list) => (
                            <ListingItem className="homePageOfferLitsing" key={list.id} listing={list.data} />
                        ))}
                    </div>
                </div>

            )}
        </>

    )



}

