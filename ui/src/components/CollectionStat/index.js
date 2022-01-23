import "./style.css";

export default function CollectionStat(props) {
  const { stat, label, noData } = props;

  return (
    <div className="collection_stat_container col-4 col-lg-4 col-xl-2 p-1 pb-0 pt-0">
      <div className="collection_stat">
        <h1 className="collection_info_stat">{noData ? "No Data" : stat}</h1>
        <h1 className="collection_info_header">{label}</h1>
      </div>
    </div>
  );
}
