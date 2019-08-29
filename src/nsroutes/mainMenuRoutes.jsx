import Dashboard from "nsviews/Dashboard/Dashboard";
import AuthorityRenewal from "nsviews/AuthorityRenewal/AuthorityRenewal";


// @material-ui/icons
import DashboardIcon from "@material-ui/icons/Dashboard";
import AuthorityRenewalIcon from "@material-ui/icons/AttachMoney";


const mainMenuRoutes = [
    {path: "/workbench/dashboard", name: "Dashboard", icon: DashboardIcon, component: Dashboard},
    {path: "/workbench/authority_renewal", name: "Authority Renewal", icon: AuthorityRenewalIcon, component: AuthorityRenewal},
    {redirect: true, path: "/", pathTo: "/workbench/dashboard", name: "Dashboard"},
    {redirect: true, path: "/workbench/", pathTo: "/workbench/dashboard", name: "Dashboard"}
];
export default mainMenuRoutes;
