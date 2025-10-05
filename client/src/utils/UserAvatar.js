import { Avatar } from "antd";

const UserAvatar = ({ 
  firstName, 
  lastName, 
  fontSize = "16px", 
  backgroundColor = "#F65F18",
  className = ""
}) => {
  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();

  return (
    <div className={`flex items-center justify-center h-full w-full ${className}`}>
      <Avatar
        className={`flex items-center justify-center font-bold width-full height-full font-inter ${className}
         ${fontSize} ${backgroundColor}
        `}
        style={{
          backgroundColor: backgroundColor,
          color: "white",
            fontSize: fontSize,
        }}
      >
        {initials}
      </Avatar>
    </div>
  );
};

export default UserAvatar;
