// src/context/SocketContext.js
import { createContext, useContext, useEffect, useState } from "react";
import config from "../../config/Static_content_Client";
import { LANGUAGE } from "../../constants/commonConstants";

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {

    const [language, setLanguage] = useState(localStorage.getItem("language") || LANGUAGE.ENGLISH.value);
    
    useEffect(() => {
        localStorage.setItem("language", language);
    }, [language]);

    return (
        <LanguageContext.Provider value={{language, setLanguage}}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
