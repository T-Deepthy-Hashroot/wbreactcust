import React from "react";

// material-ui components
import withStyles from "@material-ui/core/styles/withStyles";


// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";


import dashboardStyle from "assets/jss/material-dashboard-pro-react/views/dashboardStyle";

// import for AuthorityRenewalTracker
import AuthorityRenewalTrackerCard from "nscomponents/AuthorityRenewalTracker/AuthorityRenewalTrackerCard";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return <div>
            <GridContainer>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                    <AuthorityRenewalTrackerCard
                    defaultPageSize={5}/>
                </GridItem>
            </GridContainer>
        </div>

    }
}


export default withStyles(dashboardStyle)(Dashboard)
