import launchzone from "../../assets/images/launchzone.png";
import { links, themeColors } from "../../constants/constants";
import solana from "../../assets/images/solana.svg";

export default function LaunchHero() {
  return (
    <div className="launchzone_image_bg col-12 d-flex justify-content-center align-items-center">
      <div className="col-12 d-flex flex-column align-items-center">
        <img
          src={launchzone}
          alt="launchzone_logo"
          className="img-fluid"
          style={{ maxHeight: "150px", margin: 0, padding: 0 }}
          loading="lazy"
        />

        <div className="blackground col-12 col-sm-11 col-md-9 col-xxl-6 mt-4 mb-5">
          <h5>
            Looking to launch your own NFT collection on{" "}
            <span>
              <img
                src={solana}
                style={{ height: "1rem", paddingBottom: 4 }}
                loading="lazy"
              />
            </span>
            ?
          </h5>

          <h3 className="mt-3">Apply for our NFT launchpad</h3>
          <a href={links.launchZone} target="_blank">
            <button
              className="apply_launchzone explore_all_button mt-2 mb-2"
              style={{
                border: "1px solid black",
                color: "white",
              }}
            >
              Initiate Launch
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
