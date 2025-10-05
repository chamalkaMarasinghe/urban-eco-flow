import React from 'react';
import { MdChatBubbleOutline } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const ChatIcon = ({ viewType = "desktop", className = "" }) => {

  const navigate = useNavigate();

  if (viewType === "mobile") {
    return (
      <button
        className="flex items-center gap-3 w-full text-left py-2 font-roboto font-medium text-[16px] leading-[100%] tracking-[0%] text-[#022B3A] transition-colors duration-300 hover:text-user-orange"
        onClick={() => {navigate("/chat")}}
      >
        <MdChatBubbleOutline className="w-[33.98px] h-[29.97px]" />
        <span>Chat</span>
      </button>
    );
  }

  if (viewType === "dropdown") {
    return (
      <button
        className={`font-roboto font-medium text-[16px] leading-[100%] tracking-[0%] text-[#022B3A] transition-colors duration-300 hover:text-user-orange w-full text-left ${className}`}
        onClick={() => {navigate("/chat")}}
      >
        <span>My Chat</span>
      </button>
    );
  }

  // Desktop view
  return (
    <button
      className="relative p-1 rounded-full hover:bg-gray-100 transition-all duration-200 group"
      aria-label="Open chat"
      title="Chat"
      onClick={() => {navigate("/chat")}}
    >
      <MdChatBubbleOutline className="w-[23.98px] h-[19.97px] text-user-orange group-hover:text-user-orange transition-colors duration-200" />
    </button>
  );
};

export default ChatIcon;