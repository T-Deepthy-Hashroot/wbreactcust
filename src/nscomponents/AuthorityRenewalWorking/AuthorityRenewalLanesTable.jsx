import React from "react";
import WBTable from "nscomponents/Tables/WBTable";

//import {systemOfUnitsFormat} from "globals/helperfunctions"
import {AUTHORITY_RENEWAL_FIELD_DEFINITIONS_API, AUTHORITY_RENEWAL_LANES_API} from "nsglobals/api_end_points"
import {doAxiosGet} from "nsglobals/axios_helper";
import {withRouter} from "react-router-dom";
import Log from "nsglobals/Log";
import {authorityRenewalRequest} from "nsglobals/authority_renewal_manager";


function getColumn(obj, headerStyle)
{
    switch (obj.type)
    {
        case "Text":
            return ({
                Header: obj.title,
                accessor: obj.name,
                filterMethod: (filter, row) =>
                    row[filter.id].toUpperCase().includes(filter.value.toUpperCase()),
                headerStyle: headerStyle,
            });
        case "Number":
            return ({
                Header: obj.title,
                accessor: obj.name,
                headerStyle: headerStyle,

            });
        case "Date":
            return ({
                Header: obj.title,
                accessor: obj.name,
                headerStyle: headerStyle,
            });
        default:
            return ({
                Header: obj.title,
                accessor: obj.name,
                headerStyle: headerStyle,
            });
    }
}

function getColumnGroupHeader(source)
{

    let statsEffDt = authorityRenewalRequest.request.statsEffDate ? new Date(authorityRenewalRequest.request.statsEffDate) : null;
    let trafHistEndDt = authorityRenewalRequest.request.trafHistEndDate ? new Date(authorityRenewalRequest.request.trafHistEndDate) : null;
    let eyeProfEndDt = authorityRenewalRequest.request.eyeProfEndDate ? new Date(authorityRenewalRequest.request.eyeProfEndDate) : null;

    statsEffDt = statsEffDt ? statsEffDt.toISOString().split('T')[0] : 'NA';
    trafHistEndDt = trafHistEndDt ? trafHistEndDt.toISOString().split('T')[0] : 'NA';
    eyeProfEndDt = eyeProfEndDt ? eyeProfEndDt.toISOString().split('T')[0] : 'NA';


    if (source === 'TH')
    {
        return 'Traffic History (' + statsEffDt + ' to ' + trafHistEndDt + ')';
    }
    else if (source === 'EP')
    {
        return 'EyeProfit (' + statsEffDt + ' to ' + eyeProfEndDt + ')';
    }
    else if (source === 'ALK')
    {
        return 'ALK Miles';
    }
    else
    {
        return source;
    }
}


class AuthorityRenewalLanesTable extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            data: [],
            loading: true,
            columns: []
        };
    }

    componentDidUpdate()
    {

        if (this.state.loading)
        {
            // fetch the columns to show
            const api = AUTHORITY_RENEWAL_FIELD_DEFINITIONS_API + '?table=Lane';
            doAxiosGet(api, (result) =>
            {
                const fieldsToShow = result.filter((obj, index, array) =>
                {
                    return obj.display;
                });


                let i = 0;
                let obj = null;
                let lastSource = null;
                let groupOfColumns = [];
                let headerStyle = {};
                let tableColumns = [];

                while (fieldsToShow[i])
                {

                    obj = fieldsToShow[i];
                    if (lastSource && lastSource !== obj.source)
                    {
                        // create a sub header and put the current group of coluns in it
                        tableColumns.push({
                            Header: getColumnGroupHeader(lastSource),
                            headerStyle: headerStyle,
                            columns: groupOfColumns,
                        });

                        groupOfColumns = [];
                    }

                    lastSource = obj.source;

                    switch (obj.source)
                    {
                        case 'ERAS':
                            headerStyle = {backgroundColor: '#FF000030'};
                            break;

                        case 'TH':
                            headerStyle = {backgroundColor: '#00FF0030'};
                            break;

                        case 'EP':
                            headerStyle = {backgroundColor: '#0000FF30'};
                            break;

                        case 'WS':
                            headerStyle = {backgroundColor: '#00000030'};
                            break;

                        case 'ALK':
                            headerStyle = {backgroundColor: '#00000030'};
                            break;

                        default:
                            headerStyle = {backgroundColor: '#FFFF0050'};
                    }

                    groupOfColumns.push(getColumn(obj, headerStyle));

                    i++;

                    if (!fieldsToShow[i])
                    {
                        tableColumns.push({
                            Header: getColumnGroupHeader(lastSource),
                            headerStyle: headerStyle,
                            columns: groupOfColumns,
                        });
                    }

                }
                Log.info(tableColumns, 'AuthorityRenewalLanesTable.jsx')

                // after we have the columns - now get the lanes
                const lanesApi = AUTHORITY_RENEWAL_LANES_API + "?offerId=" + this.props.offerID;
                doAxiosGet(lanesApi, (result) =>
                {
                    const tableData = result.map((obj, key) =>
                    {
                        return ({
                            ...obj,
                            id: key,
                        })
                    });

                    this.setState({data: tableData, loading: false, columns: tableColumns});
                });

            });

        }
    }


    render()
    {
        Log.info(this.state.data.length);

        return (<WBTable
            data={this.state.data}
            loading={this.state.loading}
            filterable={true}
            columns={this.state.columns}
            defaultPageSize={20}
            showPaginationTop={false}
            showPaginationBottom
            minRows={0}
            className="-striped -highlight"
            //getTheadTrProps= {() => {return  { style: { position: 'fixed',  top: 1} }}}  // TODO possible way to lock the headers to the top - going to need some work though.
        />)


    }
}

// using withRouter adds the history property needed for navigation.
export default withRouter(AuthorityRenewalLanesTable)
