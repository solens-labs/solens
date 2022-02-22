import "./style.css";
import { useHistory } from "react-router-dom";

export default function NftCard(props) {
  const { links, item } = props;

  const history = useHistory();

  // Generate link to go to internal NFT Detail Page
  const goToNFTDetailPage = (mint) => {
    history.push("/mint/" + mint);
  };

  return (
    <div className="nft_card_container col-12">
      <div className="nft_card col-12 d-flex flex-column align-items-center">
        <div className="nft_card_image_container">
          <img
            src={item?.image}
            className="nft_card_image"
            alt="nft_card"
            onClick={() => goToNFTDetailPage(item?.mint)}
            loading="eager"
          />
        </div>

        <div className="nft_card_details col-12 d-flex flex-column align-items-center justify-content-center p-2 pb-1 pt-1 ">
          <h5 style={{ fontSize: "1.2rem", fontWeight: 800 }}>{item?.name}</h5>
        </div>
      </div>
    </div>
  );
}
