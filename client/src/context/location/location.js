import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
    const [currentLocation, setCurrentLocation] = useState({
        savedLocationEnabled: localStorage.getItem("kidsplan_location_enabled")?.toString() === "true",  
        longitude: parseFloat(localStorage.getItem("longitude")) || 1,
        latitude: parseFloat(localStorage.getItem("latitude")) || 1,
        isLoading: localStorage.getItem("kidsplan_location_enabled")?.toString() === "true" ? false : true,
    });

    const setLocationDisabled = () => {
        setCurrentLocation((prev) => ({ ...prev, isLoading: false }));
        localStorage.setItem("kidsplan_location_enabled", "false");
        localStorage.removeItem("latitude");
        localStorage.removeItem("longitude");
    };

    const getLocation = useCallback(() => {        
        return new Promise((resolve, reject) => {
            if ("geolocation" in navigator) {
                setCurrentLocation((prev) => ({ ...prev, isLoading: true }));

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        const newLocation = {
                            savedLocationEnabled: true,  
                            latitude,
                            longitude,
                            isLoading: false,
                        };
                        setCurrentLocation(newLocation);
                        localStorage.setItem(
                            "kidsplan_location_enabled",
                            "true"
                        );
                        localStorage.setItem("latitude", latitude || 1);
                        localStorage.setItem("longitude", longitude || 1);
                        resolve({ latitude, longitude });
                    },
                    (error) => {
                        setLocationDisabled();
                        reject(error);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0,
                    }
                );
            } else {
                setLocationDisabled();
                reject(
                    new Error("Geolocation is not supported by your browser.")
                );
            }
        });
    }, []);

    // NOTE:  Initial fetch
    useEffect(() => {        
        if(!currentLocation?.savedLocationEnabled){            
            getLocation().catch(() => {});
        }
    }, [getLocation]);

    // NOTE: Listen to permission changes
    useEffect(() => {
        if (navigator.permissions) {
            navigator.permissions
                .query({ name: "geolocation" })
                .then((permissionStatus) => {
                    const handleChange = () => {
                        if (permissionStatus.state !== "granted") {
                            setLocationDisabled();
                        }
                    };
                    permissionStatus.onchange = handleChange;
                })
                .catch(() => {});
        }
    }, []);

    return (
        <LocationContext.Provider value={{ ...currentLocation, getLocation }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useCurrentLocation = () => useContext(LocationContext);