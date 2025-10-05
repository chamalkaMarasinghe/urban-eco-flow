import {
  AiOutlineFilePdf,
  AiOutlineFileWord,
  AiOutlineFileZip,
  AiOutlineFile,
} from "react-icons/ai";
import { HiTrash } from "react-icons/hi";

const FileItem = ({ file, onRemove, allowRemove }) => {

  const getFileIcon = () => {
    switch (file.type) {
      case "application/pdf":
        return (
          <AiOutlineFilePdf className="text-2xl text-red-500 lg:text-3xl" />
        );
      case "application/msword":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return (
          <AiOutlineFileWord className="text-2xl text-blue-500 lg:text-3xl" />
        );
      case "application/zip":
      case "application/vnd.rar":
        return (
          <AiOutlineFileZip className="text-2xl text-yellow-500 lg:text-3xl" />
        );
      default:
        return <AiOutlineFile className="text-2xl text-gray-500 lg:text-3xl" />;
    }
  };

  const handleDownload = () => {
    if (file instanceof File) {
      // Handle local File objects
      const link = document.createElement("a");
      link.href = URL.createObjectURL(file);
      link.download = file.name;
      link.click();
      URL.revokeObjectURL(link.href);
    } else if (file.url) {
      // Handle remote URLs
      const link = document.createElement("a");
      link.href = file.url;
      link.download = file.name || "download"; // Use fileName or a default name
      link.click();
    } else {
      console.error("Unsupported file type for download:", file);
    }
  };

  return (
    <div
      className={`
        border border-light-blue rounded-lg 
        p-1 pr-2 md:pr-6 
        h-auto sm:h-20 
        flex 
        w-full 
        justify-between 
        items-start sm:items-center
        relative
        cursor-pointer
      `}
    >
      <div className="flex flex-col items-start gap-2 pr-12 sm:flex-row sm:gap-5 sm:items-center sm:pr-0">
        <div
          onClick={handleDownload}
          title="Click to download"
          className="flex items-center justify-center w-16 h-16 sm:w-28"
        >
          {getFileIcon()}
        </div>
        <div className="flex items-center gap-1">
          <p
            title={file.name}
            className="text-sm font-semibold max-w-48 sm:max-w-[12.5rem] truncate block text-gray-600"
          >
            {file.name}
          </p>
          {file?.size && (
            <span className="text-sm font-semibold text-gray-600 whitespace-nowrap">
              ({(file.size / (1024 * 1024)).toFixed(2)}MB)
            </span>
          )}
        </div>
      </div>

      <div className="absolute sm:relative right-2 top-1 sm:top-auto">
        {allowRemove && (
          <div
            className="flex items-center justify-center bg-red-100 border border-red-300 rounded-md cursor-pointer w-7 h-7 md:w-8 md:h-8 sm:border-none"
            onClick={(e) => {
              e.stopPropagation(); // Prevent the download handler from being triggered
              onRemove(file);
            }}
          >
            <HiTrash className="text-red-600 text-[16px] md:text-xl" />
          </div>
        )}
      </div>
    </div>
  );
};

export default FileItem;
