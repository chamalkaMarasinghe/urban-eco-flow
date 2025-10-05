import { useState } from "react";
// import LazyLoad from 'react-lazyload';
import UserAvatar from "../../utils/UserAvatar";

const ProfileImage = ({ 
  profilePicture = null,
  firstName = "",
  lastName = "",
  className = "",
  imageStyle = "rounded-full object-cover",
  avatarSize = 64,
  fontSize = "16px",
  backgroundColor = "#F65F18",
  loading = false,
}) => {
  
  const [isImageValid, setIsImageValid] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  
  const handleImageError = () => {
    setIsImageValid(false);
  };

  if(loading){
    return (
      <div className={`w-full h-full ${className} rounded-full bg-slate-300 animate-pulse`}>
          <div className={`w-full h-full rounded-full`}/>
      </div>
    );
  }
  return (
    <div className={`w-full h-full ${className} rounded-full overflow-hidden`}>
      {isImageValid && profilePicture ? (
        // <LazyLoad height={200} offset={100} once>
          <div className={`flex w-full h-[100%] ${hasLoaded ? "" : "bg-slate-300 animate-pulse"}`}>
            <img
              src={profilePicture}
              alt="Profile"
              className={`w-full h-full ${imageStyle}`}
              onError={handleImageError} // If image fails, fallback to avatar
              onLoad={() => setHasLoaded(true)}
            />
          </div>
        // </LazyLoad>
      ) : (
        <UserAvatar
          firstName={firstName}
          lastName={lastName}
          size={avatarSize}
          fontSize={fontSize}
          backgroundColor={backgroundColor}
          className="w-full h-full"
        />
      )}
    </div>
  );
};

export default ProfileImage;
