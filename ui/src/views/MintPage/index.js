import React, { useEffect, useState } from "react";
import "./style.css";
import TradingModule from "../../components/TradingModule";
import { useParams } from "react-router-dom";
import { getTokenMetadata } from "../../utils/getMetadata";
import Attribute from "../../components/Attribute";
import Loader from "../../components/Loader";

export default function MintPage(props) {
  const { address } = useParams();
  const { links } = props;

  const [tokenMetadata, setTokenMetadata] = useState({});

  const received = Object.keys(tokenMetadata).length > 0;

  useEffect(async () => {
    if (address && Object.keys(tokenMetadata).length === 0) {
      const metadata = getTokenMetadata(address);
      const resolved = await Promise.resolve(metadata);
      // console.log(resolved);
      setTokenMetadata(resolved);
    }
  }, [address]);

  return (
    <div className="col-12 d-flex flex-column align-items-center pt-5">
      <div className="d-flex flex-row flex-wrap col-12 col-lg-10 col-xxl-8 justify-content-center mb-4">
        <div className="col-12 col-lg-6 d-flex justify-content-center">
          {received ? (
            <img
              src={tokenMetadata && tokenMetadata.image}
              className="nft_image"
              alt=""
            />
          ) : (
            <div className="nft_image d-flex justify-content-center overflow-hidden">
              <Loader />
            </div>
          )}
        </div>
        <div className="d-flex flex-column col-12 col-lg-6 mt-4 mt-lg-0">
          <TradingModule item={tokenMetadata} links={links} />
        </div>
      </div>
      <div className="col-12 col-lg-7 d-flex flex-wrap justify-content-start">
        {received &&
          tokenMetadata.attributes?.map((item, i) => {
            return (
              <div className="col-6 col-md-4 col-xl-3 p-1">
                <Attribute trait={item.trait_type} value={item.value} key={i} />
              </div>
            );
          })}
      </div>
    </div>
  );
}
