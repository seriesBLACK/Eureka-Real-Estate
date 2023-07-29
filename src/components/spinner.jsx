import spinner from "../assests/svg/spinner.svg";
import "../css files/spinner.css"

export default function Spinner() {
    return (
        <div className="cntspinner">
            <img src={spinner} alt="" className="spinner" />
        </div>
    )
}
