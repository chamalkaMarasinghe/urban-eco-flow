import {
  FileImageOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileZipOutlined,
  FileUnknownOutlined,
} from "@ant-design/icons";

export const getFileIcon = (type) => {
  if (type.startsWith("image/"))
    return <FileImageOutlined className="text-blue-400" />;
  if (type === "application/pdf")
    return <FilePdfOutlined className="text-red-600" />;
  if (type.includes("word"))
    return <FileWordOutlined className="text-blue-700" />;
  if (type.includes("sheet") || type.includes("excel"))
    return <FileExcelOutlined className="text-green-500" />;
  if (type.includes("zip") || type.includes("rar"))
    return <FileZipOutlined className="text-yellow-600" />;
  return <FileUnknownOutlined className="text-gray-400" />;
};
