// ##############################
// // // Footer styles
// #############################

import {
    defaultFont,
    container,
    containerFluid,
} from "assets/jss/material-dashboard-pro-react.jsx";

const footerStyle = {
    block: {},
    left: {
        float: "left!important",
        display: "block",
        padding: "0px",
        margin: "0px",
    },
    right: {
        margin: "0px",
        fontSize: "14px",
        float: "right!important",
        padding: "15px",
    },
    footer: {
        ...defaultFont,
        bottom: "0px",
        padding: "0px",
        margin: "0px",
        zIndex: 4,
        background: "#000000",
        lineHeight: "0px",
    },

    a: {
        "&:hover,&:focus": {
        color: "#FCD603",
        },
        color: "#AAAAAA"
    },
    container: {
        ...container,
        zIndex: 3,
        position: "relative"
    },
    containerFluid: {
        ...containerFluid,
        zIndex: 3,
        position: "relative",
        padding: "0px",
        margin: "0px"
    },
    list: {
        marginBottom: "0px",
        padding: "0px",
        margin: "0px"
    },
    inlineBlock: {
        display: "inline-block",
        padding: "0px",
        width: "auto",
        margin: "0px"
    },
    whiteColor: {
        "&,&:hover,&:focus": {
            color: "#FFFFFF"
        }
    }
};
export default footerStyle;
