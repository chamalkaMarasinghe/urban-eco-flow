import React, { useState } from "react";
import UserAvatar from "../../../utils/UserAvatar";
import ProfileImage from "../../Reusable/ProfileImage";

const ThreadUserAvatar = ({
    firstName,
    lastName,
    avatar,
    isOnline = false,
    loading = false,
}) => {

  return (
    <div className="w-[50px] h-[50px] flex items-center justify-center rounded-full bg-primary relative">
      {isOnline ? (
        <div className="absolute w-[11px] h-[11px] bg-transparent rounded-full flex items-center justify-center top-2 left-0">
          {!loading && <span className="bg-transparent w-[7px] h-[7px] rounded-full"></span>}
        </div>
      ) : null}
      <ProfileImage
        profilePicture={avatar}
        firstName={firstName || ""}
        lastName={lastName || ""}
        fontSize="text-[18px]"
        loading={loading}
      />
    </div>
  );
};

export default ThreadUserAvatar;
