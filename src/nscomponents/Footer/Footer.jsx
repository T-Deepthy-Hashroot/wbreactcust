import React from "react";
import PropTypes from "prop-types";

// material-ui components
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import footerStyle from "./footerStyle";

function Footer({ ...props }) {
  const { classes } = props;

  const a = classes.a;

  return (
    <footer className={classes.footer}>
      <div className={classes.containerFluid}>
        <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <a href="/workbench/dashboard" className={classes.a}>
                 Workbench Home
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="http://www.nscorp.com/content/nscorp/en.html" target="_blank" rel="noopener noreferrer" className={classes.a}>
                 NS Corporate Website
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="https://accessns.nscorp.com/accessNS/#login" target="_blank" rel="noopener noreferrer" className={classes.a}>
                AccessNS
              </a>
            </ListItem>
          </List>
        </div>
        <p className={classes.right}>
          <a href="http://www.nscorp.com/content/nscorp/en.html" target="_blank" rel="noopener noreferrer" className={classes.a}>
              &copy; {1900 + new Date().getYear()}{" "} Norfolk Southern Corp
          </a>
        </p>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
  fluid: PropTypes.bool,
  white: PropTypes.bool,
  rtlActive: PropTypes.bool
};

export default withStyles(footerStyle)(Footer);
