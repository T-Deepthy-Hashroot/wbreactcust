import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";
import {Redirect, Route, Switch, withRouter} from "react-router-dom";

// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// material-ui components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import Header from "nscomponents/Header/Header.jsx";
import Footer from "nscomponents/Footer/Footer.jsx";
import Sidebar from "nscomponents/MainSidebar/Sidebar.jsx";

import mainMenuRoutes from "nsroutes/mainMenuRoutes.jsx";

import appStyle from "nslayouts/mainLayoutStyle.jsx";


import image from "nsassets/img/wbTrain.jpg";
import logo from "nsassets/img/wbLogo.png";
import {registerAlertCallback} from "../nsglobals/alerts";
import {isLoggedIn, setLogin, setMajorGroup} from "../nsglobals/user";
import qs from "query-string";
import {SSO_LOGIN_PATH} from "../nsglobals/api_end_points";
import Log from "nsglobals/Log";


let ps;

const switchRoutes= (
    <Switch>
        {
            mainMenuRoutes.map((prop, key) => {
                if (prop.redirect)
                    return <Redirect
                        from={prop.path}
                        to={prop.pathTo}
                        key={key}/>;
                if (prop.collapse)
                    return prop.views.map((prop, key) => {
                        return (
                            <Route
                                path={prop.path}
                                component={prop.component}
                                key={key}/>);
                    });
                return ( <Route
                    path={prop.path}
                    component={prop.component}
                    key={key}/>)
            })}
    </Switch>

);


class MainLayout extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            mobileOpen: false,
            miniActive: false,
            alert: null,
            loggedIn: false,
        }

        this.showAlert = this.showAlert.bind(this);
    }


    handleDrawerToggle = () => {
        this.setState({mobileOpen: !this.state.mobileOpen});
    };


    componentWillMount() {
        if (!isLoggedIn()) {
            let racf = qs.parse(this.props.location.search, {ignoreQueryPrefix: true}).RACF;
            let majorGroup = qs.parse(this.props.location.search, {ignoreQueryPrefix: true}).MajorGroup;
            let deskCode = qs.parse(this.props.location.search, {ignoreQueryPrefix: true}).DeskCode;

            Log.info( "RACF=" + racf + ", MajorGroup=" + majorGroup +", DeskCode=" + deskCode, 'MainLayout.jsx:componentWillMount()' );

            if (racf) {
                setLogin(racf);
                setMajorGroup( majorGroup );

                if (isLoggedIn()) {
                    this.setState({loggedIn: true});

                    this.props.history.push( this.props.location.pathname )
                }
            }
        }
    }

    componentDidMount() {
        if (navigator.platform.indexOf("Win") > -1) {
            // eslint-disable-next-line
            ps = new PerfectScrollbar(this.refs.mainPanel, {
                suppressScrollX: true,
                suppressScrollY: false
            });
        }


        registerAlertCallback((alert) => {
            this.showAlert(alert);
        });



    }

    componentWillUnmount() {
        if (navigator.platform.indexOf("Win") > -1 && ps) {
            ps.destroy();
        }
    }

    componentDidUpdate(e) {
        if (e.history.location.pathname !== e.location.pathname) {
            this.refs.mainPanel.scrollTop = 0;
        }
    }

    sidebarMinimize() {
        this.setState({miniActive: !this.state.miniActive});
    }

    showAlert(overlay) {
        this.setState({alert: overlay.alert});
    }

    render() {
        const {classes, ...rest} = this.props;
        const mainPanel =
            classes.mainPanel +
            " " +
            cx({
                [classes.mainPanelSidebarMini]: this.state.miniActive,
                [classes.mainPanelWithPerfectScrollbar]:
                navigator.platform.indexOf("Win") > -1
            });
			
                console.log( "window.location" + window.location );
                console.log( "window.location.href" + window.location.href );
				
            if ( !this.state.loggedIn)
            {
                console.log( "window.location" + window.location );
                console.log( "window.location.href" + window.location.href );
                window.location =  window.location + "?RACF=A6POC&MajorGroup=Chemicals&DeskCode="; //SSO_LOGIN_PATH +'?_return-path_=' + window.location.href;
                return (<div></div>);
            }



            return (
                <div className={classes.wrapper}>
                    {this.state.alert}
                    <Sidebar
                        routes={mainMenuRoutes}
                        logoText={"Workbench"}
                        logo={logo}
                        image={image}
                        handleDrawerToggle={this.handleDrawerToggle}
                        open={this.state.mobileOpen}
                        color="selectedItem"
                        bgColor="black"
                        miniActive={this.state.miniActive}
                        {...rest}
                    />
                    <div className={mainPanel} ref="mainPanel">
                        <Header
                            sidebarMinimize={this.sidebarMinimize.bind(this)}
                            miniActive={this.state.miniActive}
                            routes={mainMenuRoutes}
                            handleDrawerToggle={this.handleDrawerToggle}
                            {...rest}
                        />
                        <div className={classes.content}>
                            <div className={classes.container}>{switchRoutes}</div>
                        </div>
                        <Footer fluid/>
                    </div>
                </div>
            );
        }

}

MainLayout.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(appStyle)(MainLayout));
