// src/context/SocketContext.js
import { createContext, useContext, useEffect } from "react";
import socket from "../../config/socket";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    useEffect(() => {
        // Set auth dynamically before connecting
        socket.auth = { token: localStorage.getItem("token") };
        socket.connect();

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
