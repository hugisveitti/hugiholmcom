import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import ImageComponent from "./ImageCompontent";
import { config } from "../config";
import MapComponent from "./MapComponent";

const ENDPOINT = config.ENDPOINT;
const FrontPage = () => {
  const [socket, setSocket] = useState(undefined);
  console.log("config", config);
  useEffect(() => {
    const newSocket = socketIOClient.connect(ENDPOINT);
    setSocket(newSocket);
    newSocket.on("connectedToRoomCallBack", (data) => {
      console.log("callback", data);
    });
  }, []);

  return (
    <div>
      <h2>Frontpage</h2>
      <ImageComponent socket={socket} />
      <MapComponent socket={socket} />
    </div>
  );
};

export default FrontPage;
