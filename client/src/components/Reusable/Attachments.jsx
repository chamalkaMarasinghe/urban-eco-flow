import { Image } from "antd";
import {
  FaFileWord,
  FaFilePdf,
  FaFileArchive,
  FaFile,
  FaFileImage,
} from "react-icons/fa";
import { MdFileDownload } from "react-icons/md";

const Attachments = ({ attachments, isSender }) => {

  if (!attachments?.length) return null;

  return (
    <div
      className={`flex flex-col gap-1 mt-2 w-fit ${
        isSender ? "justify-end" : "justify-start"
      }`}
    >
      {attachments.map((attachment, index) =>
        isImageFile(attachment) ? (
          <div key={index} className="relative">
            <Image
              src={attachment}
              alt="attachment"
              className="rounded-lg cursor-pointer"
              style={{
                maxWidth: "160px",
                maxHeight: "160px",
                objectFit: "cover",
              }}
              preview={{
                mask: <div className="text-white">Preview</div>,
              }}
            />
          </div>
        ) : (
          <div
            key={index}
            className={`flex items-center gap-[4px] p-2 bg-white ${
              isSender
                ? "rounded-[8px_0px_8px_8px]"
                : "rounded-[0px_8px_8px_8px]"
            } border border-gray-200 hover:bg-gray-50`}
          >
            {getFileIcon(attachment)}
            <span className="text-sm text-gray-700 max-w-[150px] truncate">
              {getFileName(attachment)}
            </span>
            <a
              href={attachment}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 text-gray-500 border text-[16px] hover:text-gray-700 rounded-full flex items-center justify-center"
            >
              <MdFileDownload />
            </a>
          </div>
        )
      )}
    </div>
  );
};

// Get the actual file name from the URL
const getFileName = (fileUrl) => {
  try {
    // Extract filename from Firebase URL
    const url = new URL(fileUrl);
    const pathSegments = url.pathname.split('/');
    
    for (let i = pathSegments.length - 1; i >= 0; i--) {
      const segment = pathSegments[i];
      // Look for encoded filename
      if (segment.includes('%2F')) {
        const parts = segment.split('%2F');
        return decodeURIComponent(parts[parts.length - 1]);
      }
      
      if (segment.includes('.') && i === pathSegments.length - 1) {
        const fileName = segment.split('?')[0];
        return decodeURIComponent(fileName);
      }
    }
    
    return decodeURIComponent(pathSegments[pathSegments.length - 1].split('?')[0]);
  } catch (error) {
    console.error("Error parsing file URL:", error);
    return fileUrl.split('/').pop().split('?')[0];
  }
};

const getFileIcon = (fileUrl) => {
  const filename = getFileName(fileUrl);
  const extension = filename.split('.').pop().toLowerCase();

  switch (extension) {
    case "doc":
    case "docx":
      return <FaFileWord className="w-6 h-6 text-blue-600" />;
    case "pdf":
      return <FaFilePdf className="w-6 h-6 text-red-600" />;
    case "zip":
    case "rar":
      return <FaFileArchive className="w-6 h-6 text-yellow-600" />;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "webp":
      return <FaFileImage className="w-6 h-6 text-green-600" />;
    default:
      return <FaFile className="w-6 h-6 text-gray-600" />;
  }
};

const isImageFile = (url) => {
  try {
    const filename = getFileName(url);
    const extension = filename.split('.').pop().toLowerCase();
    return ["jpg", "jpeg", "png", "gif", "webp"].includes(extension);
  } catch (error) {
    console.error("Error checking file type:", error);
    return false;
  }
};

export default Attachments;