import React from "react";
import TextField from "@material-ui/core/TextField";
import FormControl from '@material-ui/core/FormControl';
import {authorityRenewalRequest, saveRenewalRequest} from "nsglobals/authority_renewal_manager";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import RefreshIcon from "@material-ui/icons/Autorenew";
import SaveIcon from "@material-ui/icons/Save";
import Log from "nsglobals/Log";
import {withRouter} from "react-router-dom";

import {findAuthorityRenewalRequest} from "nsglobals/authority_renewal_manager";


//import SaveIcon from "@material-ui/icons/Save";
//<Button color='facebook' ><SaveIcon/>Save</Button>

class AuthorityRenewalDetail extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            name: '',
            requestNumber: '',
            internalComments: '',
            createdDate: '',
            statsEffDt: '',
            trafHistEndDt: '',
            eyeProfEndDt: '',
            customer: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.refreshRequest = this.refreshRequest.bind(this);
        this.saveRequest = this.saveRequest.bind(this);
    }

    componentDidMount()
    {
        Log.info( authorityRenewalRequest.request );
        const createdDate = authorityRenewalRequest.request.createdDate?new Date(authorityRenewalRequest.request.createdDate):null;
        const statsEffDt = authorityRenewalRequest.request.statsEffDate?new Date(authorityRenewalRequest.request.statsEffDate):null;
        const trafHistEndDt =  authorityRenewalRequest.request.trafHistEndDate?new Date( authorityRenewalRequest.request.trafHistEndDate ):null;
        const eyeProfEndDt =  authorityRenewalRequest.request.eyeProfEndDate?new Date( authorityRenewalRequest.request.eyeProfEndDate ):null;




        this.setState({
            name: authorityRenewalRequest.request.requestName ? authorityRenewalRequest.request.requestName : '',
            requestNumber: authorityRenewalRequest.request.requestNumber ? authorityRenewalRequest.request.requestNumber : '',
            internalComments: authorityRenewalRequest.request.internalComments ? authorityRenewalRequest.request.internalComments : '',
            createdDate: createdDate?createdDate.toISOString().split('T')[0]:null,
            statsEffDt: statsEffDt?statsEffDt.toISOString().split('T')[0]:null,
            trafHistEndDt: trafHistEndDt?trafHistEndDt.toISOString().split('T')[0]:null,
            eyeProfEndDt: eyeProfEndDt?eyeProfEndDt.toISOString().split('T')[0]:null,
            customer: authorityRenewalRequest.request.customerNameNumber
        });
    }

    handleChange(field, value)
    {

        switch (field)
        {
            case 'name':
                authorityRenewalRequest.request.requestName = value;
                this.setState({name: authorityRenewalRequest.request.requestName});
                return;
            case 'internalComments':
                authorityRenewalRequest.request.internalComments = value;
                this.setState({internalComments: authorityRenewalRequest.request.internalComments});
                return;
            case 'statsEffDt' :
                authorityRenewalRequest.request.statsEffDate = value;
                this.setState({statsEffDt: authorityRenewalRequest.request.statsEffDate});
                return;
            default :
                return;
        }
    }

    refreshRequest()
    {
        findAuthorityRenewalRequest(authorityRenewalRequest.request.bureau, authorityRenewalRequest.request.authNum, authorityRenewalRequest.request.originalExpDate, authorityRenewalRequest.request.statsEffDate, this.props.history, true);
    }

    saveRequest()
    {
        saveRenewalRequest( this.props.history );
    }


    render()
    {
        // TODO add in Stats Start Date here and a button to refresh
        return <FormControl fullWidth>
            <GridContainer>
                <GridItem xs={12} sm={6} md={3} lg={2}>
                    <TextField
                        id="requestNumber"
                        label="Number"
                        value={this.state.requestNumber}
                        margin="normal"
                        type="text"
                        disabled
                        fullWidth
                    />
                </GridItem>
                <GridItem xs={12} sm={6} md={3} lg={2}>
                    <TextField
                        id="createdDate"
                        label="Created"
                        value={this.state.createdDate}
                        margin="normal"
                        type="date"
                        disabled
                        fullWidth
                    />
                </GridItem>
                <GridItem xs={12} sm={6} md={6} lg={2}>
                        <TextField
                            required
                            id="statsEffDt"
                            label="Stats Start Date"
                            type="date"
                            value={this.state.statsEffDt}
                            onChange={(event) =>
                            {
                                this.handleChange('statsEffDt', event.target.value);
                            }}
                            margin="normal"
                        />
                </GridItem>
                <GridItem xs={12} sm={6} md={6} lg={2}>
                    <TextField
                        id="thEndDt"
                        label="Traffic History End Date"
                        value={this.state.trafHistEndDt}
                        margin="normal"
                        type="date"
                        disabled
                        fullWidth
                    />
                </GridItem>
                <GridItem xs={12} sm={6} md={6} lg={2}>
                    <TextField
                        id="epEndDt"
                        label="EyeProfit End Date"
                        value={this.state.eyeProfEndDt}
                        margin="normal"
                        type="date"
                        disabled
                        fullWidth
                    />
                </GridItem>



                <GridItem xs={12} sm={12} md={12} lg={8}>
                    <TextField
                        required
                        id="name"
                        label="Name"
                        value={this.state.name}
                        onChange={(event) =>
                        {
                            this.handleChange('name', event.target.value);
                        }}
                        margin="normal"
                        fullWidth
                    />
                </GridItem>
                <GridItem xs={12} sm={6} md={6} lg={4}>
                    <TextField
                        id="customer"
                        label="Customer"
                        value={this.state.customer}
                        margin="normal"
                        type="text"
                        disabled
                        fullWidth
                    />
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                    <TextField
                        id="internalComments"
                        label="Internal Comments"
                        value={this.state.internalComments}
                        onChange={(event) =>
                        {
                            this.handleChange('internalComments', event.target.value);
                        }}
                        margin="normal"
                        multiline
                        rows={1}
                        rowsMax={10}
                        fullWidth
                    />
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                    <Button color='facebook' onClick={this.refreshRequest}><RefreshIcon/>Refresh Statistics</Button>
                    <Button color='facebook' onClick={this.saveRequest}><SaveIcon/>Save</Button>
                </GridItem>

            </GridContainer>
        </FormControl>


    }
}

export default withRouter(AuthorityRenewalDetail);



