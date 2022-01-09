import React, { useEffect, useState } from "react";
import "./style.css";
import TradingModule from "../../components/TradingModule";
import { useParams } from "react-router-dom";
import { getTokenMetadata } from "../../utils/getMetadata";
import Attribute from "../../components/Attribute";
import Loader from "../../components/Loader";
import { explorerLink } from "../../constants/constants";
import { shortenAddress } from "../../candy-machine";
import InfoModule from "../../components/InfoModule";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "../../components/Accordion";
import { Typography } from "@material-ui/core";

export default function MintPage(props) {
  const { address } = useParams();
  const { links } = props;

  const [tokenMetadata, setTokenMetadata] = useState({});
  const [royalty, setRoyalty] = useState(0);
  const [attributes, setAttributes] = useState([]);
  const [marketplaces, setMarketplaces] = useState([]);

  // Accordions Expansion State
  const [attributesExpanded, setAttributesExpanded] = useState(true);
  const [transactionsExpanded, setTransactionsExpanded] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(true);

  const received = Object.keys(tokenMetadata).length > 0;

  // Fetch mint address metadata
  useEffect(async () => {
    if (address && !received) {
      const metadata = getTokenMetadata(address);
      const resolved = await Promise.resolve(metadata);
      console.log(resolved);
      setTokenMetadata(resolved);
    }
  }, [address]);

  // Fetch mint's collection data
  useEffect(async () => {
    // if ()
  });

  // Calculate Royalty into State
  useEffect(() => {
    if (received) {
      setRoyalty(tokenMetadata.seller_fee_basis_points / 100);
      setAttributes(tokenMetadata.attributes);
    }
  }, [tokenMetadata]);

  return (
    <div className="col-12 d-flex flex-column align-items-center mt-4 mt-lg-5">
      <div className="details_header col-12 col-xl-10 col-xxl-8 d-flex flex-row flex-wrap justify-content-center mb-3">
        <div className="col-12 col-lg-6 d-flex justify-content-center align-items-start p-1 pt-0 pb-0">
          {received ? (
            <div className="nft_image_container">
              <img
                src={tokenMetadata && tokenMetadata.image}
                className="nft_image"
                alt=""
              />
            </div>
          ) : (
            <div className="nft_image_container d-flex justify-content-center overflow-hidden">
              <Loader />
            </div>
          )}
        </div>

        <div className="col-12 col-lg-6 d-flex flex-column mt-4 mt-lg-0">
          <TradingModule item={tokenMetadata} links={links} />

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
                <InfoModule
                  item={tokenMetadata}
                  royalty={royalty}
                  received={received}
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
            {/* <div className="col-12 d-flex flex-wrap justify-content-start">
              {received &&
                tokenMetadata.attributes?.map((item, i) => {
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
            </div> */}
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
}
