import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrentPage } from "../../redux/app";
import "./style.css";
import roadmap1 from "../../assets/images/roadmap1.png";
import roadmap2 from "../../assets/images/roadmap2.png";
import roadmap3 from "../../assets/images/roadmap3.png";
import roadmap4 from "../../assets/images/roadmap4.png";
import "../Buttons.css";

export default function Roadmap(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentPage("roadmap"));
  }, []);

  return (
    <div className="roadmap_container col-12 d-flex justify-content-center align-items-center">
      <div className="page_box col-12 col-md-8">
        <h1 style={{ color: "white", fontSize: "3rem" }}>ROADMAP</h1>
        <div className="d-flex flex-row flex-wrap justify-content-center">
          <div className="col-12 col-md-5">
            <a href="https://discord.gg/4fW6Kr5STy" target="_blank">
              <img
                src={roadmap1}
                alt="roadmap1"
                className="img-fluid rollmap"
              />
            </a>
          </div>
          <div className="col-12 col-md-5">
            <a href="https://discord.gg/qQgTf4Z5zr" target="_blank">
              <img
                src={roadmap2}
                alt="roadmap2"
                className="img-fluid rollmap"
              />
            </a>
          </div>
          <div className="col-12 col-md-5">
            <a href="https://discord.gg/qQgTf4Z5zr" target="_blank">
              <img
                src={roadmap3}
                alt="roadmap3"
                className="img-fluid rollmap"
              />
            </a>
          </div>
          <div className="col-12 col-md-5">
            <a href="https://discord.gg/qQgTf4Z5zr" target="_blank">
              <img
                src={roadmap4}
                alt="roadmap4"
                className="img-fluid rollmap"
              />
            </a>
          </div>
        </div>
        <a href="https://discord.gg/qQgTf4Z5zr" target="_blank">
          <button className="btn-button btn-accent btn-large">
            Learn More
          </button>
        </a>
      </div>
    </div>
  );
}
