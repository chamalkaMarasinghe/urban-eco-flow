import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Location from "../../assets/icons/location-city.svg";

const SlidingTabs = ({
  items = [],
  displayKey = "name",
  activeItem,
  onItemSelect,
  className = "",
  itemClassName = "",
  containerWidth = "max-w-5xl",
  showNavigation = true,
  renderItem,
  swipeEnabled = true,
  itemsSpacing = 15,
  image = false,
}) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(true);

  // Check if the items array contains primitive values
  const isPrimitiveArray = items.length > 0 && typeof items[0] !== "object";

  // Handle Navigation Clicks
  const handlePrevClick = () => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNextClick = () => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  useEffect(() => {
    if (swiperRef.current?.swiper) {
      const swiperInstance = swiperRef.current.swiper;

      const updateNavigation = () => {
        setShowPrev(!swiperInstance.isBeginning);
        setShowNext(!swiperInstance.isEnd);
      };

      // Update navigation state on init
      updateNavigation();

      // Add event listeners
      swiperInstance.on("slideChange", updateNavigation);
      swiperInstance.on("snapGridLengthChange", updateNavigation);
      swiperInstance.on("resize", updateNavigation);

      return () => {
        // Cleanup event listeners
        swiperInstance.off("slideChange", updateNavigation);
        swiperInstance.off("snapGridLengthChange", updateNavigation);
        swiperInstance.off("resize", updateNavigation);
      };
    }
  }, []);

  const defaultRenderItem = (item) => {
    const isActive = isPrimitiveArray
      ? activeItem === item
      : activeItem?.[displayKey] === item[displayKey];

    const displayValue = isPrimitiveArray ? item : item[displayKey];

    return (
      <div
        className={`flex justify-center items-center rounded-[20px] px-6 py-2 font-inter text-[14px] text-[#404145] text-center whitespace-nowrap cursor-pointer transition
          ${
            isActive
              ? "border-[1px] border-primary bg-white"
              : "bg-[#FAFAFA] border border-transparent"
          }
          ${itemClassName}
        `}
      >
        {image && <img src={Location} alt="location-icon" className="mr-2" />}
        {displayValue}
      </div>
    );
  };

  const NavigationButton = ({ direction, onClick, show }) => {
    if (!showNavigation || !show) return null;

    const Icon = direction === "prev" ? ChevronLeft : ChevronRight;

    return (
      <button
        onClick={onClick}
        className="z-10 bg-gray-300 p-2 rounded-full tracking-[0.001em] hover:bg-gray-400 transition flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={`${direction === "prev" ? "Previous" : "Next"} items`}
      >
        <Icon className="w-5 h-5 text-gray-700" />
      </button>
    );
  };

  return (
    <div className={`${containerWidth} w-full ${className}`}>
      <div className="flex items-center justify-start space-x-3 w-full">
        <NavigationButton
          direction="prev"
          onClick={handlePrevClick}
          show={showPrev}
        />

        <div className="w-full overflow-hidden">
          <Swiper
            ref={swiperRef}
            slidesPerView="auto"
            freeMode={true}
            modules={[Navigation, FreeMode]}
            className="w-full"
            spaceBetween={itemsSpacing}
            allowTouchMove={swipeEnabled}
            onResize={() => {
              if (swiperRef.current?.swiper) {
                swiperRef.current.swiper.update();
              }
            }}
          >
            {items.map((item, index) => (
              <SwiperSlide key={index} className="w-auto">
                <div onClick={() => onItemSelect?.(item)}>
                  {renderItem?.(item) ?? defaultRenderItem(item)}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <NavigationButton
          direction="next"
          onClick={handleNextClick}
          show={showNext}
        />
      </div>
    </div>
  );
};

export default SlidingTabs;
