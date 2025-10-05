import { X } from "lucide-react";
import { getFileIcon } from "./getFileIcon";

const FilePreviewChip = ({ file, onRemove }) => {
  return (
    <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm gap-2">
      {getFileIcon(file.type)}
      <span className="truncate max-w-[100px]">{file.name}</span>
      <button
        onClick={onRemove}
        className="text-light-gray hover:text-light-red rounded-full p-0.5 hover:bg-gray-200 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default FilePreviewChip;


