import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
// import mainImage from "../../assets/icons/loginImg.svg";

const ImageSection = ({ img, imgLq = null, fromPopUp = false }) => {

  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`relative flex flex-col items-end flex-grow ${
        !fromPopUp ? "xl:m-4" : ""
      }`}
    >
      <div className="relative w-full h-full max-w-[616px] min-h-[250px] md:min-h-[500px] flex justify-center items-center">
        {imgLq && (
          <div className={twMerge("relative w-full h-[100%] rounded-[30px]", loaded ? "bg-transparent" : "bg-gray-300 animate-pulse")}>
            {/* <div className="absolute bg-white md:right-[5rem] xl:right-[5.50rem] z-10">
              <div className="bg-orange-600 rounded-tr-[20px] p-10">
              </div>
            </div> */}
            <LazyLoadImage
              src={img}
              placeholderSrc={imgLq}
              alt="Background"
              className="object-contain w-full h-auto md:object-cover rounded-[30px]"
              effect="blur"
              onLoad={() => {
                setLoaded(true);
              }}
            />
          </div>
        )}
        {!imgLq && (
          <LazyLoadImage
            src={img}
            alt="Background"
            className="object-contain w-full h-auto md:object-cover"
            effect="blur"
          />
        )}
        {/* Top-right cutout corner */}
        <div
          className={`absolute top-[-0.25rem] right-[-0.25rem] md:w-[5.25rem] xl:w-[5.75rem] md:h-[5.875rem] xl:h-[6.75rem rounded-bl-[20px] xl:rounded-bl-[30px] z-10 ${
            fromPopUp ? " bg-white" : " bg-light"
          }`}
        ></div>
        {!fromPopUp && (
          <div>
            {/* Yellow tooltip */}
            <div className="absolute h-[3.625rem] w-[12.125rem] py-[0.625rem] px-[0.875rem] z-10 p-2 text-level-7 bg-[#FCF3A8] rounded-xl top-[2.0625rem] left-[-2.25rem] font-inter flex flex-row justify-between">
              <div>
                <strong className="font-medium text-dark">Home Cleaning</strong>
                <p className="pt-1 text-content">Deep cleaning for homes .</p>
              </div>
              <div className="bg-dark rounded-[50%] w-2 h-2"></div>
            </div>
            {/* Yellow tooltip */}
            <div className="absolute h-[3.625rem] w-[12.125rem] py-[0.625rem] px-[0.875rem] text-level-7 bg-dark rounded-xl top-[3.875rem] left-0 z-6 text-light font-inter flex flex-row justify-between">
              <div>
                <strong>Home Cleaning</strong>
                <p className="pt-1 font-normal">Deep cleaning for homes .</p>
              </div>
              <div className="bg-[#FCF3A8] rounded-[50%] w-2 h-2"></div>
            </div>
          </div>
        )}

        {/*Bottom tooltip */}
        <div
          className={`absolute ${
            fromPopUp
              ? "bottom-[15px] lg:bottom-[25px] md:right-[25px] xl:right-[35px]"
              : "md:bottom-[2rem] xl:bottom-[3.8125rem] left-1/2 transform -translate-x-1/2"
          } bg-white text-level-7 px-[0.875rem] py-[0.625rem] rounded-xl w-[15.9375rem] font-inter flex flex-row justify-between`}
        >
          <div>
            <strong className="font-medium text-dark">
              Book Now for Same-Day <br />
              Service!
            </strong>
            <p className="pt-1 font-normal text-content">
              Available: Open 24/7 for your service
            </p>
          </div>
          <div className="bg-[#FCF3A8] rounded-[50%] w-2 h-2"></div>
        </div>
      </div>
    </div>
  );
};

export default ImageSection;
