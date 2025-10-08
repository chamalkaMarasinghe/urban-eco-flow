import heroImage from "../assets/images/smart-city-hero.jpg";
import weightedSensor from "../assets/images/weighted-sensor.jpg";
import volumeSensor from "../assets/images/volume-sensor.jpg";
import fillSensor from "../assets/images/fill-sensor.jpg";

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
    const ProductCard = ({ title, price, image, imageAlt }) => {
        return (
            <div className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
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
                    <button className="w-full bg-primary text-white py-3 rounded font-semibold hover:opacity-90 transition-opacity">
                        BUY NOW
                    </button>
                </div>
            </div>
        );
    };

    // Products Section Component
    const ProductsSection = () => {
        const products = [
            {
                title: "Weighted Sensors",
                price: 10.0,
                image: weightedSensor,
                imageAlt: "Weighted sensor device",
            },
            {
                title: "Volumed Sensors",
                price: 20.0,
                image: volumeSensor,
                imageAlt: "Volume sensor circuit board",
            },
            {
                title: "Fill Detecting Sensors",
                price: 50.0,
                image: fillSensor,
                imageAlt: "Fill detection sensor with circuit board",
            },
        ];

        return (
            <section className="bg-background py-12 sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
                        {products?.map((product, index) => (
                            <ProductCard
                                key={index}
                                title={product?.title}
                                price={product?.price}
                                image={product?.image}
                                imageAlt={product?.imageAlt}
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
            <ProductsSection />
        </div>
    );
};

export default Sensors;
