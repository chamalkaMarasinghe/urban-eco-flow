// src/socket/socket.js
import { io } from "socket.io-client";
import { CONFIGURATIONS } from "./envConfig";

// Create the socket instance without connecting yet
const socket = io(CONFIGURATIONS.API_BASE_SOCKET_DOMAIN, {
  autoConnect: false,
});

export default socket;
