import heroImage from "../assets/images/smart-city-hero.jpg";
import weightedSensor from "../assets/images/weighted-sensor.jpg";
import volumeSensor from "../assets/images/volume-sensor.jpg";
import fillSensor from "../assets/images/fill-sensor.jpg";
import { attachSensorToBin, detachSensorToBin, getAllCreatedBins, getAllPurchasedSensors, getAllSensors } from "../store/thunks/sensor";
import { useThunk } from "../hooks/useThunk";
import showToast from "../utils/toastNotifications";
import { useEffect, useState } from "react";
import { format_MM_DD_YYYY } from "../utils/dateFormating";
import Button from "../components/Reusable/CustomButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/Reusable/Dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/Reusable/Select";

const Sensors = () => {
    const [sensors, setSensors] = useState([]);
    const [sensorsPurchased, setSensorsPurchased] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBinId, setSelectedBinId] = useState(null);
    const [selectedSensor, setSelectedSensor] = useState("");

    const [doGetAllCreatedBins, isGetAllCreatedBins, errorGetAllCreatedBins] = useThunk(getAllCreatedBins);
    const [doGetAllSensors, isGetAllSensors, errorGetAllSensors] = useThunk(getAllPurchasedSensors);
    const [doAttachSensor, isAttachSensor, errorAttachSensor] = useThunk(attachSensorToBin);
    const [doDetachSensor, isDetachSensor, errorDetachSensor] = useThunk(detachSensorToBin);

    useEffect(() => {
        getAllBinsMethod();
        getAllSensorsMethod();
    }, [])

    const getAllBinsMethod = async() => {
        const res = await doGetAllCreatedBins();
        console.log(res?.response?.data?.docs);
        
        if(res?.success){            
            setSensors(res?.response?.data?.docs || []);
        }else{
            showToast("error", res?.error?.message || "Error Occurred");
        }
    }

    const getAllSensorsMethod = async() => {
        const res = await doGetAllSensors();
        if(res?.success){            
            setSensorsPurchased(res?.response?.data);
        }else{
            showToast("error", res?.error?.message || "Error Occurred");
        }
    }

    const handleAttachClick = (binId) => {
        setSelectedBinId(binId);
        setSelectedSensor("");
        setIsModalOpen(true);
    }

    const handleAttachSensor = async() => {
        if (!selectedSensor) {
            showToast("error", "Please select a sensor");
            return;
        }
        
        // const sensorName = AVAILABLE_SENSORS.find(s => s.id === selectedSensor)?.name;
        // showToast("success", `Sensor ${sensorName} attached successfully!`);
        // setIsModalOpen(false);
        // setSelectedSensor("");
        // setSelectedBinId(null);
        const res = await doAttachSensor({binId: selectedBinId, sensorId: selectedSensor?._id});
        if(res?.success){
            showToast("success", "Sensor Attached Successfully");
            setIsModalOpen(false);
            setSelectedSensor("");
            setSelectedBinId(null);
            getAllBinsMethod();
        }else{
            showToast("error", res?.error?.message || "Error occurred during attaching a sensor");
        }
    }

    const handleDetachSensor = async(id) => {
        if (!id) {
            showToast("error", "Please select a bin");
            return;
        }
        
        // const sensorName = AVAILABLE_SENSORS.find(s => s.id === selectedSensor)?.name;
        // showToast("success", `Sensor ${sensorName} attached successfully!`);
        // setIsModalOpen(false);
        // setSelectedSensor("");
        // setSelectedBinId(null);
        const res = await doDetachSensor({binId: id});
        if(res?.success){
            showToast("success", "Sensor Detached Successfully");
            setIsModalOpen(false);
            setSelectedSensor("");
            setSelectedBinId(null);
            getAllBinsMethod();
        }else{
            showToast("error", res?.error?.message || "Error occurred during detaching a sensor");
        }
    } 

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
            <div className="relative bg-card rounded-lg shadow-md border-[1px] overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                    <div className="flex flex-row w-full justify-start">
                        <h3 className="text-[1.4rem] font-semibold text-card-foreground text-center">
                            {data?.binNumber}
                        </h3>
                    </div>
                    <div className="flex flex-row w-full justify-start">
                        <p className="font-bold text-center mb-2">
                            {data?.material}
                        </p>
                    </div>
                    <div className="flex flex-row justify-between">
                        <p className=" text-center mb-6">
                            {data?.capacity}
                        </p>
                        <p className=" text-center">
                            {format_MM_DD_YYYY(data?.createdAt)}
                        </p>
                    </div>
                    {
                        data?.sensor &&
                        <div className="absolute flex flex-row w-full justify-start -translate-y-6">
                            <p className="text-[14px] font-bold text-center mb-2 text-primary">
                                attached {data?.sensor?.serialNumber} 
                            </p>
                        </div>
                    }
                    <div>
                        {
                            data?.sensor && (
                                <Button 
                                    buttonText="Detach Sensor"
                                    onClick={() => handleDetachSensor(_id)}
                                    className={"bg-white border-[2px] border-primary text-primary"}
                                />
                            )
                        }
                        {
                            !data?.sensor && (
                                <Button 
                                    buttonText="Attach Sensor"
                                    onClick={() => handleAttachClick(_id)}
                                />
                            )
                        }
                    </div>
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

    // Main Page Layout
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <HeroSection />
            <ProductsSection sensors={sensors}/>
            
            {/* Attach Sensor Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[400px] bg-white">
                    <DialogHeader>
                        <DialogTitle>Attach Sensor</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Select Sensor</label>
                            <Select value={selectedSensor} onValueChange={setSelectedSensor}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a sensor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sensorsPurchased?.map((sensor) => (
                                        <SelectItem key={sensor?._id} value={sensor}>
                                            {sensor?.serialNumber}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <button 
                            onClick={handleAttachSensor}
                            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors font-medium"
                        >
                            OK
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Sensors;

