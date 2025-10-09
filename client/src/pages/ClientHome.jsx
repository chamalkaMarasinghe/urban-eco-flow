import Button from "../components/Reusable/CustomButton";
import recycleNature from "../assets/images/recycle-nature.jpg";
import personRecycling from "../assets/images/person-recycling.jpg";
import recyclingBins from "../assets/images/recycling-bins.jpg";
import recyclingFacility from "../assets/images/recycling-facility.jpg";
import { useNavigate } from "react-router-dom";

// Hero Section Component
const HeroSection = () => {

  const navigate = useNavigate()

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Waste collection, optimized by live sensor data
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Real-time sensor data powers efficient waste collection, cost savings, and a better environment for everyone.
          </p>
          <div className="flex flex-col md:flex-row w-full justify-center gap-3">
            <Button buttonText="Send CollectionRequest" width="w-full md:w-[30%]" onClick={() => navigate("/collection-request")}/>
            <Button buttonText="Purchase Sensors" width="w-full md:w-[30%]" onClick={() => navigate("/devices")}/>
            <Button buttonText="Create Bins" width="w-full md:w-[30%]" onClick={() => navigate("/create-bin")}/>
          </div>
        </div>
      </div>
    </section>
  );
};

// Image Gallery Component
const ImageGallery = () => {
  const images = [
    { src: recycleNature, alt: "Recycling symbol made of nature and trees" },
    { src: personRecycling, alt: "Person participating in recycling" },
    { src: recyclingBins, alt: "Modern recycling bins" },
    { src: recyclingFacility, alt: "Industrial recycling facility" },
  ];

  return (
    <section className="bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {images?.map((image, index) => (
            <div key={index} className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img 
                src={image.src} 
                alt={image.alt}
                className="w-full h-64 object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ClientHome = () => {
  return (
      <>
        <title>Urban Eco Flow</title>
        <div className="mb-36 sm:mb-36 md:mb-36 lg:mb-24 xl:mb-0">
          {/* Hero Section */}
          <HeroSection />
          <ImageGallery />
        </div>
      </>
  );
};

export default ClientHome;