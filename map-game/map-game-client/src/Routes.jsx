import React from "react";
import { Route, Switch } from "react-router";
import FrontPage from "./components/FrontPage";

export const frontPagePath = "/";

const Routes = () => {
  return (
    <Switch>
      <Route to={frontPagePath} component={FrontPage} />
    </Switch>
  );
};

export default Routes;
