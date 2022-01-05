import React from "react";
import { withStyles } from "@material-ui/core/styles";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import "./style.css";
import { faqs } from "../../constants/faqs";

const textColor = "#FFFFFF"; // white
const questionBgColor = `linear-gradient(
  -45deg,
  rgb(65, 37, 156),
  rgb(134, 64, 117) 120%
) !important`;
const bgColor = "rgb(18, 11, 37)"; // dark purple

const Accordion = withStyles({
  root: {
    textAlign: "left",
    borderRadius: "15px",
    boxShadow: "0px 0px 0px 0px transparent",
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
    // backgroundColor: `${bgColor}`,
    background: questionBgColor,
    backdropFilter: "blur(50px)",
    borderRadius: "15px",
    color: textColor,
    paddingRight: "60px",
    margin: "2vh 0 0 0",
    // border: `1px solid black`,
    boxShadow: `0px 0px 15px 2px black`,

    minHeight: 79,
    "&$expanded": {
      minHeight: 79,
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
    background: bgColor,
    backdropFilter: "blur(50px)",
    borderRadius: "15px",
    color: textColor,
    margin: "3vh 2vh 1vh 2vh",

    border: `1px solid black`,
    // boxShadow: `0px 0px 15px 2px ${bgColor}`,
    padding: theme.spacing(2.5),
  },
}))(MuiAccordionDetails);

const CustomizedAccordions = (props) => {
  const [expanded, setExpanded] = React.useState("");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div
      id="faq"
      className="faq_container col-12 d-flex justify-content-center mt-4"
    >
      <div className="col-12 col-md-10 col-lg-6 d-flex flex-column align-items-center">
        <h1 className="page_header">LaunchZone FAQs</h1>
        <div className="mx-auto col-10 pb-3">
          {faqs.map((item, i) => {
            return (
              <Accordion
                square
                expanded={expanded === `panel${i}`}
                onChange={handleChange(`panel${i}`)}
              >
                <AccordionSummary
                  aria-controls={`panel${i}-content`}
                  id={`panel${i}-header`}
                  // className="border_gradient border_gradient_purple"
                >
                  <Typography
                    className={
                      expanded === `panel${i}`
                        ? "question-styles active"
                        : "question-styles"
                    }
                  >
                    <span className="font_main">{item.question}</span>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography className="answer-styles">
                    <span className="font_main">{item.answer}</span>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default CustomizedAccordions;
