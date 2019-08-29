// ##############################
// // // TasksCard component styles
// #############################

import {blueCardHeader, card, cardHeader, defaultFont, greenCardHeader, orangeCardHeader, purpleCardHeader, redCardHeader, roseCardHeader} from "assets/jss/material-dashboard-pro-react.jsx";

const NSCardWithButtonsStyle = theme => ({
    card,
    cardHeader: {
        flex: "none",
        ...cardHeader,
        ...defaultFont
    },
    cardHeaderRTL: {
        display: "block",
        "&:after,&:before": {
            display: "table",
            content: '" "'
        },
        "&:after": {
            boxSizing: "border-box"
        }
    },
    orangeCardHeader,
    greenCardHeader,
    redCardHeader,
    blueCardHeader,
    purpleCardHeader,
    roseCardHeader,
    cardTitle: {
        ...defaultFont,
        float: "left",
        padding: "10px 10px 10px 0",
        lineHeight: "24px",
        fontSize: "18px",
        color: "#FFFFFF"
    },
    tabWrapper: {
        width: "auto",
        display: "inline-flex",
        alignItems: "inherit",
        flexDirection: "row",
        justifyContent: "center",
        [theme.breakpoints.down("sm")]: {
            display: "flex"
        }
    },
    tabIcon: {
        float: "left",
        [theme.breakpoints.down("sm")]: {
            marginTop: "-2px"
        }
    },
    displayNone: {
        display: "none"
    },
    labelIcon: {
        height: "100px",
        width: "110px",
        minWidth: "72px",
        paddingLeft: "14px",
        borderRadius: "3px"
    },
    root: {
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        margin: "5px",
    },
    tabRootButton: {
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        minHeight: "40px !important",
        minWidth: "150px !important",
        width: "150px !important",
        height: "40px !important",
        maxWidth: "150px !important",
        maxHeight: "40px !important",
        padding: "0px 0px",
        borderRadius: "3px",
        lineHeight: "10px",
        border: "0 !important",
        color: "#fff !important",
        marginRight: "10px",
        marginBottom: "5px"
    },
    tabsContainer: {
        marginTop: "0px",
        marginLeft: "10px",
        color: "#FFFFFF",
        display: "flex",
        flexWrap: "wrap"
    },
    tabsContainerRTL: {
        float: "right"
    },
    tabs: {
        width: "0px",
        minWidth: "0px",
    },
    cardHeaderContent: {
        flex: "none"
    },
    label: {
        lineHeight: "19px",
        textTransform: "uppercase",
        fontSize: "12px",
        fontWeight: "500",
        marginLeft: "-10px"
    },
    tabSelected: {
        backgroundColor: "rgba(0, 128, 0)",
        transition: "0.2s background-color 0.1s"
    },
});

export default NSCardWithButtonsStyle;
