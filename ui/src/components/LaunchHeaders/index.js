import Experts from "@mui/icons-material/Psychology";
import Security from "@mui/icons-material/Security";
import Marketing from "@mui/icons-material/Public";
import Analytics from "@mui/icons-material/Insights";

export default function showHeaders() {
  return (
    <div className="col-12 d-flex flex-wrap justify-content-center mt-4 p-lg-5 pb-lg-0 pt-lg-0">
      <div className="launch_detail_container col-12 col-md-6 col-xxl-3 d-flex justify-content-center p-2">
        <div className="launch_detail_box d-flex flex-column align-items-center">
          <h2 className="mb-1" style={{ fontWeight: "bold" }}>
            Experts
          </h2>
          <hr style={{ color: "white", width: "70%" }} className="mt-0" />
          <Experts
            style={{ fill: "white" }}
            fontSize="large"
            className="mb-3"
          />
          <h5>
            With a multitude of successful launches, our experienced developer
            team is ready to help bring your vision to life.
          </h5>
        </div>
      </div>
      <div className="launch_detail_container col-12 col-md-6 col-xxl-3 d-flex justify-content-center p-2">
        <div className="launch_detail_box d-flex flex-column align-items-center">
          <h2 className="mb-1" style={{ fontWeight: "bold" }}>
            Security
          </h2>
          <hr style={{ color: "white", width: "70%" }} className="mt-0" />
          <Security
            style={{ fill: "white" }}
            fontSize="large"
            className="mb-3"
          />
          <h5>
            We use the Candy Machine V2 standard to ensure your code is secure,
            your funds are safe, and most of all - your community is protected!
          </h5>
        </div>
      </div>
      <div className="launch_detail_container col-12 col-md-6 col-xxl-3 d-flex justify-content-center p-2">
        <div className="launch_detail_box d-flex flex-column align-items-center">
          <h2 className="mb-1" style={{ fontWeight: "bold" }}>
            Marketing
          </h2>
          <hr style={{ color: "white", width: "70%" }} className="mt-0" />
          <Marketing
            style={{ fill: "white" }}
            fontSize="large"
            className="mb-3"
          />
          <h5>
            Gain exposure for your collection by being featured in our
            Launchzone collection of the day. Solensians will get to explore
            your community!
          </h5>
        </div>
      </div>
      <div className="launch_detail_container col-12 col-md-6 col-xxl-3 d-flex justify-content-center p-2">
        <div className="launch_detail_box d-flex flex-column align-items-center">
          <h2 className="mb-1" style={{ fontWeight: "bold" }}>
            Trading
          </h2>
          <hr style={{ color: "white", width: "70%" }} className="mt-0" />
          <Analytics
            style={{ fill: "white" }}
            fontSize="large"
            className="mb-3"
          />
          <h5>
            Your collection will have an analytics & trading page as soon as
            minting completes. Give your community access to multiple secondary
            markets.
          </h5>
        </div>
      </div>
      <div className="launch_detail_container col-12 col-md-6 col-xxl-3 d-flex justify-content-center p-2">
        <div className="launch_detail_box d-flex flex-column align-items-center">
          <h2 className="mb-1" style={{ fontWeight: "bold" }}>
            Trustless
          </h2>
          <hr style={{ color: "white", width: "70%" }} className="mt-0" />
          <h5>
            Your raised funds will be available in real-time as your mint is
            underway, sent to you via open-source payment splitters.
          </h5>
        </div>
      </div>
    </div>
  );
}
