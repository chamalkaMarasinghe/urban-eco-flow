import heroImage from "../assets/images/smart-city-hero.jpg";
import weightedSensor from "../assets/images/weighted-sensor.jpg";
import volumeSensor from "../assets/images/volume-sensor.jpg";
import fillSensor from "../assets/images/fill-sensor.jpg";
import { getAllCreatedBins, getAllPurchasedSensors, getAllSensors } from "../store/thunks/sensor";
import { useThunk } from "../hooks/useThunk";
import showToast from "../utils/toastNotifications";
import { useEffect, useState } from "react";
import { format_MM_DD_YYYY } from "../utils/dateFormating";

const Sensors = () => {

    // Hero Section Component
    const HeroSection = () => {
        return (
            <section className="py-12 sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                            My Bins
                        </h1>
                        <p className="text-lg sm:text-xl text-muted-foreground">
                            The list of created bins
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
    const ProductCard = ({ title, price, image, imageAlt, _id, purchseSensor, data }) => {
        return (
            <div className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                    <h3 className="text-xl font-semibold text-card-foreground mb-2 text-center">
                        {data?.binNumber}
                    </h3>
                    <p className="font-bold text-center mb-6">
                        {data?.material}
                    </p>
                    <p className=" text-center mb-6">
                        {data?.capacity}
                    </p>
                    <p className=" text-center">
                        {format_MM_DD_YYYY(data?.createdAt)}
                    </p>
                    {/* <div className="bg-white rounded p-4 mb-6 flex items-center justify-center min-h-[200px]">
                        <img
                            src={image}
                            alt={imageAlt || title}
                            className="max-w-full h-auto object-contain max-h-[180px]"
                        />
                    </div> */}
                    {/* <button 
                        className="w-full bg-primary text-white py-3 rounded font-semibold hover:opacity-90 transition-opacity"
                        onClick={() => {purchseSensor(_id)}}
                    >
                        BUY NOW
                    </button> */}
                </div>
            </div>
        );
    };

    // Products Section Component
    const ProductsSection = ({sensors, purchseSensor}) => {
        return (
            <section className="bg-background py-12 sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
                        {sensors?.map((product, index) => (
                            <ProductCard
                                key={index}
                                title={product?.serialNumber}
                                price={product?.purchasePrice}
                                image={product?.attachment}
                                imageAlt={product?.attachment}
                                data={product}
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

    const [doGetAllCreatedBins, isGetAllCreatedBins, errorGetAllCreatedBins] = useThunk(getAllCreatedBins);

    useEffect(() => {
        getAllSensorsMethod();
    }, [])

    const getAllSensorsMethod = async() => {
        const res = await doGetAllCreatedBins();
        console.log(res?.response?.data?.docs);
        
        if(res?.success){            
            setSensors(res?.response?.data?.docs || []);
        }else{
            showToast("error", res?.error?.message || "Error Occurred");
        }
    }

    const purchseSensor = async(id) => {
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
