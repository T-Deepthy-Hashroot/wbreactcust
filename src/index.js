
import 'babel-polyfill';
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";

import indexRoutes from "nsroutes/index.jsx";

import "assets/scss/material-dashboard-pro-react.css?v=1.1.0";

const hist = createBrowserHistory();

ReactDOM.render(
    (<Router history={hist}>
    <Switch>
      {indexRoutes.map((prop, key) => {
        return <Route path={prop.path} component={prop.component} key={key} />;
      })}
    </Switch>
  </Router>),
  document.getElementById("root")
);
