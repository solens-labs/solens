import "./style.css";

export default function CollectionStat(props) {
  const { stat, label } = props;

  return (
    <div className="collection_stat_container col-4 col-lg-4 col-xl-2 p-1 pb-0 pt-0">
      <div className="collection_stat">
        <h1 className="collection_info">{stat}</h1>
        <h1 className="collection_info_header">{label}</h1>
      </div>
    </div>
  );
}
