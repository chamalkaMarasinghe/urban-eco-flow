import React from "react";
import ReactDOM from "react-dom/client";
import { APIProvider } from '@vis.gl/react-google-maps';
import { SocketProvider } from "./context/socket/socketContext";
import { CONFIGURATIONS } from "./config/envConfig";
import App from "./App";

// NOTE: IMPORT STYLES
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import 'antd/dist/reset.css';
import "./index.css";

// NOTE: IMPORT REDUX
import { Provider } from "react-redux";
import store from "./store";

// NOTE: IMPORT TOAST NOTIFICATIONS
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LocationProvider } from "./context/location/location";
import { LanguageProvider } from "./context/language/language";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <LanguageProvider>
        <APIProvider
            apiKey={CONFIGURATIONS.GOOGLE_MAPS_API_KEY}
            libraries={['places', 'geometry']} // Optional: preload extra libraries
        >
            <SocketProvider>
                <LocationProvider>
                    <Provider store={store}>
                        <App />
                        <ToastContainer autoClose={2000} position="bottom-left"/>
                    </Provider>
                </LocationProvider>
            </SocketProvider>
        </APIProvider>
    </LanguageProvider>
);
