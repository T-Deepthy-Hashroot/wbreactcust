import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Hidden from "@material-ui/core/Hidden";

// @material-ui/icons
import Person from "@material-ui/icons/Person";

// core components
import Button from "components/CustomButtons/Button.jsx";
import headerLinksStyle from "./headerLinksStyle";
import {getRacf} from "nsglobals/user.jsx";

class HeaderLinks extends React.Component {
  state = {
    open: false
  };
  handleClick = () => {
    this.setState({ open: !this.state.open });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  render() {
      const { classes } = this.props;
    return (
      <div>
        <Button
          color="transparent"
          aria-label="Person"
          //justIcon
          className={ classes.buttonLink}
          muiClasses={{
            label:  ""
          }}
        >
            {getRacf()}
          <Person
            className={
              classes.headerLinksSvg +
              " " +
              (classes.links)
            }
          />
          <Hidden mdUp>
            <span className={classes.linkText}>
              {"Profile"}
            </span>
          </Hidden>
        </Button>
      </div>
    );
  }
}

HeaderLinks.propTypes = {
  classes: PropTypes.object.isRequired,
  rtlActive: PropTypes.bool
};

export default withStyles(headerLinksStyle)(HeaderLinks);
