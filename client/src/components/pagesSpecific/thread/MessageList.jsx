import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { formatChatDate, formatHH_MM_SS } from "../../../utils/dateFormating";
import {
  messageTypes,
  // offerActionMessages,
  // offerStatus,
  roles,
} from "../../../constants/commonConstants";
import Attachments from "../../Reusable/Attachments"
import NotFound from "../../Reusable/NotFound";
import { useLanguage } from "../../../context/language/language";

const MessageList = ({
  messages,
  // acceptOfferMethod = () => {},
  // declineOfferMethod = () => {},
  // cancelOfferMethod = () => {},
  threadId,
}) => {
  const { role } = useSelector((state) => state.auth);
  // NOTE: signed in user state
  const userState = useSelector((state) => state?.auth?.user);
  const currentLoginUser = userState?._id?.toString();
  
  // Create refs for the chat container and messages end
  const chatContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  // const {language} = useLanguage();

  // Function to scroll to bottom of the chat container only
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // Auto scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  let lastDate = null;

  const renderMessageContent = (
    message,
    // acceptOfferMethod = () => {},
    // declineOfferMethod = () => {},
    // cancelOfferMethod = () => {}
  ) => {
    const isSender = message?.sender?.toString() === currentLoginUser;

    switch (message.messageTye) {
      // case messageTypes.OFFER:
      //   if (typeof message?.offer === "string") {
      //     return null;
      //   } else {
      //     return (
      //       <div></div>
      //       // <ServiceOffer
      //       //   offer={message?.offer}
      //       //   isSender={message?.sender?.toString() === currentLoginUser}
      //       //   acceptOfferMethod={acceptOfferMethod}
      //       //   declineOfferMethod={declineOfferMethod}
      //       //   cancelOfferMethod={cancelOfferMethod}
      //       //   threadId={threadId}
      //       // />
      //     );
      //   }

      // case messageTypes.OFFER_ACTION:
      //   const offerState = message?.offer?.offerStatus;
      //   return (
      //     <div className="bg-gray-100 p-2 text-sm max-w-full font-inter text-[#0F161E] rounded-[0px_8px_8px_8px]">
      //       {
      //         (offerState = offerStatus.ACCEPTED
      //           ? offerActionMessages.ACCEPTED
      //           : offerActionMessages.DECLINED)
      //       }
      //     </div>
      //   );

      //   // case messageTypes.TEXT:
      //   // default:
      //   // Skip rendering if the message has no content
      //   if (!message.content) {
      //     return null;
      //   }

      //   return (
      //     <div
      //       className={`relative p-2 
      //   ${
      //     isSender
      //       ? "bg-[#EDEEEE] text-[#4A4A4A] rounded-[8px_0px_8px_8px]"
      //       : "bg-[#DDE1E6] text-[#0F161E] rounded-[0px_8px_8px_8px]"
      //   }w-full`}
      //     >
      //       {message.content}

      //       {/* Message Time */}
      //       <div
      //         className={`absolute text-[10px] font-inter font-normal text-content${
      //           isSender ? "-bottom-[18px] right-0" : "-bottom-[18px] left-0"
      //         }`}
      //       >
      //         {formatHH_MM_SS(message.createdAt)}
      //       </div>
      //     </div>
      //   );

      case messageTypes.TEXT:
      default:
        return (
          <div
            className={`relative w-fit max-w-full sm:max-w-[70%] lg:max-w-[70%] min-w-[70px] ${
              !message.content && !message.attachments?.length ? "hidden" : ""
            }`}
          >
            {/* Attachments */}
            {message.attachments?.length > 0 && (
              <div className="mb-2">
                <Attachments
                  attachments={message.attachments}
                  isSender={isSender}
                />
              </div>
            )}

            {/* Content message */}
            {message.content && (
              <div
                className={`p-2 relative break-words font-roboto ${
                  isSender
                    ? "bg-[#EDEEEE] text-dark-gray rounded-[8px_0px_8px_8px]"
                    : "bg-[#F5F6F8] text-[#0F161E] rounded-[0px_8px_8px_8px]"
                }`}
              >
                {message.content}

                <div
                  className={`absolute text-[10px] font-roboto font-normal text-light-gray ${
                    isSender ? "-bottom-[18px] right-0" : "-bottom-[18px] left-0"
                  }`}
                >
                  {formatHH_MM_SS(message.createdAt)}
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div 
      ref={chatContainerRef}
      className="flex-1 max-w-full overflow-x-hidden overflow-y-auto scrollbar-chat"
    >
      {[...messages]?.length > 0 ? (
        <div className="py-4 space-y-9 lg:space-y-4 mx-auto w-[96%]">
          {[...messages]?.reverse()?.map((message) => {
            const displayDate = formatChatDate(message.createdAt);
            const showDateHeader = displayDate !== lastDate;
            lastDate = displayDate;

            return (
              <div key={message.messageId}>
                {showDateHeader && (
                  <div className="flex items-center my-4">
                    <div className="flex-1 border-t border-light-blue"></div>
                    <div className="text-center text-level-7 text-[#0F161E] font-medium mx-4 font-roboto">
                      {displayDate}
                    </div>
                    <div className="flex-1 border-t border-light-blue"></div>
                  </div>
                )}

                <div
                  className={`flex font-inter text-level-7 leading-[21px] ${
                    message.sender === currentLoginUser
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {renderMessageContent(
                    message,
                    // acceptOfferMethod,
                    // declineOfferMethod,
                    // cancelOfferMethod
                  )}
                </div>
              </div>
            );
          })}
          {/* This div serves as a reference point for the message end */}
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <>
          <div className="flex justify-center items-center h-[100%] w-full">
            <NotFound message="No messages yet"/>
          </div>
        </>
      )}
    </div>
  );
};

export default MessageList;