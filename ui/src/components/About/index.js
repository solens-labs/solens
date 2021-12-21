import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrentPage } from "../../redux/app";
import "./style.css";
import logo1 from "../../assets/images/logo1.png";
import example1 from "../../assets/images/example1.png";
import example2 from "../../assets/images/example2.gif";
import { links } from "../../constants/constants";

export default function About(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentPage("about"));
  }, []);

  return (
    <div className="about_container col-12 d-flex justify-content-center">
      <div className="page_box col-12 col-md-10 col-lg-8">
        {/* <div className="col-12 col-md-8 offset-md-2">
          <img className="img-fluid p-3" src={logo} alt="" />
        </div> */}
        <h1 className="about_heading">Happy Halloween, Friends!</h1>
        <hr
          style={{
            color: "white",
            width: "100%",
            justifySelf: "center",
          }}
        />

        <div className="d-flex flex-row flex-wrap col-12 justify-content-center align-items-center mt-3">
          <div className="col-12 col-lg-3">
            <img
              src={logo1}
              alt="nft_example"
              className="img-fluid"
              style={{ maxHeight: "300px" }}
            />
          </div>
          <p className="about_text col-12 col-lg-7">
            Carving pumpkins is a tedious, trying task that usually just ends up
            in disappointment. Instead of disrespecting a perfectly good
            pumpkin, just mint one of our perfectly carved Pesky Pumpkins!
          </p>
        </div>

        {/* <img className="img-fluid" src={example2} alt="" /> */}

        <div className="d-flex flex-row flex-wrap col-12 justify-content-center align-items-center mt-3">
          <p className="about_text col-12 col-lg-5">
            There will be 6666 unique Pumpkins and each one will cost 1 SOL.
            Each Pumpkin will have its own unique background, head, clothing,
            scarf, satchel, minion, and rock to stand on.
            <br />
            Click{" "}
            <span
              className="about_text"
              style={{ textDecoration: "underline", cursor: "pointer" }}
              onClick={() => window.location.replace("/#faq")}
            >
              here
            </span>{" "}
            to browse our FAQ.
          </p>
          <div className="col-12 col-lg-5">
            <img src={example2} alt="nft_example" className="nft_example" />
          </div>
        </div>

        {/* <p className="about_text">
          When your favorite warehouse store is out of toilet paper...
        </p> */}
        <h2
          style={{
            color: "rgb(64, 250, 120)",
            fontSize: "2rem",
            marginTop: "4rem",
            letterSpacing: "3px",
          }}
        >
          ENTER IF YOU DARE!
        </h2>
        <div className="d-flex col-12 flex-wrap justify-content-center">
          <a href={links.discord.url} target="_blank">
            <button className="btn-button btn-accent btn-large">Discord</button>
          </a>
          <a href={links.twitter.url} target="_blank">
            <button className="btn-button btn-accent btn-large">Twitter</button>
          </a>
        </div>
      </div>
    </div>
  );
}
