import Loader from "./Loader";
import { useState } from "react";

const style = { height: 300 };

export default function Image(props) {
  const [loaded, setLoaded] = useState(false);
  function onLoad() {
    // console.log("loaded");
    setLoaded(true);
  }
  return (
    <>
      <img
        style={{ display: loaded ? "block" : "none", height: 300 }}
        onLoad={onLoad}
        src={props.src}
        className={props.className}
        alt={props.alt}
        style={style}
        {...props}
      />
      {!loaded && (
        <div
        //   style={{ height: "100%" }}
        //   className="d-flex justify-content-center align-items-center"
        >
          <Loader />
        </div>
      )}
    </>
  );
}
