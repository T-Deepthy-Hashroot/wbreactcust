import React from "react";
import WBTable from "nscomponents/Tables/WBTable";
import NumberFormat from "react-number-format";
import {systemOfUnitsFormat} from "nsglobals/helperfunctions"
import Moment from "react-moment";
import axios from "axios/index";
import {AUHTORITY_RENEWAL_TRACKER_SECTIONS_API} from "nsglobals/api_end_points"
import {withRouter} from "react-router-dom";


class SectionsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true,
        };
    }

    componentDidMount() {
        console.log(this.props.bureau + ":" + this.props.authority + ":" + this.props.expDt + ":" + this.props.majorGroup);

        console.log(AUHTORITY_RENEWAL_TRACKER_SECTIONS_API);

        let parameters = "?bureau=" + this.props.bureau;
        parameters += "&authority=" + this.props.authority;
        parameters += "&expDt=" + this.props.expDt;
        parameters += "&majorGroup=" + this.props.majorGroup;


        axios.get(AUHTORITY_RENEWAL_TRACKER_SECTIONS_API + parameters ).then((response) => {
            console.log( response );
            const today = new Date();
            const newData = response.status === 200 ? response.data.result.map((obj, key) => {
                return ({
                    id: key,
                    bureau: (obj.bureau ? obj.bureau + " " : ""),
                    authority: (obj.authority ? obj.authority : ""),
                    section: (obj.section ? obj.section : ""),
                    majorGroup: obj.majorGroup,
                    bureau_authority: (obj.bureau ? obj.bureau + " " : "") + (obj.authority ? obj.authority : ""),
                    customer: obj.customer ? obj.customer : "",
                    carloads: obj.carloadsRY ? obj.carloadsRY : 0,
                    revenue: obj.nsRevenueRY ? obj.nsRevenueRY : 0,
                    expDt: obj.expDt,
                    effDt: obj.effDt,
                    countdown: obj.expDt ? Math.floor((new Date(obj.expDt).getTime() - today.getTime()) / (1000 * 60 * 60 * 24) + 1) : 0,
                    totalContribution: obj.contributionRY ? obj.contributionRY : 0,
                    numberOfSections: obj.sections,
                    lanes: obj.lanes ? obj.lanes : 0,
                    marketManager: obj.marketManager,
                })
            }) : [];

            this.setState({data: newData, loading: false});
        });
    }

    render() {
        return <div>
            <WBTable
                data={this.state.data}
                loading={this.state.loading}
                columns={[
                    {
                        Header: "Section #",
                        accessor: "section",
                    },

                    {
                        Header: "Customer",
                        accessor: "customer"
                    },
                    {
                        Header: "Manager",
                        accessor: "marketManager",
                        // filterMethod: (filter, row) =>
                        //     row[filter.id].toUpperCase().includes(filter.value.toUpperCase())
                    },
                    {
                        Header: "Effective Date",
                        accessor: "effDt",
                        filterable: false,
                        Cell: row => <Moment parse="YYYY-MM-DD" format="MM/DD/YYYY">
                            {row.value}
                        </Moment>
                    },
                    {
                        Header: "Carloads",
                        accessor: "carloads",
                        Cell: row => <NumberFormat value={row.value} displayType={"text"} thousandSeparator={true}/>
                    },
                    {
                        Header: "Revenue",
                        accessor: "revenue",
                        Cell: row => systemOfUnitsFormat(row.value)
                    },
                    {
                        Header: "Contribution",
                        accessor: "totalContribution",
                        Cell: row => systemOfUnitsFormat(row.value)
                    },
                    {
                        Header: "# Lanes",
                        accessor: "lanes",
                        filterable: false,
                        Cell: (row) => <NumberFormat value={row.value} displayType={"text"} thousandSeparator={true}/>
                    },
                ]}

                style={{
                    background: "#00A00010"
                }}
                minRows={0}
                showPagination={false}
                className="-striped -highlight"
            />
        </div>
    }

}

export default withRouter(SectionsTable)