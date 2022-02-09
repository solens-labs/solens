import "./style.css";

export default function MintingStat(props) {
  const { stat, label, noData } = props;

  return (
    <div className="minting_stat_container col-4 p-1 pb-0 pt-0">
      <div className="minting_stat_secondary">
        <h1 className="minting_info_header">{label}</h1>
        <h1 className="minting_info_stat">{noData ? "No Data" : stat}</h1>
      </div>
    </div>
  );
}
