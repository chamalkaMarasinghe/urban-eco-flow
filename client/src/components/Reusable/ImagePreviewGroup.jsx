import { useState } from 'react';
import { Image } from 'antd'; // Assuming you're using Antd
import { twMerge } from 'tailwind-merge';
import LazyLoad from 'react-lazyload';

const placeholderImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Cpath d='M100 50 L150 150 L50 150 Z' fill='%23cccccc'/%3E%3Ccircle cx='140' cy='60' r='10' fill='%23cccccc'/%3E%3C/svg%3E";

const ImagePreviewGroup = ({
  className,
  imageStyles,
  images,
  imageSize = { width: 90, height: 90 },
  imageOuterContainerStyles,
  allowClose = false,
  handleRemoveUploadedFile,
  disabledDelete = false,
}) => {
  const [visible, setVisible] = useState(false);
  const [imgError, setImgError] = useState({});
  const [hasLoaded, setHasLoaded] = useState(images?.map(it => false));

  // Handle image loading errors
  const handleImageError = (imageId) => {
    setImgError(prev => ({
      ...prev,
      [imageId]: true
    }));
  };

  return (
    <Image.PreviewGroup
      preview={{
        visible,
        onVisibleChange: (vis) => setVisible(vis),
        // Don't include images that failed to load in the preview
        imageList: images.filter(img => !imgError[img.id]).map(img => img.src),
      }}
    >
      <div className={twMerge("flex flex-row gap-4 flex-wrap", className)}>
        {images.map((image, index) => (
          <div key={image.id} className={twMerge("relative", imageOuterContainerStyles)}>
            <LazyLoad height={200} offset={100} once>
              <div className={`flex w-full h-[100%] rounded-[4px] ${hasLoaded[index] ? "" : "bg-slate-300"}`}>
                <Image
                  src={imgError[image.id] ? placeholderImage : image.src}
                  alt={image.alt || 'Image'}
                  className={twMerge("object-cover rounded-[4px]", imageStyles)}
                  width={imageSize.width}
                  height={imageSize.height}
                  onClick={() => !imgError[image.id] && setVisible(true)}
                  onError={() => handleImageError(image.id)}
                  preview={!imgError[image.id]}
                  fallback={placeholderImage}
                  onLoad={() => setHasLoaded((prev) => {                    
                    let newArr = prev;
                    newArr[index] = true;
                    
                    return newArr;
                  })}
                />
              </div>
            </LazyLoad>
            {(allowClose && !disabledDelete) && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent image preview from opening
                  handleRemoveUploadedFile(image.id);
                }}
                className="pointer-events-auto absolute -top-1 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-colors"
                aria-label="Remove image"
              >
                ×
              </button>
            )}
            {imgError[image.id] && (
              <div className="absolute bottom-0 left-0 right-0 bg-gray-200 text-light-red font-inter bg-opacity-75 text-xs text-center py-1">
                Format error
              </div>
            )}
          </div>
        ))}
      </div>
    </Image.PreviewGroup>
  );
};

export default ImagePreviewGroup;