import { useEffect, useState } from "react";
import Spinner from "../components/spinner";
import { toast } from "react-toastify";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, list } from "firebase/storage";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase"
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useParams } from "react-router-dom";



export default function CreatListing() {
    const navigate = useNavigate();
    const auth = getAuth();

    const [loading, setLoading] = useState(false);
    const [listing, setListing] = useState(null);
    const [formData, setFormData] = useState({
        type: 'rent',
        name: '',
        Beds: "0",
        Bathrooms: "0",
        parking: false,
        furnished: false,
        address: "",
        description: "",
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        images: false
    })

    const { type, name, offer, Beds, images, Bathrooms, parking, furnished, address, description, regularPrice, discountedPrice } = formData;
    const params = useParams()


    useEffect(() => {
        if (listing && listing.userRef !== auth.currentUser.uid) {
            toast.error("You can't reach this page")
            navigate("/");

        }
    }, [auth.currentUser.uid, listing])


    useEffect(() => {
        setLoading(true);
        async function fetchListing() {
            const docRef = doc(db, "listings", params.listingId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setListing(docSnap.data());
                setFormData({ ...docSnap.data() });
                setLoading(false)
            } else {
                navigate('/');
                toast.error("listing does not exist !");
            }

        }
        fetchListing()
    }, [navigate, params.listingId]);



    function onChange(e) {
        let boolean = null;
        if (e.target.value === "true") {
            boolean = true;
        }
        if (e.target.value === "false") {
            boolean = false;
        }
        // Files
        if (e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files,
            }));
        }
        // Text/Boolean/Number
        if (!e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value,
            }));
        }
    }

    async function onSubmit(e) {
        e.preventDefault()
        if (+regularPrice <= +discountedPrice) {
            toast.error("The regular price can not be less then the discounted price")
            return;
        }

        if (images) {
            if (images.length > 6) {
                toast.error("you can only upload 6 images")
                return;
            };

            async function storeImage(image) {
                setLoading(true)
                return new Promise((resolve, reject) => {
                    const storage = getStorage();
                    const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
                    const storageRef = ref(storage, fileName);
                    const uploadTask = uploadBytesResumable(storageRef, image);





                    uploadTask.on('state_changed',
                        (snapshot) => {
                            // Observe state change events such as progress, pause, and resume
                            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log('Upload is ' + progress + '% done');
                            switch (snapshot.state) {
                                case 'paused':
                                    console.log('Upload is paused');
                                    break;
                                case 'running':
                                    console.log('Upload is running');
                                    break;
                            }
                        },
                        (error) => {
                            reject(error)
                        },
                        () => {
                            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                resolve(downloadURL);

                            });
                        }
                    );

                })

            }

            const imgUrls = await Promise.all(
                [...images].map((image) => storeImage(image))

            ).catch((error) => {
                setLoading(false);
                toast.error("Images not uploaded", error);
                return;
            });
            const formDataCopy = {
                ...formData,
                imgUrls,
                timeStamp: serverTimestamp(),
                userRef: auth.currentUser.uid,
            };
            delete formDataCopy.images;
            !formDataCopy && delete formDataCopy.discountedPrice;
            const docRef = doc(db, "listings", params.listingId);
            await updateDoc(docRef, formDataCopy);
            setLoading(false);
            toast.success("list has updated");
            navigate(`category/${formDataCopy.type}/${docRef.id}`);
            setLoading(false)


        } else {
            setLoading(true);
            const formDataCopy = {
                ...formData,
                timeStamp: serverTimestamp(),
                userRef: auth.currentUser.uid,
            };
            delete formDataCopy.images;
            !formDataCopy && delete formDataCopy.discountedPrice;
            const docRef = doc(db, "listings", params.listingId);
            await updateDoc(docRef, formDataCopy);
            setLoading(false);
            toast.success("list has updated");
            navigate(`category/${formDataCopy.type}/${docRef.id}`)
            setLoading(false);
        };





    };

    if (loading) {
        return <Spinner />
    }


    return (
        <div className="creatListing">
            <h1>Edit listing</h1>
            <form className="creatForm" onSubmit={onSubmit}>

                <p>Sell/Rent</p>
                <button type="button" id="type" value="sell" onClick={onChange} className={`${type === "rent" ? "lihgt" : "dark"}`}>Sell</button>
                <button type="button" id="type" value="rent" onClick={onChange} className={`${type === "sell" ? "lihgt" : "dark"}`}>Rent</button>



                <p>Name</p>
                <input id="name" className="nameInput" type="text" placeholder="Name" value={name} maxLength="32" minLength="9" required onChange={onChange} />

                <div className="beds">
                    <div><p>Beds</p>
                        <input id="Beds" type="number" required value={Beds} onChange={onChange} />
                    </div>


                    <div><p>Bathrooms</p>
                        <input id="Bathrooms" type="number" required value={Bathrooms} onChange={onChange} /></div>

                </div>
                <p>Parking spot</p>
                <button id="parking" type="button" value="true" onClick={onChange} className={`${!parking ? "light" : "dark"}`}>Yes</button>
                <button id="parking" type="button" value="false" onClick={onChange} className={`${parking ? "light" : "dark"}`}>No</button>
                <p>Furnished</p>
                <button id="furnished" type="button" value="true" onClick={onChange} className={`${!furnished ? "light" : "dark"}`}>Yes</button>
                <button id="furnished" type="button" value="false" onClick={onChange} className={`${furnished ? "light" : "dark"}`}>No</button>

                <p>Address</p>
                <textarea id="address" className="address" type="text" placeholder="Address" value={address} required onChange={onChange} />
                <p>Description</p>
                <textarea id="description" className="address" type="text" placeholder="Description" value={description} onChange={onChange} />

                <p>Offer</p>
                <button id="offer" type="button" value="true" onClick={onChange} className={`${!offer ? "light" : "dark"}`}>Yes</button>
                <button id="offer" type="button" value="false" onClick={onChange} className={`${offer ? "light" : "dark"}`}>No</button>


                <p>Regular price</p>
                <div className="regular">
                    <input id="regularPrice" className="regularPrice" type="number" required value={regularPrice} onChange={onChange} />
                    <p className={`${type === "sell" ? "hide" : "show"}`}>$/month</p>
                </div>

                <p className={`${offer ? 'show' : 'hide'}`}>Discounted price</p>
                <input id="discountedPrice" type="number" className={`${offer ? 'regularPrice' : 'hide'}`} value={discountedPrice} onChange={onChange} />

                <p>Images</p>
                <p className="fade">The first image will be the cover (max 6)</p>
                <input id="images" className="file" type="file" onChange={onChange} accept=".jpg, .png, .jpeg" multiple />
                <button id="submit" type="submit" className="submitbtn">Edit listing</button>


            </form>
        </div>
    )
}
