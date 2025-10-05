import { referencesFormats } from "../constants/commonConstants";

const convertUploadedFile = (fileOrUrl) => {
  // If the input is a URL, extract the file name, extension, MIME type, and preview URL
  if (typeof fileOrUrl === "string") {
    try {
      const url = new URL(fileOrUrl);
      const pathname = decodeURIComponent(url.pathname);
      const fileName = pathname.substring(pathname.lastIndexOf("/") + 1).split("?")[0];
      const fileExtension = fileName.split(".").pop()?.toLowerCase();

      // Find the corresponding MIME type from referencesFormats
      const format = Object.values(referencesFormats).find((format) =>
        format.extensions.includes(`.${fileExtension}`)
      );

      const type = format ? format.mime : "application/octet-stream"; // Default MIME type

      // List of supported image extensions for preview
      const imageExtensions = ["png", "jpg", "jpeg", "gif", "webp"];

      return {
        name: fileName,
        fileType: fileExtension || "unknown",
        type, // Use the MIME type from referencesFormats
        url: fileOrUrl,
        preview: imageExtensions.includes(fileExtension) ? fileOrUrl : null,
      };
    } catch (error) {
      console.error("Invalid URL format:", fileOrUrl);
      return null;
    }
  } else if (fileOrUrl instanceof File) {
    const fileName = `${Date.now()}_${fileOrUrl.name}`;
    const fileExtension = fileOrUrl.name.split(".").pop()?.toLowerCase();

    // Find the corresponding MIME type from referencesFormats
    const format = Object.values(referencesFormats).find((format) =>
      format.extensions.includes(`.${fileExtension}`)
    );

    const type = format ? format.mime : fileOrUrl.type || "application/octet-stream";

    return {
      fileName,
      fileType: fileExtension || "unknown",
      type, // Use the MIME type from referencesFormats or the File object's type
      file: fileOrUrl,
      preview: fileOrUrl.type.startsWith("image/") ? URL.createObjectURL(fileOrUrl) : null,
    };
  } else {
    throw new Error("Input must be a valid file or URL.");
  }
};

export default convertUploadedFile;