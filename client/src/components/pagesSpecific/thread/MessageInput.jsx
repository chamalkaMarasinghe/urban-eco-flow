import React, { useState } from "react";
import { FaPaperclip } from "react-icons/fa6";
import { ClipLoader } from "react-spinners";
import { ReactComponent as SendMsgIcon } from "../../../assets/icons/msg-send-arrow.svg";
import FilePreviewChip from "../../../utils/FilePreviewChip";
import { useSelector } from "react-redux";
import { roles } from "../../../constants/commonConstants";
// import CustomOfferModel from "../Model/CustomOfferModel";
// import CustomButton from "../Form/CustomButton";
import { IoMdSend } from "react-icons/io";
import { useLanguage } from "../../../context/language/language";


const MessageInput = ({ onSendMessage, text, setText, loading = false, isHidden = false }) => {
  const { isAuthenticated, user, role, availableRoles } = useSelector(
    (state) => state.auth
  );

  const [isCreatingOfferModel, setIsCreatingOfferModel] = useState(false);
  // const {language} = useLanguage();

  // const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (message.trim() || selectedFiles.length > 0) {
  //     onSendMessage({
  //       text: message,
  //       files: selectedFiles,
  //     });
  //     setMessage("");
  //     setSelectedFiles([]);
  //   }
  // };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter(
      (file) => file.size <= MAX_FILE_SIZE
    );
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <>
    { !isHidden &&
      <div className="w-full max-w-[96%] mx-auto overflow-x-auto">
        {/* File Previews */}
        {selectedFiles.length > 0 && (
          <div className="p-4 pb-0 flex flex-wrap gap-2 border-t-[1px] border-light-blue">
            {selectedFiles.map((file, index) => (
              <FilePreviewChip
                key={index}
                file={file}
                onRemove={() => removeFile(index)}
              />
            ))}
          </div>
        )}

        {/* Message Input Form */}
        <div className="py-4">
          <div className="flex flex-col items-start w-full px-3 py-2 border rounded-lg sm:flex-row sm:items-center border-light-blue">
            <div className="flex items-center flex-1 w-full mb-2 sm:mb-0">
              {/* Hidden File Input */}
              <input
                type="file"
                multiple
                id="file-upload"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,.pdf,.docx,.xlsx,.pptx,.txt,.zip,.rar"
              />

              {/* File Upload Icon */}
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-light-gray hover:text-[#0F161E] w-6 h-6 flex items-center justify-center flex-shrink-0"
              >
                <FaPaperclip size={20} />
              </label>

              {/* Message Input */}
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter Message"
                className="border-none flex-1 font-roboto h-10 p-4 max-h-40 min-h-[40px] resize-none overflow-y-auto scrollbar-none rounded-lg mx-2 focus:outline-none text-level-6 text-content sm:h-10 sm:min-h-[50px] w-full"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onSendMessage({
                      // isOffer: false,
                      attachmentFiles: selectedFiles,
                      setSelectedFiles: setSelectedFiles,
                    });
                  }
                }}
              />
            </div>

            {/* Send Button and Create Offer Button */}
            <div className="flex flex-row items-center justify-between flex-shrink-0 w-full gap-2 sm:flex-row sm:gap-2 sm:w-auto sm:justify-end">
              {Array.isArray(availableRoles) &&
              availableRoles.includes(roles.TASKER) &&
              user &&
              !user?.isSuspended &&
              !user?.taskerRequestedAndStillNotVerified ? (
                <>
                  <button
                    type="submit"
                    className="flex items-center justify-center flex-shrink-0 w-10 h-10"
                    onClick={() =>
                      onSendMessage({
                        // isOffer: false,
                        attachmentFiles: selectedFiles,
                        setSelectedFiles: setSelectedFiles,
                      })
                    }
                  >
                    {loading ? (
                      <div className="flex justify-center items-center rounded-lg w-[40px] h-[40px] bg-black">
                        <ClipLoader size={18} color={"#FFFFFF"} />
                      </div>
                    ) : (
                      <SendMsgIcon
                        className="w-10 h-10"
                        fill={"#0F161E"}
                        stroke={"#FFFFFF"}
                      />
                    )}
                  </button>
                </>
              ) : (
                <button
                  type="submit"
                  className="flex items-center justify-center w-full h-10 rounded-lg sm:w-10"
                  onClick={() =>
                    onSendMessage({
                      // isOffer: false,
                      attachmentFiles: selectedFiles,
                      setSelectedFiles: setSelectedFiles,
                    })
                  }
                >
                  {loading ? (
                    <div className="flex justify-center items-center rounded-lg w-full sm:w-[40px] h-[40px] bg-black">
                      <ClipLoader size={18} color={"#FFFFFF"} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full h-10 bg-black rounded-lg sm:w-10 ">
                      <IoMdSend width={24} color="white"/>
                    </div>
                  )}
                </button>
              )}        
            </div>
          </div>
        </div>

        {/* Offer Model */}
        {/* <CustomOfferModel
          isOpen={isCreatingOfferModel}
          onClose={() => setIsCreatingOfferModel(false)}
          onSubmit={onSendMessage}
        /> */}
      </div>
    }
    </>
  );
};

export default MessageInput;
