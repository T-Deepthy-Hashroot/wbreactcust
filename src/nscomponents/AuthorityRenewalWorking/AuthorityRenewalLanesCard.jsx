import React from "react";
// material-ui components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import Button from "components/CustomButtons/Button";

import AuthorityRenewalLanesTable from "./AuthorityRenewalLanesTable";


import {AUTHORITY_RENEWAL_OFFERS_API, AUTHORITY_RENEWAL_SHEET} from "nsglobals/api_end_points"
import {doAxiosGet} from "nsglobals/axios_helper";

import {authorityRenewalRequest} from "nsglobals/authority_renewal_manager";

import cardStyle from "nsassets/jss/ns/NSCardWithButtonsStyle";
import withStyles from "@material-ui/core/styles/withStyles";

import SaveExcel from "@material-ui/icons/Archive";


class AuthorityRenwalLanesCard extends React.Component
{


    constructor(props)
    {
        super(props);
        this.state = {
            value: 0,
            offerID: null,
        };

        this.openExcel = this.openExcel.bind(this);
    }

    componentDidMount()
    {
        // get the offer so we can pass it down to the other components
        let api = AUTHORITY_RENEWAL_OFFERS_API + "?requestId=" + authorityRenewalRequest.request.requestID;

        doAxiosGet(api, (result) =>
        {
            this.setState({offerID: result[0].offerID});
        });
    }

    openExcel()
    {
        const url = AUTHORITY_RENEWAL_SHEET + "?offerId=" + this.state.offerID;
        console.log(url);
        const win = window.open(url, '_blank');
        win.focus();
    }

    render()
    {
        const {classes} = this.props;
        const cardTitle = classes.cardTitle;

        return (
            <Card>
                <CardHeader
                    color={"success"}>
                    <div>
                        <div className={cardTitle}>Lanes</div>
                        <div><Button color="facebook" onClick={() =>
                        {
                            this.openExcel();
                        }}><SaveExcel/>Excel</Button></div>
                    </div>
                </CardHeader>

                <CardBody>
                    <AuthorityRenewalLanesTable
                        defaultPageSize={this.props.defaultPageSize ? this.props.defaultPageSize : 20}
                        offerID={this.state.offerID}
                        reload={this.state.reload}
                    />
                </CardBody>
            </Card>

        );
    }
}


export default withStyles(cardStyle)(AuthorityRenwalLanesCard);
