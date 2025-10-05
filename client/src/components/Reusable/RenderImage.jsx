import React, { useState } from "react";
import LazyLoad from 'react-lazyload';

const RenderImage = ({
  src,
  alt,
  className = "",
  fallbackSrc = null,
  placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Cpath d='M100 50 L150 150 L50 150 Z' fill='%23cccccc'/%3E%3Ccircle cx='140' cy='60' r='10' fill='%23cccccc'/%3E%3C/svg%3E",
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc || placeholderImage);
  const [hasError, setHasError] = useState(!src && !fallbackSrc);
  const [hasLoaded, setHasLoaded] = useState(false);

  const handleError = () => {
    if (imgSrc === src && fallbackSrc) {
      // Try the fallback image if the primary source fails
      setImgSrc(fallbackSrc);
    } else if (imgSrc !== placeholderImage) {
      // Use placeholder if both primary and fallback fail
      setImgSrc(placeholderImage);
      setHasError(true);
    }
  };

  return (
    <LazyLoad height={200} offset={100} once>
      <div className={`flex w-full h-full rounded-xl overflow-hidden transition duration-300 ${hasLoaded ? "" : "bg-slate-300 animate-pulse"}`}>
        <img
          src={imgSrc}
          alt={alt}
          className={`${className} ${hasError ? "opacity-70" : ""}`}
          onError={handleError}
          onLoad={() => setHasLoaded(true)}
          {...props}
        />
      </div>
    </LazyLoad>
  );
};

export default RenderImage;
