import React, { useEffect, useState } from "react";
import "./style.css";
import TradingModule from "../../components/TradingModule";
import { useParams } from "react-router-dom";
import { getTokenMetadata } from "../../utils/getMetadata";
import Attribute from "../../components/Attribute";
import Loader from "../../components/Loader";
import { api, explorerLink, queries } from "../../constants/constants";
import { shortenAddress } from "../../candy-machine";
import ItemDetails from "../../components/ItemDetails";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "../../components/Accordion";
import { Typography } from "@material-ui/core";
import convertActivityData from "../../utils/convertActivityData";
import axios from "axios";
import ActivityTable from "../../components/ActivityTable";
import sol_logo from "../../assets/images/sol_logo.png";

export default function MintPage(props) {
  const { address } = useParams();

  // Token Detials State
  const [collectionInfo, setCollectionInfo] = useState("");
  const [tokenMetadata, setTokenMetadata] = useState({});
  const [royalty, setRoyalty] = useState(0);
  const [attributes, setAttributes] = useState([]);
  const [image, setImage] = useState("");
  const [marketplaces, setMarketplaces] = useState([]);
  const [activity, setActivity] = useState([]);

  // Accordions Expansion State
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [attributesExpanded, setAttributesExpanded] = useState(true);
  const [transactionsExpanded, setTransactionsExpanded] = useState(false);

  const received = Object.keys(tokenMetadata).length > 0;

  // Fetch mint address metadata
  useEffect(async () => {
    if (address && !received) {
      const metadata = getTokenMetadata(address);
      const resolved = await Promise.resolve(metadata);
      setTokenMetadata(resolved);
    }
  }, [address]);

  // Fetch mint's collection symbol & data
  useEffect(async () => {
    if (address && collectionInfo.length === 0) {
      const apiRequest = api.devServer.symbol + address;
      const request = axios.get(apiRequest).then((response) => {
        const symbol = response.data.symbol;
        if (symbol) {
          const apiRequest2 = api.server.collection + queries.symbol + symbol;
          const request2 = axios.get(apiRequest2).then((response) => {
            const info = response.data[0];
            setCollectionInfo(info);

            const marketplacesArray = info.alltimestats?.map((mp, i) => {
              return mp.marketplace;
            });
            setMarketplaces(marketplacesArray);
          });
        }
      });
    }
  }, [address]);

  // Fetch mint history
  useEffect(async () => {
    if (address && activity.length === 0) {
      const apiRequest = api.devServer.mintHistory + address;
      const request = axios.get(apiRequest).then((response) => {
        const history = response.data;

        if (history.length > 0) {
          const data = convertActivityData(history);
          setActivity(data);
          setTransactionsExpanded(true);
        }
      });
    }
  }, [address]);

  // Calculate Royalty into State
  useEffect(() => {
    if (received) {
      setImage(tokenMetadata.image);
      setRoyalty(tokenMetadata.seller_fee_basis_points / 100);
      setAttributes(tokenMetadata.attributes);
    }
  }, [tokenMetadata]);

  return (
    <div className="col-12 d-flex flex-column align-items-center mt-4 mt-lg-5">
      <div className="details_header col-12 col-xl-10 col-xxl-8 d-flex flex-row flex-wrap justify-content-center mb-3">
        <div className="col-12 col-lg-6 d-flex flex-column justify-content-start align-items-center p-1 pt-0 pb-0">
          {received ? (
            <div className="nft_image_container">
              <img src={image} className="nft_image" alt="" />
            </div>
          ) : (
            <div className="nft_image_container d-flex justify-content-center overflow-hidden">
              <Loader />
            </div>
          )}
          {/* <div className="trading_module col-12 d-flex flex-column align-items-center justify-content-center p-md-2 mt-3">
            <h4 className="m-0 p-0">Status: Listed</h4>
            <h4 className="m-0 p-0">
              Price:{" "}
              <img src={sol_logo} alt="sol logo" className="price_logo_lg" />
              {200}
            </h4>
          </div> */}
        </div>

        <div className="col-12 col-lg-6 d-flex flex-column mt-4 mt-lg-0">
          <TradingModule
            item={tokenMetadata}
            mint={address}
            collection={collectionInfo}
            marketplaces={marketplaces}
          />

          <div className="details col-12 mt-3 mt-lg-0">
            <Accordion
              square
              expanded={detailsExpanded}
              onChange={() => setDetailsExpanded(!detailsExpanded)}
            >
              <AccordionSummary
                aria-controls={`details_content`}
                id={`details_header`}
                // className="border_gradient border_gradient_purple"
              >
                <Typography
                  className={
                    attributesExpanded
                      ? "question-styles active"
                      : "question-styles"
                  }
                >
                  <span className="font_main">Item Details</span>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ItemDetails
                  item={tokenMetadata}
                  royalty={royalty}
                  received={received}
                  marketplaces={marketplaces}
                />
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </div>

      <div className="attributes col-12 col-xl-10 col-xxl-8 mb-3">
        <Accordion
          square
          expanded={attributesExpanded}
          onChange={() => setAttributesExpanded(!attributesExpanded)}
        >
          <AccordionSummary
            aria-controls={`attributes_content`}
            id={`attributes_header`}
            // className="border_gradient border_gradient_purple"
          >
            <Typography
              className={
                attributesExpanded
                  ? "question-styles active"
                  : "question-styles"
              }
            >
              <span className="font_main">Attributes</span>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="col-12 d-flex flex-wrap justify-content-start">
              {received &&
                attributes.map((item, i) => {
                  return (
                    <div className="col-6 col-md-4 col-xl-3 col-xxl-2 p-1">
                      <Attribute
                        trait={item.trait_type}
                        value={item.value}
                        key={i}
                      />
                    </div>
                  );
                })}
            </div>
          </AccordionDetails>
        </Accordion>
      </div>

      <div className="transactions col-12 col-xl-10 col-xxl-8 mb-3">
        <Accordion
          square
          expanded={transactionsExpanded}
          onChange={() => setTransactionsExpanded(!transactionsExpanded)}
        >
          <AccordionSummary
            aria-controls={`attributes_content`}
            id={`attributes_header`}
          >
            <Typography
              className={
                transactionsExpanded
                  ? "question-styles active"
                  : "question-styles"
              }
            >
              <span className="font_main">Transactions</span>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="col-12">
              <ActivityTable data={activity} />
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
}
