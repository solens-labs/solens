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
import convertActivityData from "../../utils/convertActivityMintData";
import axios from "axios";
import ActivityTable from "../../components/TableActivityMint";
import ErrorIcon from "@mui/icons-material/Error";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import ReactGA from "react-ga";
import {
  getListedInfoFromBackend,
  getListedInfoFromChain,
} from "../../utils/getListedDetails";
import { Helmet } from "react-helmet";

export default function MintPage(props) {
  const { address } = useParams();
  const { connection } = useConnection();

  // Token Details State
  const [tokenMetadata, setTokenMetadata] = useState({});
  const [collectionInfo, setCollectionInfo] = useState("");
  const [royalty, setRoyalty] = useState(0);
  const [attributes, setAttributes] = useState([]);
  const [image, setImage] = useState("");
  const [marketplaces, setMarketplaces] = useState([]);
  const [activity, setActivity] = useState([]);
  const [tokenAccount, setTokenAccount] = useState("");
  const [ownerAccount, setOwnerAccount] = useState("");
  const [listed, setListed] = useState(false);
  const [listedDetails, setListedDetails] = useState({});
  const [floorDetails, setFloorDetails] = useState({});

  // Accordions Expansion State
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [attributesExpanded, setAttributesExpanded] = useState(true);
  const [transactionsExpanded, setTransactionsExpanded] = useState(false);

  // Logic to populate page if token is valid
  const received = Object.keys(tokenMetadata).length > 0;
  const [invalidToken, setInvalidToken] = useState(false);
  const [invalidCollection, setInvalidCollection] = useState(false);
  const [unsupportedToken, setUnsupportedToken] = useState(false);

  // Analytics note which mint was visited
  useEffect(() => {
    if (received && !invalidToken) {
      ReactGA.event({
        category: "User",
        action: "Mint Visit",
        label: address,
      });
    }
  }, [received, invalidToken]);

  // Analytics send unsuppored collection tokens
  useEffect(() => {
    if (received && !invalidToken && invalidCollection) {
      ReactGA.event({
        category: "Collection",
        action: "Unsupported Collection",
        label: address,
      });
    }
  }, [received, invalidToken, invalidCollection]);

  // Fetch mint address metadata
  useEffect(async () => {
    if (address && !received) {
      const metadata = getTokenMetadata(address);
      const resolved = await Promise.resolve(metadata);

      if (resolved["invalid"]) {
        setInvalidToken(true);
        return;
      }
      setTokenMetadata(resolved);
    }
  }, [address]);

  // Fetch mint's collection symbol, data & floor
  useEffect(async () => {
    if (address && collectionInfo.length === 0) {
      const apiRequest = api.server.mintSymbol + address;
      const request = axios.get(apiRequest).then((response) => {
        const symbol = response.data?.symbol;

        if (!symbol) {
          setInvalidCollection(true);
        }

        if (symbol) {
          // Request to get Collection Info
          const apiRequest2 = api.server.collection + queries.symbol + symbol;
          const request2 = axios.get(apiRequest2).then((response) => {
            const info = response.data[0];
            setCollectionInfo(info);

            const marketplacesArray = info.alltimestats?.map((mp, i) => {
              return mp.marketplace;
            });
            setMarketplaces(marketplacesArray);
          });

          // Request Collection floor
          const apiRequest3 = api.server.currentFloor + queries.symbol + symbol;
          const currentFloor = axios.get(apiRequest3).then((response) => {
            const [floorData] = response.data;
            setFloorDetails(floorData);
          });
        }
      });
    }
  }, [address]);

  // Fetch listed item's details from chain & backend
  useEffect(async () => {
    const chainDetails = await getListedInfoFromChain(address);
    if (chainDetails) {
      setListed(true);
      setListedDetails(chainDetails);
      return;
    }

    const backendDetails = await getListedInfoFromBackend(address);
    if (backendDetails) {
      setListed(true);
      setListedDetails(backendDetails);
    }
  }, [address]);

  // Fetch mint activity
  useEffect(async () => {
    if (address && activity.length === 0) {
      const apiRequest = api.server.mintHistory + address;
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

  // Calculate project royalty
  useEffect(() => {
    if (received && !invalidToken) {
      try {
        setImage(tokenMetadata.image);
        setRoyalty(tokenMetadata.seller_fee_basis_points / 100);
        setAttributes(tokenMetadata.attributes);
      } catch {
        console.log("Error setting image, royalty, or attributes");
      }
    }
  }, [tokenMetadata]);

  // Get Mint's Token Account & Owner Account
  useEffect(async () => {
    if (address && !tokenAccount && !ownerAccount) {
      try {
        const key = new PublicKey(address);
        const test1 = await connection.getTokenLargestAccounts(key);
        if (test1?.value.length === 0) {
          return;
        }

        const account = test1.value[0];
        if (account.amount === "1") {
          const accountString = account.address.toBase58();
          setTokenAccount(accountString);

          const tokenAcctInfo = await connection.getParsedAccountInfo(
            account.address
          );
          const owner = tokenAcctInfo.value.data.parsed.info.owner;
          setOwnerAccount(owner);
        }
      } catch {
        console.log("Error getting Token Account");
      }
    }
  }, [address]);

  return (
    <div className="col-12 d-flex flex-column align-items-center mt-4 mt-lg-5">
      {collectionInfo && collectionInfo.name && (
        <Helmet>
          <title>{`Solens - ${collectionInfo.name}`}</title>
          <meta
            name="description"
            content={`Trade and get analytics for ${collectionInfo?.name} on Solana's premier NFT Marketplex.`}
          />
        </Helmet>
      )}

      <div className="details_header col-12 col-xl-10 col-xxl-8 d-flex flex-row flex-wrap justify-content-center mb-3">
        <div className="mint_item_image col-12 col-lg-6 d-flex flex-column justify-content-start align-items-center p-1 pt-0 pb-0">
          {received ? (
            <div className="nft_image_container">
              <img
                src={image}
                className="nft_image"
                alt="nft image"
                loading="eager"
              />
            </div>
          ) : (
            <div className="nft_image_container d-flex justify-content-center overflow-hidden">
              {invalidToken ? (
                <div className="col-12 d-flex justify-content-center align-items-center">
                  <ErrorIcon fontSize="large" />
                </div>
              ) : (
                <Loader />
              )}
            </div>
          )}
        </div>

        <div className="trading col-12 col-lg-6 d-flex flex-column mt-4 mt-lg-0">
          <TradingModule
            address={address}
            invalid={invalidToken}
            invalidCollection={invalidCollection}
            item={tokenMetadata}
            collection={collectionInfo}
            tokenAccount={tokenAccount}
            ownerAccount={ownerAccount}
            listed={listed}
            listedDetails={listedDetails}
            floorDetails={floorDetails}
            setListed={setListed}
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
                  invalid={invalidToken}
                  item={tokenMetadata}
                  royalty={royalty}
                  received={received}
                  marketplaces={marketplaces}
                  listedDetails={listedDetails}
                  tokenAccount={tokenAccount}
                  ownerAccount={ownerAccount}
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
                attributes?.map((item, i) => {
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
            aria-controls={`transactions_content`}
            id={`transactions_header`}
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
              <ActivityTable
                data={activity}
                getColumnProps={(column) => ({
                  // onClick: () => alert("Column!"),
                })}
                getCellProps={(cellInfo) => ({
                  style: {
                    // fontWeight: 100,
                  },
                })}
              />
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
}
