import { withStyles } from "@material-ui/core/styles";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";

const textColor = "#FFFFFF"; // white
const questionBgColor = `linear-gradient(
  -45deg,
  rgba(65, 37, 156, 0.85),
  rgba(134, 64, 117, 0.85) 120%
) !important`;
const bgColor = "rgb(18, 11, 37)"; // dark purple

export const Accordion = withStyles({
  root: {
    textAlign: "left",
    // borderRadius: "15px",
    boxShadow: "0px 0px 0px 0px transparent",
    // fontWeight: "bolder",
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

export const AccordionSummary = withStyles({
  root: {
    // backgroundColor: `${bgColor}`,
    background: questionBgColor,
    backdropFilter: "blur(50px)",
    border: `1px solid black`,
    borderRadius: "15px 15px 15px 15px",
    color: textColor,
    margin: "1vh 0 0 0",
    minHeight: 79,
    // paddingRight: "60px",
    // boxShadow: `0px 0px 15px 2px black`,

    "&$expanded": {
      minHeight: 79,
      borderRadius: "15px 15px 0px 0px",
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
})(MuiAccordionSummary);

export const AccordionDetails = withStyles((theme) => ({
  root: {
    // background: bgColor,
    // background: "rgba(0,0,0,0.2)",
    background: "rgba(18, 11, 37, 0.7)",
    backdropFilter: "blur(50px)",
    border: `1px solid black`,
    borderRadius: "0px 0px 15px 15px",
    color: textColor,
    fontWeight: 100,

    // margin: "1vh 0vh",
    // boxShadow: `0px 0px 15px 2px ${bgColor}`,
    // padding: theme.spacing(1),
  },
}))(MuiAccordionDetails);
