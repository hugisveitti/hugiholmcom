import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import ImageComponent from "./ImageCompontent";
import { config } from "../config";

const ENDPOINT = config.ENDPOINT;
const FrontPage = () => {
  const [socket, setSocket] = useState(undefined);
  useEffect(() => {
    const newSocket = socketIOClient.connect(ENDPOINT);
    setSocket(newSocket);
    newSocket.on("connectedToRoomCallBack", (data) => {});
  }, []);

  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <h2>Map game</h2>
        <p>Still in development</p>
      </div>
      <ImageComponent socket={socket} />
    </div>
  );
};

export default FrontPage;
