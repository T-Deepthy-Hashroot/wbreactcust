import React from "react";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ListSubheader from '@material-ui/core/ListSubheader';

import {AUTHORITY_RENEWAL_FIELD_OPTIONS_API} from 'nsglobals/api_end_points';
import {doAxiosGet} from 'nsglobals/axios_helper';

import {green, orange, red, purple} from "@material-ui/core/colors"
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';


// button themes used for different status types
const renewTheme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    overrides: {
        // Name of the component ⚛️ / style sheet
        MuiMenuItem: {
            // Name of the rule
            root: {
                color: red[500],
            }
        },
    }
});

const inProgressTheme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    overrides: {
        // Name of the component ⚛️ / style sheet
        MuiMenuItem: {
            // Name of the rule
            root: {
                color: orange[500],
            }
        },
    }
});

const notRenewingTheme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    overrides: {
        // Name of the component ⚛️ / style sheet
        MuiMenuItem: {
            // Name of the rule
            root: {
                color: purple[500],
            }
        },
    }
});

const publishedTheme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    overrides: {
        // Name of the component ⚛️ / style sheet
        MuiMenuItem: {
            // Name of the rule
            root: {
                color: green[500],
            }
        },
    }
});


class StatusContextMenu extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            statusList: null,
            statusMenuItems: null,
            row: null
        }

        this.buildMenu = this.buildMenu.bind(this);


    }


    componentDidMount()
    {
        const api = AUTHORITY_RENEWAL_FIELD_OPTIONS_API + "?fieldName=RequestStatus";
        doAxiosGet(api, (result) =>
        {
            this.setState({statusList: result});
        });
    }

    componentDidUpdate()
    {
        if (this.state.statusList && (this.props.row) && this.props.row !== this.state.row)
        {
            this.buildMenu();
        }
    }


    buildMenu()
    {
        const menuItems = this.state.statusList.map((obj, key) =>
            {
                // color theme for each of the menu items
                let theme = null;
                switch (obj.name)
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
                    <MuiThemeProvider key={key} theme={theme}>
                        <MenuItem key={obj.name}
                                  selected={obj.description === this.props.row.status.description}
                                  onClick={() =>
                                  {
                                      if (obj.description === this.props.row.status.description)
                                      {
                                          this.props.onClose();
                                      }
                                      else
                                      {
                                          this.props.onNewStatusSelected(this.props.row, obj);
                                      }
                                  }}
                        >
                            {obj.description}
                        </MenuItem>
                    </MuiThemeProvider>)
            }
        )

        this.setState({statusMenuItems: menuItems, row: this.props.row})
    }


    render()
    {
        let menuProps = {...this.props};
        delete menuProps.onNewStatusSelected;

        return (
            <div>
                <Menu {...menuProps} >
                    <MenuList subheader={<ListSubheader>Change Status</ListSubheader>}>
                        {this.state.statusMenuItems}
                    </MenuList>
                </Menu>
            </div>
        )
    }


}

export default StatusContextMenu;