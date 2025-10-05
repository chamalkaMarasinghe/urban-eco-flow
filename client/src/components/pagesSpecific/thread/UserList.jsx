import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ThreadUserAvatar from "./ThreadUserAvatar";
import { messageTypes } from "../../../constants/commonConstants";
import { formatYYYY_MM_DD } from "../../../utils/dateFormating";
import { twMerge } from "tailwind-merge";
import NotFound from "../../Reusable/NotFound";

const UserList = ({ users, onSelectUser, selectedUser, loading = false }) => {
  // NOTE: signed in user state
  const userState = useSelector((state) => state?.auth?.user);

  const [userList, setUserList] = useState();

  useEffect(() => {
    if (!loading) {
      setUserList(users);
    } else {
      setUserList([0, 0, 0, 0, 0]);
    }
  }, [users, loading]);

  return (
    <div className="flex-col flex-1 max-h-[87vh] gap-2 mb-2">
      {userList?.length > 0 ? (
        userList?.map((user) => (
          <div
            key={user?._id}
            onClick={!loading ? () => onSelectUser(user) : () => {}}
            className={`h-[65px] px-2 sm:px-4 flex items-center  justify-between border-l-4 cursor-pointer  ${
              selectedUser?._id === user?._id && user?._id !== undefined
                ? "bg-[#DDE1E666] border-l-dark-black"
                : "border-transparent"
            }`}
          >
            {/* left */}
            <div className="flex items-center gap-2">
              <ThreadUserAvatar
                firstName={user?.serviceprovider?.firstName || ""}
                lastName={user?.serviceprovider?.lastName || ""}
                avatar={user?.serviceprovider?.businessInformation?.logo?.[0]}
                isOnline={true}
                loading={loading}
              />

              <div className="flex flex-col ">
                <h3
                  className={
                    "font-semibold font-roboto text-level-6 leading-6 max-w-[220px] line-clamp-1 text-dark m-0"
                  }
                >
                  {loading && (
                    <span className="text-transparent rounded-xl bg-slate-300 animate-pulse">
                      User Name Loading State
                    </span>
                  )}
                  {`${user?.serviceprovider?.firstName || ""} ${user?.serviceprovider?.lastName || ""}`}
                  {(user?.serviceprovider === undefined || user?.serviceprovider === undefined) && !loading && "Unavailable User"}
                </h3>
                {user?.isTyping ? (
                  <span className=" font-roboto font-medium text-dark text-level-7 leading-[21px] m-0">
                    {/* Typing... */}
                  </span>
                ) : (
                  <span
                    className={twMerge(
                      "font-roboto text-[12px] sm:text-level-7 font-medium leading-[21px] max-w-[180px] line-clamp-1",
                      loading
                        ? "text-transparent bg-slate-300 rounded-xl animate-pulse"
                        : user?.lastRead?.find(
                            (it) =>
                              it?.userId?.toString() ===
                              userState?._id?.toString()
                          )?.unreadCount > 0
                        ? "text-dark-black"
                        : "text-light-gray font-light"
                    )}
                  >
                    {loading && "Loading State Last Message skeleton"}
                    {/* {
                      // Show "You are read!!" if no unread messages
                      user?.lastRead?.find(
                        (it) =>
                          it?.userId?.toString() === userState?._id?.toString()
                      )?.unreadCount === 0
                        ? "You are read !!"
                        : ((user?.lastMessage?.messageTye === "TEXT" || user?.lastMessage?.messageTye === messageTypes.OFFER_ACTION) && user?.lastMessage?.content) ||
                          (user?.lastMessage?.messageTye === "TEXT" && user?.lastMessage?.content?.length < 1 && user?.lastMessage?.attachments?.length > 0 && "Attachment") ||
                          (user?.lastMessage?.messageTye === messageTypes.OFFER && "Offer")
                    } */}
                    {
                      // Show "You are read!!" if no unread messages
                      user?.lastMessage?.content
                    }
                  </span>
                )}
              </div>
            </div>
            {/* right */}
            <div className="flex flex-col items-end h-full py-2 m-0 leading-8">
              <span className="overflow-hidden text-level-7 font-roboto text-light-gray whitespace-nowrap text-ellipsis">
                {!loading &&
                  formatYYYY_MM_DD(user?.lastMessage?.createdAt || null)}
              </span>
              {user?.lastRead?.filter(
                (it) => it?.userId?.toString() === userState?._id?.toString()
              )[0]?.unreadCount > 0 && (
                <p
                  className={`text-[8px] font-roboto font-semibold ${
                    user?.unreadCount === 0 ? 0 : "bg-dark"
                  }  flex items-center justify-center rounded-[4px] w-[14px] h-[16px] text-white bg-primary`}
                >
                  {/* {user.unreadCount === 0 ? 0 : user.unreadCount} */}
                  {
                    user?.lastRead?.filter(
                      (it) =>
                        it?.userId?.toString() === userState?._id?.toString()
                    )[0]?.unreadCount
                  }
                </p>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="flex justify-center items-center h-[100%] mt-[45%] w-full">
          <NotFound message="No Threads Found" />
        </div>
      )}
    </div>
  );
};

export default UserList;
