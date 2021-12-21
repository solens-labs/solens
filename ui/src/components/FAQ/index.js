import React from "react";
import { withStyles } from "@material-ui/core/styles";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import downArrow from "../../assets/images/FAQ.png";
import { Link } from "react-router-dom";
import "./style.css";

const tempColor = "#40fa78"; // green
const alt_color = "#4b3586"; // purple
const bgColor = "rgba(0,0,0,0.5)"; // green

const Accordion = withStyles({
  root: {
    textAlign: "left",
    borderRadius: "15px",
    boxShadow: "0px 0px 0px 0px #fff",
    fontWeight: "bolder",
    backgroundColor: "transparent",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: `${bgColor}`,
    backdropFilter: "blur(50px)",
    borderRadius: "15px",
    color: `${tempColor}`,
    paddingRight: "60px",
    margin: "4vh 0 0 0",
    border: `1px solid ${tempColor}`,
    boxShadow: `0px 0px 15px 2px ${tempColor}`,
    marginBottom: -3,

    minHeight: 89,
    "&$expanded": {
      minHeight: 89,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    backgroundColor: `${tempColor}`,
    backdropFilter: "blur(50px)",
    borderRadius: "15px",
    color: `${alt_color}`,

    border: `1px solid ${bgColor}`,
    boxShadow: `0px 0px 15px 2px ${bgColor}`,
    padding: theme.spacing(2.5),
  },
}))(MuiAccordionDetails);

