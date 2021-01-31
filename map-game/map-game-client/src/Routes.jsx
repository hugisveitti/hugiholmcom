import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router";
import FrontPage from "./components/FrontPage";
import socketIOClient from "socket.io-client";
import ImageComponent from "./components/ImageCompontent";
import WaitingRoomComponent from "./components/WaitingRoomComponent";
import { config } from "./config";

const ENDPOINT = config.ENDPOINT;

export const frontPagePath = "/";
export const gamePagePath = "/game";
export const waitingPagePath = "/waitingroom";

const Routes = () => {
  const [socket, setSocket] = useState(undefined);
  useEffect(() => {
    const newSocket = socketIOClient.connect(ENDPOINT);
    setSocket(newSocket);
    newSocket.on("connectedToRoomCallBack", (data) => {});
  }, []);

  return (
    <Switch>
      <Route
        exact
        path={frontPagePath}
        render={(props) => <FrontPage {...props} socket={socket} />}
      />
      <Route
        path={gamePagePath}
        render={(props) => <ImageComponent {...props} socket={socket} />}
      />
      <Route
        path={waitingPagePath}
        render={(props) => <WaitingRoomComponent {...props} socket={socket} />}
      />
    </Switch>
  );
};

export default Routes;
