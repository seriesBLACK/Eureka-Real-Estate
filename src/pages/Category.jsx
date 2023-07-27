import { collection, getDocs, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../firebase"
import Spinner from "../components/spinner";
import ListingItem from "../components/ListingItem";
import { useParams } from "react-router-dom";

export default function Category() {
    const [loading, setLoading] = useState(true);
    const [offers, setOffers] = useState(null);
    const params = useParams();

    async function fetchOffers() {
        try {
            const listingOffers = collection(db, "listings");
            const q = query(listingOffers, where("type", "==", params.categoryType));
            const snapQuery = await getDocs(q);
            const listing = []
            snapQuery.forEach((doc) => {
                return listing.push({
                    id: doc.id,
                    data: doc.data()
                });
            });
            setOffers(listing);
            setLoading(false);
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
                <div>
                    <h2 style={{ textAlign: "center", marginBottom: "40px" }}>{params.categoryType.toUpperCase()}</h2>
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

