import { X, Tag } from "lucide-react"; // Import icons
import { twMerge } from "tailwind-merge";

export const ConfirmationModal = ({ isOpen, options, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  // Dynamic Text Color
  const typeBasedTextColor =
    options.type === "accept"
      ? "text-primary"
      : options.type === "delete"
      ? "text-[#C90303]"
      : "text-gray-800";

  // Dynamic Button Background Color
  const typeBasedButtonBg =
    options.type === "accept"
      ? "bg-primary"
      : options.type === "delete"
      ? "bg-[#C90303] "
      : "bg-gray-600 hover:bg-gray-700";

  const typeBasedBorderColor =
    options.type === "accept"
      ? "border-primary"
      : options.type === "delete"
      ? "border-[#0F161E] "
      : "bg-gray-600 hover:bg-gray-700";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[99]">
      {/* Modal Container */}
      <div
        className={twMerge(
          "bg-white rounded-xl w-[90%] max-w-[40.5625rem] p-[24px] shadow-lg relative"
        )}
      >
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <button
          onClick={onCancel}
          className="absolute left-4 top-4 text-gray-500 hover:text-gray-700 flex items-center bg-[#fafafa]  p-[12px] border-[1px] border-[#CBD5E0] rounded-[10px]"
        >
          <Tag size={20} className="text-gray-600" />
        </button>

        {/* Icon & Title */}
        <div className="flex flex-col items-center">
          {/* Icon Box */}

          {/* Title */}
          <h2
            className={twMerge(
              `font-bold font-inter text-[24px]`,
              typeBasedTextColor
            )}
          >
            {options.title || "Delete Request"}
          </h2>

          {/* Message */}
          <p className="text-[#535862] text-[1rem] font-normal mt-[12px] text-center">
            {options.message || "Are you sure you want to delete this request?"}
          </p>
        </div>

        {/* Buttons */}
        <div className="sm:mt-[80px] md:mt-[80px] mt-[40px] flex flex-row-reverse gap-[12px]">
          <button
            onClick={onConfirm}
            className={twMerge(
              `w-full text-white py-3 rounded-lg font-inter font-semibold text-[14px]`,
              typeBasedButtonBg
            )}
          >
            {options.confirmText || "Delete Request"}
          </button>
          <button
            onClick={onCancel}
            className={twMerge(
              `w-full border  text-primary py-3 rounded-lg font-inter font-semibold text-[14px] hover:bg-[#FFF7ED]`,
              typeBasedBorderColor
            )}
          >
            {options.cancelText || "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
};
