import { useEffect, useState } from "react";
import { collection, getDocs, limit, query } from "firebase/firestore";
import Spinner from "../components/spinner";
import { db } from "../firebase";
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "../css files/slider.css";
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useNavigate } from "react-router-dom";

export default function Slider() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const naviget = useNavigate()

  async function fetchUserListings() {

    const q = query(
      collection(db, "listings"), limit(5))


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
  });


  if (loading) {
    return <Spinner />
  };
  if (listing.length === 0) {
    return <></>
  }
  return (
    listing && (
      <>
        <Swiper modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={1}
          navigation
          pagination={{ type: "progressbar" }}
          effect="fade"
          autoplay={{ delay: 3000 }}
        >
          {listing.map(({ data, id }) => (
            <SwiperSlide key={id} onClick={() => { naviget(`/category/${data.type}/${id}`) }}>
              <div className="imgSwiper" style={{
                background: `url(${data.imgUrls[0]}) center no-repeat`,
                backgroundSize: "cover",
              }}>

                <p className="dataNameForSlider">{data.name}</p>
                <p className="dataNameForSlider dataregularPrice">${data.discountedPrice ? data.regularPrice - data.discountedPrice : data.regularPrice}
                  {data.type === "rent" && " /month"}
                </p>
              </div>
            </SwiperSlide>
          ))


          }
        </Swiper>

      </>
    )
  )
}
