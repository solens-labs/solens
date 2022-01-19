import React from "react";
import ActivityWalletTable from "../TableActivityUser";

export default function UserActivity(props) {
  const { activity } = props;

  return (
    <>
      <div className="stat_container col-12 col-lg-3 p-2">
        <div className="stat p-2">
          <h2>Recent Activity</h2>
        </div>
      </div>
      <div className="chartbox col-12 col-lg-10 d-flex flex-row flex-wrap justify-content-center mt-4">
        <ActivityWalletTable data={activity} />
      </div>
    </>
  );
}
