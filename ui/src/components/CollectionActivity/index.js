import React from "react";
import ActivityTable from "../TableActivityCollection";

export default function CollectionActivity(props) {
  const { activity } = props;

  return (
    <>
      <div className="col-12 col-lg-3 p-2">
        <h1>Recent Activity</h1>
      </div>
      <div className="activity_box chartbox col-12 col-lg-10 d-flex flex-row flex-wrap justify-content-center mt-4">
        <ActivityTable data={activity} />
      </div>
    </>
  );
}
