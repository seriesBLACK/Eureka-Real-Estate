import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { db } from "../firebase";

export default function Contact({ userRef, listing }) {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState("");
    useEffect(() => {
        async function getLandlord() {
            console.log(userRef)
            const docRef = doc(db, "users", userRef);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                console.log(docSnap)
                setLandlord(docSnap.data());
            } else {
                toast.error("Could not get landlord data");
            }
        }
        getLandlord();
    }, []);

    return (
        <>
            {landlord !== null && (

                <div>
                    <p>Send an email to {landlord.name} for the {listing.name}</p>
                    <div>
                        <textarea style={{ width: '58%', height: '60px' }} name="Message" id="Message" rows="2" value={message} onChange={(e) => { setMessage(e.target.value) }}></textarea>
                        <a href={`mailto:${landlord.email}?Subject=${listing.name}?body=${message}`}><button className="contactLandLord">Send email</button></a>
                    </div>
                </div>
            )}
        </>
    )
};







//http://localhost:3000/category/rent/EZ7L7WKLMO3rI1yrepBs