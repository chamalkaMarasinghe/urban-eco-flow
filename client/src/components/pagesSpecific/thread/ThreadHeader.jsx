import React from "react";
// import UserAvatar from "../../utils/UserAvatar";
// import { BsThreeDotsVertical } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa6";
import ThreadUserAvatar from "./ThreadUserAvatar";
import { useSelector } from "react-redux";

const ThreadHeader = ({ user, onBack, isHidden = false }) => {

  // NOTE: signed in user state
  const userState = useSelector(state => state?.auth?.user);

  return (
    <div className="flex items-center h-[64px] pl-4 border-b rounded-tr-[30px] border-light-blue bg-[#FAFAFA]">
      <div className="flex items-center gap-2 ">
        <button
          onClick={onBack}
          className="lg:hidden text-light-gray hover:text-primary"
        >
          <FaArrowLeft size={20} className="text-primary" />
          
        </button>
        {!isHidden &&
          <ThreadUserAvatar
            firstName={user?.serviceprovider?.firstName || ''}
            lastName={user?.serviceprovider?.lastName || ''}
            avatar={user?.serviceprovider?.businessInformation?.logo?.[0] || ''}
            isOnline={true}
            
          />
        }
        <div className="flex flex-col font-roboto">
          <h2 className="mb-0 font-semibold leading-6 text-dark text-level-6">
          {`${user?.serviceprovider?.firstName || ''} ${user?.serviceprovider?.lastName || ''}`}
          { isHidden && "Unavailable User"}
          </h2>
          {/* <p className="text-[10px] text-black mt-1">
            {
              `${userState?._id?.toString() !== user?.user1?._id ? user?.user1?.professionalDetails?.primary?.[0]?.categoryName || '' : user?.user2?.professionalDetails?.primary?.[0]?.categoryName || ''}`
            }
          </p> */}
        </div>
      </div>

      {/* <button className="ml-auto text-primary">
        <BsThreeDotsVertical size={22} />
      </button> */}
    </div>
  );
};

export default ThreadHeader;
