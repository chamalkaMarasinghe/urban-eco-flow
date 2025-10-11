import heroImage from "../assets/images/smart-city-hero.jpg";
import weightedSensor from "../assets/images/weighted-sensor.jpg";
import volumeSensor from "../assets/images/volume-sensor.jpg";
import fillSensor from "../assets/images/fill-sensor.jpg";
import { getAllSensors, purchaseSensor } from "../store/thunks/sensor";
import { useThunk } from "../hooks/useThunk";
import showToast from "../utils/toastNotifications";
import { useEffect, useState } from "react";

const Sensors = () => {

    // Hero Section Component
    const HeroSection = () => {
        return (
            <section className="py-12 sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                            Smart Sensors
                        </h1>
                        <p className="text-lg sm:text-xl text-muted-foreground">
                            We provide three types of dustbin sensors
                        </p>
                    </div>
                    <div className="w-full max-w-5xl mx-auto rounded-lg overflow-hidden">
                        <img
                            src={heroImage}
                            alt="Smart city illustration with roads and buildings"
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </div>
            </section>
        );
    };

    // Product Card Component
    const ProductCard = ({ title, price, image, imageAlt, _id, purchseSensor }) => {
        return (
            <div className="bg-card rounded-lg shadow-md border-[1px] overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                    <h3 className="text-xl font-semibold text-card-foreground mb-2 text-center">
                        {title}
                    </h3>
                    <p className="text-2xl font-bold text-primary text-center mb-6">
                        ${price?.toFixed(2)}
                    </p>
                    <div className="bg-white rounded p-4 mb-6 flex items-center justify-center min-h-[200px]">
                        <img
                            src={image}
                            alt={imageAlt || title}
                            className="max-w-full h-auto object-contain max-h-[180px]"
                        />
                    </div>
                    <button 
                        className="w-full bg-primary text-white py-3 rounded font-semibold hover:opacity-90 transition-opacity"
                        onClick={() => {purchseSensor(_id)}}
                    >
                        BUY NOW
                    </button>
                </div>
            </div>
        );
    };

    // Products Section Component
    const ProductsSection = ({sensors, purchseSensor}) => {
        return (
            <section className="bg-background pb-12 sm:pb-16 lg:pb-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
                        {sensors?.map((product, index) => (
                            <ProductCard
                                key={index}
                                title={product?.serialNumber}
                                price={product?.purchasePrice}
                                image={product?.attachment}
                                imageAlt={product?.attachment}
                                _id={product?._id}
                                purchseSensor={purchseSensor}
                            />
                        ))}
                    </div>
                </div>
            </section>
        );
    };

    const [sensors, setSensors] = useState([]);

    const [doPurchaseSensor, isPurchaseSensor, errorPurchaseSensor] = useThunk(purchaseSensor);
    const [doGetAllSensors, isGetAllSensors, errorGetAllSensors] = useThunk(getAllSensors);

    useEffect(() => {
        getAllSensorsMethod();
    }, [])

    const getAllSensorsMethod = async() => {
        const res = await doGetAllSensors();
        if(res?.success){
            setSensors(res?.response?.data?.docs);
        }else{
            showToast("error", res?.error?.message || "Error Occurred");
        }
    }

    const purchseSensor = async(id) => {
        const res = await doPurchaseSensor({id});
        if(res?.success){
            showToast("success", "Sensor Purchased Successfully");
        }else{
            showToast("error", res?.error?.message || "Error occurred during purchasing a sensor");
        }
    }    

    // Main Page Layout
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <HeroSection />
            <ProductsSection sensors={sensors} purchseSensor={purchseSensor}/>
        </div>
    );
};

export default Sensors;
