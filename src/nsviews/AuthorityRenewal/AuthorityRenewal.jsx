import React from "react";
// material-ui components
import withStyles from "@material-ui/core/styles/withStyles";
import {isAuthorityRenewalRequestLoaded} from "../../nsglobals/authority_renewal_manager";

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';

import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";

import dashboardStyle from "assets/jss/material-dashboard-pro-react/views/dashboardStyle";
// import for AuthorityRenewalTracker
import AuthorityRenewalTrackerCard from "nscomponents/AuthorityRenewalTracker/AuthorityRenewalTrackerCard";
import AuthorityRenewalDetail from 'nscomponents/AuthorityRenewalWorking/AuthorityRenewalDetail';
import AuthorityRenewalLanesCard from 'nscomponents/AuthorityRenewalWorking/AuthorityRenewalLanesCard';

class AuthorityRenewal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}

    }

    render() {
        const classes = this.props;
        if (isAuthorityRenewalRequestLoaded()) {
            return <div>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                        <ExpansionPanel defaultExpanded={true}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                                <Typography variant="subheading" gutterBottom>
                                    Renewal Info
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails className={classes.details}>
                                <AuthorityRenewalDetail/>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </GridItem>

                    <GridItem xs={12} sm={12} md={12} lg={12}>
                        <AuthorityRenewalLanesCard/>
                    </GridItem>

                </GridContainer>
            </div>

        } else {
            return <div>
                <AuthorityRenewalTrackerCard
                    defaultPageSize={20}/>
            </div>
        }

    }
}


export default withStyles(dashboardStyle)(AuthorityRenewal)
