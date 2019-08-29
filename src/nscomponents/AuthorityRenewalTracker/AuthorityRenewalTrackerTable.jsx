import React from "react";
import WBTable from "nscomponents/Tables/WBTable";
import Moment from "react-moment";
import NumberFormat from "react-number-format";

import SectionsTable from "./SectionsTable";
import {systemOfUnitsFormat} from "nsglobals/helperfunctions";
import {AUTHORITY_SET_REQUEST_STATUS_API} from "nsglobals/api_end_points";
import {doAxiosGet} from "nsglobals/axios_helper";
import FormDialog from "nscomponents/SubmitModal/SubmitModal";
import Button from "@material-ui/core/Button";

import {green, orange, red, purple} from "@material-ui/core/colors"
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import {
    findAuthorityRenewalRequest,
    getAuthorityRenewalRequest,
    registerTrackerFilterChangeListener,
    getSelectedMajorGroup,
    getAuthorityRenewals
} from "nsglobals/authority_renewal_manager";
import {withRouter} from "react-router-dom";

import SweetAlert from "react-bootstrap-sweetalert";
import sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx";
import withStyles from "@material-ui/core/styles/withStyles";

import StatusContextMenu from './StatusContextMenu';
import { setJsonHolder, getJsonHolder } from '../../nsglobals/tempjsonholder';

import Log from 'nsglobals/Log';
import {FIND_AUTHORITY_RENEWAL_REQUEST_API} from "../../nsglobals/api_end_points";


// base theme config for the buttons that will appear in the table
const baseButtonTheme = {
    typography: {
        useNextVariants: true,
        fontSize: 10,
    },
    overrides: {
        // Name of the component ⚛︝ / style sheet
        MuiButton: {
            // Name of the rule
            root: {
                // Some CSS
                height: 20,
                minHeight: 20,
                padding: '0px 10px 0px 10px',
            },
        },
    },

}

// button themes used for different status types
const renewTheme = createMuiTheme({
    ...baseButtonTheme,
    palette: {
        primary: red,
    },
});

const inProgressTheme = createMuiTheme({
    ...baseButtonTheme,
    palette: {
        primary: orange,
    }
});

const notRenewingTheme = createMuiTheme({
    ...baseButtonTheme,
    palette: {
        primary: purple,
    },
});

const publishedTheme = createMuiTheme({
    ...baseButtonTheme,
    palette: {
        primary: green,
    },
});


// import Close from "@material-ui/icons/Close";