const CustomizedAccordions = () => {
  const [expanded, setExpanded] = React.useState("");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div
      id="faq"
      className="faq_container col-12 d-flex justify-content-center"
    >
      <div className="col-12 col-md-10 col-lg-6 mint_box d-flex flex-column align-items-center">
        <h1 className="page_header">FAQ</h1>

        <hr
          style={{
            color: "white",
            width: "95%",
            justifySelf: "center",
          }}
        />

        <div className="accordion-wrpper mx-auto col-10 pb-5">
          <Accordion
            square
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
          >
            <AccordionSummary
              aria-controls="panel1d-content"
              id="panel1d-header"
            >
              <Typography
                className={
                  expanded === "panel1"
                    ? "question-styles active"
                    : "question-styles"
                }
              >
                {/* <img
                  className={expanded === "panel1" ? "arrow active" : "arrow"}
                  src={downArrow}
                  alt=""
                /> */}
                <span className="font_alt">When is the mint date?</span>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="answer-styles">
                <span className="font_alt">
                  Mint will be October 29th at 7PM EST.
                </span>
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            square
            expanded={expanded === "panel2"}
            onChange={handleChange("panel2")}
          >
            <AccordionSummary
              aria-controls="panel2d-content"
              id="panel2d-header"
            >
              <Typography
                className={
                  expanded === "panel2"
                    ? "question-styles active"
                    : "question-styles"
                }
              >
                {/* <img
                  className={expanded === "panel2" ? "arrow active" : "arrow"}
                  src={downArrow}
                  alt=""
                /> */}
                <span className="font_alt">How much per mint?</span>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="answer-styles">
                <span className="font_alt">
                  Each Pesky Pumpkin will cost 1 SOL.
                  <br />
                  There will be a maximum of 10 minted per transaction.
                </span>
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            square
            expanded={expanded === "panel3"}
            onChange={handleChange("panel3")}
          >
            <AccordionSummary
              aria-controls="panel3d-content"
              id="panel3d-header"
            >
              <Typography
                className={
                  expanded === "panel3"
                    ? "question-styles active"
                    : "question-styles"
                }
              >
                {/* <img
                  className={expanded === "panel3" ? "arrow active" : "arrow"}
                  src={downArrow}
                  alt=""
                /> */}
                <span className="font_alt">How many minted?</span>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="answer-styles">
                <span className="font_alt">
                  There will be 6666 Pesky Pumpkins minted. 50 will be minted
                  prior to the public mint for community giveaways and
                  marketing.
                </span>
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            square
            expanded={expanded === "panel4"}
            onChange={handleChange("panel4")}
          >
            <AccordionSummary
              aria-controls="panel4d-content"
              id="panel4d-header"
            >
              <Typography
                className={
                  expanded === "panel4"
                    ? "question-styles active"
                    : "question-styles"
                }
              >
                {/* <img
                  className={expanded === "panel4" ? "arrow active" : "arrow"}
                  src={downArrow}
                  alt=""
                /> */}
                <span className="font_alt">How to mint?</span>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="answer-styles">
                <span className="font_alt">
                  Minting is easy! Simply load up a Phantom, Solflare or Sollet
                  wallet with Solana tokens, connect your wallet to our website,
                  and mint up to 10 Pumpkins per wallet address.
                </span>
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            square
            expanded={expanded === "panel5"}
            onChange={handleChange("panel5")}
          >
            <AccordionSummary
              aria-controls="panel5d-content"
              id="panel5d-header"
            >
              <Typography
                className={
                  expanded === "panel5"
                    ? "question-styles active"
                    : "question-styles"
                }
              >
                {/* <img
                  className={expanded === "panel5" ? "arrow active" : "arrow"}
                  src={downArrow}
                  alt=""
                /> */}
                <span className="font_alt">When roadmap?</span>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="answer-styles">
                <span className="font_alt">
                  No roadmap. Just spooky Halloween-inspired art to celebrate
                  one of the best seasons! We’ll make our own suggestions that
                  we think will provide value moving forward, but ultimately,
                  we’ll be letting the community take the lead on future
                  developments for this project. Join our Discord channel to
                  give suggestions and chat with fellow Trick or Treaters!
                </span>
              </Typography>
            </AccordionDetails>
          </Accordion>
          {/* <Accordion
            square
            expanded={expanded === "panel6"}
            onChange={handleChange("panel6")}
          >
            <AccordionSummary
              aria-controls="panel6d-content"
              id="panel6d-header"
            >
              <Typography
                className={
                  expanded === "panel6"
                    ? "question-styles active"
                    : "question-styles"
                }
              >
                <img
                  className={expanded === "panel6" ? "arrow active" : "arrow"}
                  src={downArrow}
                  alt=""
                />
                <span className="font_alt">
                  Is there a Roadmap or any future plans for the project?
                </span>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="answer-styles">
                <span className="font_alt">
                  Most definitely. For now, only Phase 1's roadmap is public,
                  which you can checkout by going to the{" "}
                  <Link
                    to="/roadmap"
                    style={{
                      color: "#cc66ff",
                      fontWeight: "800",
                      textDecoration: "none",
                    }}
                  >
                    Roadmap section
                  </Link>{" "}
                  of the site. Phase 2 will commence once the project has sold
                  out. But we will leave you with 2 clues. 1: You'll want as
                  many 'extra' Pimps as you can get. And 2: Codename - Operation
                  Supply Shock.
                </span>
              </Typography>
            </AccordionDetails>
          </Accordion> */}
          {/* <Accordion
          square
          expanded={expanded === "panel7"}
          onChange={handleChange("panel7")}
        >
          <AccordionSummary aria-controls="panel6d-content" id="panel6d-header">
            <Typography
              className={
                expanded === "panel7"
                  ? "question-styles active"
                  : "question-styles"
              }
            >
              <img
                className={expanded === "panel7" ? "arrow active" : "arrow"}
                src={downArrow}
                alt=""
              />
              <span className="font_alt">
                How do I claim my Pimp Cut from royalties?
              </span>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography className="answer-styles">
              <span className="font_alt">
                Once we surpass 50+ ETH in secondary sales volume, we will
                implement a smart contract for the royalties and add a claim
                button to the website. All you will have to do is go to the
                claim section on the website, pay a gas fee, and boom, royalties
                from all your Crypto Pimps will be collected (will need to be
                done for each wallet, NOT each Pimp).
              </span>
            </Typography>
          </AccordionDetails>
        </Accordion> */}
        </div>
      </div>
    </div>
  );
};
export default CustomizedAccordions;
