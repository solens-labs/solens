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

  const received = Object.keys(tokenMetadata).length > 0;

  // Fetch mint address metadata
  useEffect(async () => {
    if (address && Object.keys(tokenMetadata).length === 0) {
      const metadata = getTokenMetadata(address);
      const resolved = await Promise.resolve(metadata);
      // console.log(resolved);
      setTokenMetadata(resolved);
    }
  }, [address]);

  // Calculate Royalty into State
  useEffect(() => {
    if (Object.keys(tokenMetadata).length > 0) {
      setRoyalty(tokenMetadata.seller_fee_basis_points / 100);
    }
  }, [tokenMetadata]);

  const [attributesExpanded, setAttributesExpanded] = useState(false);
  const [transactionsExpanded, setTransactionsExpanded] = useState(false);

  return (
    <div className="col-12 d-flex flex-column align-items-center pt-5">
      <div className="d-flex flex-row flex-wrap col-12 col-xxl-10 justify-content-center mb-4">
        <div className="col-10 col-sm-8 col-md-6 col-lg-5 col-xl-4 col-xxl-5 d-flex justify-content-center align-items-start p-lg-2 p-xxl-1">
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

        <div className="d-flex flex-column col-12 col-lg-5 mt-4 mt-lg-0 p-lg-2 p-xxl-1">
          <TradingModule item={tokenMetadata} links={links} />
          <InfoModule
            item={tokenMetadata}
            royalty={royalty}
            received={received}
          />
        </div>
      </div>

      <div className="attributes col-8">
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
            </div>
          </AccordionDetails>
        </Accordion>
      </div>

      <div className="transactions col-8">
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
