import Moment from "react-moment";
import { MdLocationOn } from "react-icons/md"
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

export default function ListingItem({ listing, id, onDelete, onEdit }) {

  return (



    <>
      <div className="cardContainer">

        <Link style={{ margin: 0 }} to={`/category/${listing.type}/${id}`} >
          <div className="profileListingImg">
            <img loading="lazy" src={listing.imgUrls[0]} alt="house" className="listingImg" />
            <Moment fromNow className="timeStamp">
              {listing.timeStamp?.toDate()}
            </Moment>
          </div>
        </Link>


        <div className="cardInfo">
          <div className="listingAddress gray relative">

            <MdLocationOn className="listingIcon" />
            <p className="listingP">{listing.address}</p>

          </div>


          <p className="listingP name">{listing.name}</p>
          <p className="listingP price">${
            listing.offer ?
              listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" && " / month"}
          </p>


          <div className="listingAddress">

            <p className="listingP beds">{listing.Beds > 1 ? ` ${listing.Beds} Beds ` : " 1 Bed "}</p>
            <p className="listingP beds">{listing.Bathrooms > 1 ? `  ${listing.Bathrooms} Bathrooms ` : ' 1 Bathroom '}</p>



            <div className="listingIcons">
              {onDelete && (<MdEdit className="edit icons" onClick={() => onEdit(listing.id)} />
              )}
              {onEdit && (
                <FaTrash className="trash icons" onClick={() => onDelete(listing.id)} />
              )}

            </div>

          </div>
          <div>
          </div>
        </div>
      </div>
    </>







  )
}
