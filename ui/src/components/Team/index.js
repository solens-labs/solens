import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrentPage } from "../../redux/app";
import "./style.css";
import { contributors } from "../../constants/contributors";
import { honoraries } from "../../constants/honoraries";

export default function Team(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentPage("team"));
  }, []);

  return (
    <div className="team_container col-12 d-flex justify-content-center">
      <div className="col-12 col-md-10 col-lg-8 page_box reverse">
        <h1 className="team_heading">Our Honorary Family</h1>

        <hr
          style={{
            color: "white",
            width: "100%",
            justifySelf: "center",
          }}
        />

        <div className="team-members">
          {honoraries.map((member, i) => {
            return (
              <div className="member_card" key={i}>
                <a href={member.link} target="_blank">
                  <img src={member.image} alt="" />
                  <h2 className="">{member.name}</h2>
                  <h4 className="">{member.role}</h4>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