class AuthorityRenewalTrackerTable extends React.Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            data: [],
            loading: true,
            expanded: {},
            showDialog: false,
            promptForStartDate: null,
            statusContextMenu: null,
            statusContextMenuRow: null,
            selected: null,
            selectedRows: [],
            checked: [],
            selectAll: false,
            showColumn : false,
			showComponent: false,
            filterChosen: 0,
			pageSize: -1
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSingleCheckboxChange = this.handleSingleCheckboxChange.bind(this);
        this.renderEditable = this.renderEditable.bind(this);
        this.showFutureOnly = this.showFutureOnly.bind(this);
        this.showExpiredOnly = this.showExpiredOnly.bind(this);
        this.showCompletedOnly = this.showCompletedOnly.bind(this);
        this.showAll = this.showAll.bind(this);
        this.promptForStartDate = this.promptForStartDate.bind(this);
        this.hidePromptForStartDate = this.hidePromptForStartDate.bind(this);
        this.loadAuthorityRenewal = this.loadAuthorityRenewal.bind(this);
        this.createStatusButton = this.createStatusButton.bind(this);
        this.handleContextMenuClose = this.handleContextMenuClose.bind(this);
        this.handleStatusChange = this.handleStatusChange.bind(this);

        registerTrackerFilterChangeListener((filter) =>
        {
			this.filterChosen = filter;
            if (filter === 0)
            {
                this.showFutureOnly();
            }
            else if (filter === 1)
            {
                this.showExpiredOnly();
            }
            else if (filter === 2)
            {
                this.showCompletedOnly();
            }
            else if (filter === 3)
            {
                this.showAll();
            }
        });

        this.lastFilter = this.showFutureOnly;

		this.newData = {};
		this.lastMajorGroup = null;
		
		window.authRenewTrackTableComponent = this;
    }

    componentDidMount()
    {
        getAuthorityRenewals((authorityRenewals) =>
        {
            this.newData = authorityRenewals;
			this.lastMajorGroup = getSelectedMajorGroup();
			setJsonHolder(authorityRenewals)
            this.showFutureOnly();
        }, true);

    }

	/*
	 * RefreshTheTableWithNSSMFilter should be called when QESP toggle is turned on
	*/
    refreshTheTableWithNSSMFilter(){

	   //this.setState({ switchDisable : true });
	   this.setState({loading: true});
	   this.setState({checked : [] });

	   this.setState({data: []});

		if(!this.filterChosen || (this.filterChosen && this.filterChosen === 0)) {
			getAuthorityRenewals((authorityRenewals) =>
			{
				this.newData = authorityRenewals;
				this.lastMajorGroup = getSelectedMajorGroup();
				setJsonHolder(authorityRenewals)
				this.showFutureOnlyNSSM(this.props);
			}, true);
		}
		
		if(this.filterChosen && this.filterChosen === 1) {
			getAuthorityRenewals((authorityRenewals) =>
			{
				this.newData = authorityRenewals;
				this.lastMajorGroup = getSelectedMajorGroup();
				setJsonHolder(authorityRenewals)
				this.showExpiredOnlyNSSM(this.props);
			}, true);
		}
		
		if(this.filterChosen && this.filterChosen === 2) {
			getAuthorityRenewals((authorityRenewals) =>
			{
				this.newData = authorityRenewals;
				this.lastMajorGroup = getSelectedMajorGroup();
				setJsonHolder(authorityRenewals)
				this.showCompletedOnlyNSSM(this.props);
			}, true);
		}
		
		if(this.filterChosen && this.filterChosen === 3) {
			getAuthorityRenewals((authorityRenewals) =>
			{
				this.newData = authorityRenewals;
				this.lastMajorGroup = getSelectedMajorGroup();
				setJsonHolder(authorityRenewals)
				this.showAllNSSM(this.props);
			}, true);
		}
		
    }

    componentWillReceiveProps (newProps) {

		if(!this.filterChosen || (this.filterChosen && this.filterChosen === 0)) {
			this.showFutureOnlyNSSM(newProps);
		}

		if(this.filterChosen && this.filterChosen === 1 && newProps.toggleSwitch) {
			this.showExpiredOnlyNSSM(newProps);
		}

		if(this.filterChosen && this.filterChosen === 1 && !newProps.toggleSwitch) {
			this.showExpiredOnly();
		}

		if(this.filterChosen && this.filterChosen === 2 && newProps.toggleSwitch) {
			this.showCompletedOnlyNSSM(newProps);
		}

		if(this.filterChosen && this.filterChosen === 2 && !newProps.toggleSwitch) {
			this.showCompletedOnly();
		}

		if(this.filterChosen && this.filterChosen === 3 && newProps.toggleSwitch) {
			this.showAllNSSM(newProps);
		}

		if(this.filterChosen && this.filterChosen === 3 && !newProps.toggleSwitch) {
			this.showAll();
		}

		if(newProps.toggleSwitch === false) {
            this.setState({checked : [] });
		}
		
	}

    componentDidUpdate()
    {
        if (this.props.majorGroup && this.lastMajorGroup && this.props.majorGroup !== this.lastMajorGroup)
        {
            this.lastMajorGroup = this.props.majorGroup;
            this.setState({loading: true});
            getAuthorityRenewals((authorityRenewals) =>
            {
                this.newData = authorityRenewals;
                this.lastFilter();
				setJsonHolder(authorityRenewals)
            }, true);
        }

    }

    // This is a great example of how to override a components default theme using MuiThemeProvider
    createStatusButton(status, onClick)
    {

        let theme = null;
        switch (status.name)
        {
            case "Renew" :
                theme = renewTheme;
                break;

            case "RenewViewed":
                theme = renewTheme;
                break;

            case "InProgress" :
                theme = inProgressTheme;
                break;

            case "NotRenewing" :
                theme = notRenewingTheme;
                break;

            case "Published" :
                theme = publishedTheme;
                break;

            default :
                theme = renewTheme;
                break;
        }

        return (
            <MuiThemeProvider theme={theme}>
                <Button color="primary" onClick={onClick}>
                    {status.description}
                </Button>
            </MuiThemeProvider>
        );
	}
	
    showFutureOnlyNSSM(newProps)
    {
		const futureOnly = [];
		const today = new Date();

		if(newProps.toggleSwitch === true && getJsonHolder() !== null) {

			getJsonHolder().forEach((row) =>
			{
				if (new Date(row.expDt) >= today && row.status.name !== 'NotRenewing' && row.status.name !== 'Published' && row.bureau.startsWith("NSSM"))
				{
                    delete row["percentIncrease"];
					futureOnly.push(row);
				}
			});

			this.lastFilter = this.showFutureOnly;
            this.setState({data: futureOnly, loading: false});
		}

		if(newProps.toggleSwitch === false && getJsonHolder() !== null) {

			getJsonHolder().forEach((row) =>
			{
				if (new Date(row.expDt) >= today && row.status.name !== 'NotRenewing' && row.status.name !== 'Published')
				{
                    delete row["percentIncrease"];
                    futureOnly.push(row);
				}
			});

			this.lastFilter = this.showFutureOnly;
			this.setState({data: futureOnly, loading: false});
		}

    }


    showFutureOnly()
    {
        const futureOnly = [];
        const today = new Date();

        this.newData.forEach((row) =>
        {
            if (new Date(row.expDt) >= today && row.status.name !== 'NotRenewing' && row.status.name !== 'Published')
            {
                futureOnly.push(row);
            }
		});

        this.lastFilter = this.showFutureOnly;
        this.setState({data: futureOnly, loading: false});
    }


    showExpiredOnly()
    {
        const expiredOnly = [];
        const today = new Date();

        this.newData.forEach((row) =>
        {
            if (new Date(row.expDt) < today && row.status.name !== 'Published')
            {
                expiredOnly.push(row);
            }
        });

        this.lastFilter = this.showExpiredOnly;
        this.setState({data: expiredOnly, loading: false});
    }

    showExpiredOnlyNSSM(newProps)
    {
        const expiredOnly = [];
        const today = new Date();

		if(getJsonHolder() !== null) {

			getJsonHolder().forEach((row) =>
			{
				if (new Date(row.expDt) < today && row.status.name !== 'Published' && row.bureau.startsWith("NSSM"))
				{
					expiredOnly.push(row);
				}
			});

			this.lastFilter = this.showExpiredOnly;
			this.setState({data: expiredOnly, loading: false});
		}
    }

    showCompletedOnly()
    {

        const completedOnly = [];
		const today = new Date();

		if(getJsonHolder() !== null) {

			getJsonHolder().forEach((row) =>
			{
				if (row.status.name === "Published" || (row.status.name === "NotRenewing" && new Date(row.expDt) >= today))
				{
					completedOnly.push(row);
				}
			});

			this.lastFilter = this.showCompletedOnly;
			this.setState({data: completedOnly, loading: false});
		}
	}
	
	showCompletedOnlyNSSM(newProps) {
		
        const completedOnly = [];
		const today = new Date();

		if(newProps.toggleSwitch && getJsonHolder() !== null) {

			getJsonHolder().forEach((row) =>
			{
				if (row.status.name === "Published" || (row.status.name === "NotRenewing" && new Date(row.expDt) >= today))
				{
					if(row.bureau.startsWith("NSSM")) {
						completedOnly.push(row);
					}
				}
			});

			this.lastFilter = this.showCompletedOnly;
			this.setState({data: completedOnly, loading: false});
		}
	}

    showAll()
    {
        this.lastFilter = this.showAll;
        this.setState({data: this.newData, loading: false});

    }

    showAllNSSM(newProps)
    {
        const showAllData = [];
		if(newProps.toggleSwitch && getJsonHolder() !== null) {

			getJsonHolder().forEach((row) =>
			{
				if(row.bureau.startsWith("NSSM")) {
					showAllData.push(row);
				}
			});

			this.lastFilter = this.showAll;
			this.setState({data: showAllData, loading: false});
		}

    }


    loadAuthorityRenewal(row)
    {
        if (!row.requestID)
        {
            let defaultDate = new Date(row.expDt);
            defaultDate.setFullYear(defaultDate.getFullYear() - 1);
            defaultDate.setDate(defaultDate.getDate() + 1);

            defaultDate = defaultDate.toISOString().split('T')[0];
            this.promptForStartDate(defaultDate, (value) =>
            {
                this.hidePromptForStartDate();
                findAuthorityRenewalRequest(row.bureau, row.authority, row.expDt, value, this.props.history);
            });
        }
        else if (row.requestID)
        {
            getAuthorityRenewalRequest(row.requestID, this.props.history);
        }


    }

    promptForStartDate(defaultDate, onConfirm)
    {
        this.setState({
            promptForStartDate: (
                <SweetAlert
                    input
                    inputType="date"
                    defaultValue={defaultDate}
                    showCancel
                    style={{display: "block", marginTop: "-100px"}}
                    title="Start Date for Statistics"
                    onConfirm={onConfirm}
                    onCancel={() => this.hidePromptForStartDate()}
                    confirmBtnCssClass={
                        this.props.classes.button + " " + this.props.classes.success
                    }
                    cancelBtnCssClass={
                        this.props.classes.button + " " + this.props.classes.gray
                    }
                />
            )
        });
    }

    hidePromptForStartDate()
    {
        this.setState({promptForStartDate: null});
    }


    handleContextMenuClose()
    {
        this.setState({statusContextMenu: null, statusContextMenuRow: null});
    }

    handleStatusChange(row, newStatus)
    {
        Log.info(row.status.description + " is changing to " + newStatus.description, 'AuthorityRenewalTrackerTable.jsx:handleStatusChange()');

        if ( row.requestID )
        {
            const params = "?requestID=" + row.requestID + "&requestStatus=" + newStatus.name;
            const api = AUTHORITY_SET_REQUEST_STATUS_API + params;

            doAxiosGet(api, () =>
            {
                let revisedData = [];
                this.newData.forEach((oldRow) =>
                {
                    if (row.requestID === oldRow.requestID)
                    {
                        let newRow = {...oldRow, status: newStatus};
                        revisedData.push(newRow);
                    }
                    else
                    {
                        revisedData.push(oldRow);
                    }
                });

                this.newData = revisedData;
                this.lastFilter();

                this.handleContextMenuClose();
            });
        }
        else
        {
            // no request id so we need to create a request then change it's status
            const bureauParameter = "bureau=" + row.bureau;
            const authorityParameter = "authority=" + row.authority;
            const expDtParameter = "originalExpDt=" + row.expDt;
            const statsEffDtParameter = "statsEffDt=" + row.expDt;  //
            const createLanesParameter = 'createLanes=false';  // don't create any lanes for this request


            let request = FIND_AUTHORITY_RENEWAL_REQUEST_API + "?" + bureauParameter + "&" + authorityParameter + "&" + expDtParameter  + "&" + statsEffDtParameter + "&" + createLanesParameter;
            doAxiosGet(request, (result) =>
            {
                row.requestID = result.requestID;

                const params = "?requestID=" + row.requestID + "&requestStatus=" + newStatus.name;
                const api = AUTHORITY_SET_REQUEST_STATUS_API + params;

                doAxiosGet(api, () =>
                {
                    let revisedData = [];
                    this.newData.forEach((oldRow) =>
                    {
                        if (row.requestID === oldRow.requestID)
                        {
                            let newRow = {...oldRow, status: newStatus};
                            revisedData.push(newRow);
                        }
                        else
                        {
                            revisedData.push(oldRow);
                        }
                    });

                    this.newData = revisedData;
                    this.lastFilter();

                    this.handleContextMenuClose();
                });



            });

        }

    }

    handleChange = () => {
        let tempPageSize = '';
        let size = this.state.pageSize;
        //console.log(size);
        if(this.props.defaultPageSize && this.state.pageSize === -1) {
            this.setState({ pageSize : this.props.defaultPageSize});
            tempPageSize = this.props.defaultPageSize;

        }
        var selectAll = !this.state.selectAll;
        this.setState({ selectAll: selectAll });
        var checkedCopy = [];
        this.state.data.forEach(function(e, index) {
            if((index < tempPageSize) && (size !== 0) ) {
                checkedCopy.push(selectAll);
            }
            else if( size === 0) {
                checkedCopy.push(selectAll);
            }
        });
        this.setState({
          checked: checkedCopy
        });
        this.setState({ pageSize : 0 });
      };
    
      handleSingleCheckboxChange = index => {
        
        var checkedCopy = this.state.checked;
        checkedCopy[index] = !this.state.checked[index];
        if (checkedCopy[index] === false) {
          this.setState({ selectAll: false });
        }
    
        this.setState({
          checked: checkedCopy
        });
      };

      // appending another column with custom data value
      handleInputChange = (cellInfo, event) => {
        let data = [...this.state.data];
        data[cellInfo.index][cellInfo.column.id] = event.target.value;
    
        this.setState({ data });
      };

      renderEditable = cellInfo => {
		let cellValue = this.state.data[cellInfo.index][cellInfo.column.id];
    
        return (
          <input
            name="input"
            type="number"
            onChange={this.handleInputChange.bind(null, cellInfo)}
            value={cellValue}
            style={{width: "100px"}}
          />
        );
      };

    render()
    {


        return <div>
            <div style={{textAlign:"right"}}>
                {this.props.toggleSwitch ?
                    <FormDialog rowsChecked={this.state.checked} editedData={(this.state.data).slice(0, this.state.checked.length)} /> :
                    null
                }
            </div>
            {this.state.promptForStartDate}

            <StatusContextMenu
                id="simple-menu"
                anchorEl={this.state.statusContextMenu}
                open={Boolean(this.state.statusContextMenu)}
                onClose={this.handleContextMenuClose}
                row={this.state.statusContextMenuRow}
                onNewStatusSelected={this.handleStatusChange}
            />

            <WBTable
                data={this.state.data}
                loading={this.state.loading}
                filterable={true}
                expanded={this.state.expanded}
                onFilteredChange={() => this.setState({ checked : [] })}
                onExpandedChange={expanded => this.setState({expanded})}
                columns={[
                    {
                        Cell: row => (
                          <input
                            type="checkbox"
                            defaultChecked={this.state.checked[row.index]}
                            checked={this.state.checked[row.index]}
                            onChange={() => this.handleSingleCheckboxChange(row.index)}
                          />
                        ),
                        Header: (
                            <input
                              type="checkbox"
                              onChange={this.handleChange}
                              checked={this.state.selectAll}
                            />
                        ),
                        sortable: false,
                        filterable: false,
                        show: this.props.toggleSwitch, 
                        width: 35
                    },
                    {
                        Header : "Increase %",
                        accessor : "percentIncrease",
                        Cell: this.renderEditable,
                        sortable: false,
                        filterable: false,
                        show: this.props.toggleSwitch,
                        width: 120
                    },
                    {
                        Header: "Authority #",
                        accessor: "bureau_authority",
                        filterMethod: (filter, row) => 
                            row[filter.id].toUpperCase().includes(filter.value.toUpperCase())

                    },
                    {
                        Header: "Customer",
                        accessor: "customer",
                        filterMethod: (filter, row) =>
                            row[filter.id].toUpperCase().includes(filter.value.toUpperCase())
                    },
                    {
                        Header: "Manager",
                        accessor: "marketManager",
                        filterMethod: (filter, row) =>
                            row[filter.id].toUpperCase().includes(filter.value.toUpperCase())
                    },
                    {
                        Header: "Carloads",
                        accessor: "carloads",
                        filterable: false,
                        Cell: (row) => <NumberFormat value={row.value} displayType={"text"} thousandSeparator={true}/>
                    },
                    {
                        Header: "Revenue",
                        accessor: "revenue",
                        filterable: false,
                        Cell: (row) => systemOfUnitsFormat(row.value)
                    },
                    {
                        Header: "Contribution",
                        accessor: "totalContribution",
                        filterable: false,
                        Cell: (row) => systemOfUnitsFormat(row.value)
                    },
                    {
                        Header: "Exp Date",
                        accessor: "expDt",
                        filterable: false,
                        Cell: (row) => <Moment parse="YYYY-MM-DD" format="MM/DD/YYYY">
                            {row.value}
                        </Moment>
                    },
                    {
                        Header: "# Sections",
                        accessor: "numberOfSections",
                        filterable: false,
                        Cell: (row) => <NumberFormat value={row.value} displayType={"text"} thousandSeparator={true}/>
                    },
                    {
                        Header: "# Lanes",
                        accessor: "lanes",
                        filterable: false,
                        Cell: (row) => <NumberFormat value={row.value} displayType={"text"} thousandSeparator={true}/>
                    },
                    {
                        Header: "Countdown",
                        accessor: "countdown",
                        filterable: false,
                        Cell: (row) =>
                        {
                            let color = 'inherit';
                            let fontWeight = 'normal'

                            if (row.value < 6)
                            {
                                fontWeight = 'bold';
                            }

                            if (row.value < 0)
                            {
                                color = '#FF0000';
                                fontWeight = 'bold';
                            }

                            return <div style={{color: color, fontWeight: fontWeight}}> {row.value} days </div>
                        }
                    },
                    {
                        Header: "Status",
                        sortable: false,
                        filterable: false,
                        Cell: (row) => this.createStatusButton(row.original.status, () =>
                        {
                            this.loadAuthorityRenewal(row.original);
                        }),
                        width: 100,
                    }

                ]}
                SubComponent={(row) =>
                {
                    return (<div style={{padding: "20px"}}>
                        <SectionsTable
                            bureau={row.original.bureau}
                            authority={row.original.authority}
                            expDt={row.original.expDt}
                            majorGroup={getSelectedMajorGroup()}/></div>)
                }}
                defaultPageSize={this.props.defaultPageSize ? this.props.defaultPageSize : 5}
                showPaginationTop={false}
                showPaginationBottom
                className="-striped -highlight"
                getTdProps={(state, rowInfo, column, instance) =>
                {
                    return {
                        onDoubleClick: (e, handleOriginal) =>
                        {
                            this.loadAuthorityRenewal(rowInfo.original);
                        },
                        onContextMenu: (e, handleOriginal) =>
                        {
                            this.setState({
                                statusContextMenu: e.currentTarget,
                                statusContextMenuRow: rowInfo.original
                            });
                        }


                    };
                }}


            />

        </div>;

    }
}

// using withRouter adds the history property needed for navigation.
export default withStyles(sweetAlertStyle)(withRouter(AuthorityRenewalTrackerTable))
