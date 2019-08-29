import React from "react";
// material-ui components
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import { Tabs, Tab, FormControl, Select, MenuItem } from "@material-ui/core";

import AuthorityRenewalTrackerTable from "nscomponents/AuthorityRenewalTracker/AuthorityRenewalTrackerTable";

import SubdirectoryArrowLeft from "@material-ui/icons/SubdirectoryArrowLeft";
import SubdirectoryArrowRight from "@material-ui/icons/SubdirectoryArrowRight";
import Done from "@material-ui/icons/DoneAll";
import FormatLineSpacing from "@material-ui/icons/FormatLineSpacing";

import cardStyle from "nsassets/jss/ns/NSCardWithButtonsStyle";
import {
    TRACKER_FILTER,
    trackerFilterChanged,
    getMajorGroupOptions,
    getSelectedMajorGroup
} from "nsglobals/authority_renewal_manager";
import { setSelectedMajorGroup } from "../../nsglobals/authority_renewal_manager";
import Switch from "react-switch";


class AuthorityRenwalTrackerCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            filterValue: 0,
            majorGroup: "",
            majorGroupMenuItems: [],
            toggle: false,
            switchDisable: true,
            showSwitch: false
        }

        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleMajorGroupChange = this.handleMajorGroupChange.bind(this);
    }

    componentDidMount() {

        getMajorGroupOptions((majorGroupOptions) => {
            let menuItems = majorGroupOptions.map((obj, key) => {
                return (
                    <MenuItem key={key} value={obj.name}>
                        {obj.description}
                    </MenuItem>
                )
            });

            menuItems.push((<MenuItem key='?' value="?">No Major Group</MenuItem>));

            this.setState({ majorGroup: getSelectedMajorGroup(), majorGroupMenuItems: menuItems });

		});
		
		console.log('Major Group is: ' + getSelectedMajorGroup());

        if (getSelectedMajorGroup() === 'Chemicals') {
            this.setState({ switchDisable : false });
            this.setState({ showSwitch: true });
        }

    }

    handleFilterChange(event, value) {
        this.setState({ filterValue: value });
        trackerFilterChanged(value);
    }

    handleMajorGroupChange(event) {
        setSelectedMajorGroup(event.target.value);
        this.setState({ majorGroup: event.target.value });

        if(event.target.value === 'Chemicals') {
            this.setState({ switchDisable : false });
            this.setState({ showSwitch: true });
        } else {
            this.setState({ switchDisable : true });
            this.setState({ showSwitch: false });
            this.setState({ toggle : false });
        }
    }

    handleChange (event,value) {
        this.setState({ toggle: event});
    };

    render() {
        const { classes } = this.props;
        const tabs = [
            {
                tabName: TRACKER_FILTER.UPCOMING,
                tabIcon: SubdirectoryArrowRight,
            },
            {
                tabName: TRACKER_FILTER.EXPIRED,
                tabIcon: SubdirectoryArrowLeft,
            },
            {
                tabName: TRACKER_FILTER.COMPLETED,
                tabIcon: Done,
            },
            {
                tabName: TRACKER_FILTER.ALL,
                tabIcon: FormatLineSpacing,
            }
        ];
        const cardTitle = classes.cardTitle;

        const tabsContainer = classes.tabsContainer;

        const tabWrapper = classes.tabWrapper;
        const tabIcon = classes.tabIcon;
        const labelIcon = classes.labelIcon;

        return (
            <Card>
                <CardHeader
                    color={"success"}>
                    <div>
                        <div className={cardTitle}>Authority Renewal Tracker</div>
                        <Tabs
                            classes={{
                                flexContainer: tabsContainer,
                                indicator: classes.displayNone
                            }}
                            value={this.state.filterValue}
                            onChange={this.handleFilterChange}
                            textColor="inherit"
                        >
                            {tabs.map((prop, key) => {
                                return (
                                    <Tab
                                        key={key}
                                        classes={{
                                            wrapper: tabWrapper,
                                            labelIcon: labelIcon,
                                            label: classes.label,
                                            selected: classes.tabSelected,
                                            root: classes.tabRootButton,

                                        }}
                                        icon={<prop.tabIcon className={tabIcon} />}
                                        label={prop.tabName}
                                    />
                                );
                            })}

                            <FormControl style={{ minWidth: "150px" }}>
                                <Select
                                    style={{ color: "#FFF" }}
                                    value={this.state.majorGroup}
                                    onChange={this.handleMajorGroupChange}
                                    inputProps={{
                                        name: 'majorGroup',
                                        id: 'description',
                                    }}
                                >
                                    {this.state.majorGroupMenuItems}
                                </Select>
                            </FormControl>
                            <div style={{ display: this.state.showSwitch ? "block" : "none" }}>
                                <FormControl style={{ marginLeft: 10, alignItems: "center" }}>
                                    <div style={{ marginRight: 10, alignItems: 'center', display: 'flex', alignContent: 'space-between' }}>
                                        QESP
                                        <div style={{ marginLeft: 8, alignItems: "center" }}>
                                            <Switch disabled={this.state.switchDisable} onChange={(e) => this.handleChange(e)} checked={this.state.toggle} />
                                        </div>

                                    </div>
                                </FormControl>
                            </div>
                        </Tabs>

                    </div>


                </CardHeader>
                <CardBody>
                    <AuthorityRenewalTrackerTable
                        defaultPageSize={this.props.defaultPageSize ? this.props.defaultPageSize : 5}
                        majorGroup={this.state.majorGroup}
                        toggleSwitch={this.state.toggle}
                    />
                </CardBody>

            </Card>

        );
    }
}


export default withStyles(cardStyle)(AuthorityRenwalTrackerCard);
