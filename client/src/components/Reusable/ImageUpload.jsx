import React, { useState, useCallback, useEffect } from "react";
import { referencesFormats } from "../../constants/commonConstants";
import { useDropzone } from "react-dropzone";
import { Image } from "antd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { twMerge } from "tailwind-merge";
import { ClipLoader } from "react-spinners";
import DraggableFileItem from "./ImageUploader/DraggableFileItem";
import FileItem from "./ImageUploader/FileItem";
import UploadImg from "../../assets/svgs/Upload icon.svg"

const ImageUpload = ({
  label = "Upload Files",
  isRequired,
  labelStyle,
  outerContainerStyle = "",
  onFileUpload,
  isLoading = false,
  uploadText = "Jpeg, Jpg, png, pdf, doc, docx, zip files are allowed",
  dragText = "Drop your files here, or browse",
  numberOfFiles,
  accept = Object.values(referencesFormats),
  borderStyle = "border-dashed",
  isDisabled = false,
  maximumSize = 30,
  allowImageArrange = false,
  error,
  uploadFiles = [],
  allowRemove = true,
  isModel = false,
}) => {
  const [files, setFiles] = useState(uploadFiles || []);
  const [errorFiles, setErrorFiles] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setFiles(Array.isArray(uploadFiles) ? uploadFiles : []);
  }, [uploadFiles]);

  const moveFile = useCallback(
    (dragIndex, hoverIndex) => {
      if (!allowImageArrange) return;

      setFiles((prevFiles) => {
        const newFiles = [...prevFiles];
        const draggedFile = newFiles[dragIndex];
        newFiles.splice(dragIndex, 1);
        newFiles.splice(hoverIndex, 0, draggedFile);

        onFileUpload(newFiles);

        return newFiles;
      });
    },
    [allowImageArrange, onFileUpload]
  );

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      const oversizedFiles = acceptedFiles.filter(
        (file) => file.size > maximumSize * 1024 * 1024
      );

      let validFiles = acceptedFiles
        .filter((file) => file.size <= maximumSize * 1024 * 1024)
        .map((file) =>
          Object.assign(file, {
            preview: file.type.startsWith("image/")
              ? URL.createObjectURL(file)
              : null,
          })
        );

      // Ensure no duplicate files
      validFiles = validFiles.filter(
        (file) => !files.some((existingFile) => existingFile.name === file.name)
      );

      // all error messages
      const newErrorFiles = [
        ...oversizedFiles.map((f) => ({
          name: f.name,
          error: `File size exceeds ${maximumSize}MB limit`,
        })),
        ...rejectedFiles.map((f) => ({
          name: f.path,
          error: "Invalid file type",
        })),
      ];

      // Check total files and add upload limit error if needed
      if (files.length + validFiles.length > numberOfFiles) {
        validFiles = validFiles.slice(0, numberOfFiles - files.length);
        newErrorFiles.push({
          name: "Upload limit",
          error: `You can only upload up to ${numberOfFiles} files.`,
        });
      }

      setErrorFiles(newErrorFiles);

      setFiles((prev) => [...prev, ...validFiles]);
      onFileUpload([...files, ...validFiles]);
    },
    [maximumSize, numberOfFiles, files, onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: accept.reduce((acc, format) => {
      acc[format.mime] = format.extensions;
      return acc;
    }, {}),
    onDrop,
    disabled: isDisabled || isLoading,
  });

  const removeFile = useCallback(
    (fileToRemove) => {
      setFiles((prev) => {
        const newFiles = prev.filter((f) => f.name !== fileToRemove.name);
        onFileUpload(newFiles);
        return newFiles;
      });

      if (fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
    },
    [onFileUpload]
  );

  const groupedFiles = Array.isArray(files)
    ? files.reduce((acc, file) => {
        const type = file.type.startsWith("image/") ? "images" : "documents";
        if (!acc[type]) acc[type] = [];
        acc[type].push(file);
        return acc;
      }, {})
    : { images: [], documents: [] };

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className={twMerge("flex flex-col gap-2 w-full", outerContainerStyle)}
      >
        {label && (
          <label
            className={twMerge(
              " text-light-gray font-inter font-medium text-sm",
              labelStyle
            )}
          >
            {label} {isRequired && <span className="text-light-red">*</span>}
          </label>
        )}
        <div
          className={` ${
            isModel ? "lg:p-5 p-2" : "p-5 lg:p-10"
          } border border-light-blue rounded-lg`}
        >
          <div
            {...getRootProps()}
            className={`border-2 ${borderStyle} ${
              errorFiles.length > 0 ? "border-yellow-400" : error ? "border-light-red" : "border-gray-300"
            } rounded flex flex-col items-center justify-center ${
              isDisabled || isLoading ? " cursor-not-allowed" : "cursor-pointer"
            }
             ${
               isModel
                 ? " p-4 md:p-8 min-h-[100px] h-[180px] "
                 : " min-h-[194px] p-8 h-auto"
             } 
            `}
          >
            <input {...getInputProps()} />

            {isLoading ? (
              <div className="mb-4 ">
                <ClipLoader
                  loading={isLoading}
                  speedMultiplier={1}
                  size={24}
                  color="var(--primary-color)"
                />
              </div>
            ) : (
              <div className="relative ">
                <img
                  src={UploadImg}
                  alt="Upload"
                  className="w-[68px] h-[64px]"
                />
                <span className=" w-[22px] h-[22px] rounded-full bg-gray-400 text-[14px] font-inter text-white flex items-center justify-center absolute top-0 -right-1">
                  {uploadFiles.length || 0}
                </span>
              </div>
            )}
            <div className="text-center">
              <p className="text-[0.875rem] md:text-[1rem] font-semibold text-[#8E95A9] text-center font-open_sans mb-2">
                {dragText}
              </p>
              <p className="text-[0.875rem] md:text-[1rem] font-semibold text-[#8E95A9] text-center font-open_sans">
                {uploadText}
              </p>
              <p className="mt-3 text-sm font-semibold font-nonito_sans text-light-red">
                Maximum file size: {maximumSize}MB
              </p>
            </div>
          </div>

          {errorFiles.length > 0 && (
            <div className="p-2 mt-2 rounded bg-yellow-50">
              {errorFiles.map((file, index) => (
                <p key={index} className="text-sm text-yellow-700">
                  {file.name}: {file.error}
                </p>
              ))}
            </div>
          )}

          {error && (
            <span className="text-sm text-light-red font-nonito_sans">
              {error}
            </span>
          )}

          {groupedFiles.images && groupedFiles.images.length > 0 && (
            <div className="mt-4">
              <h3 className="text-[0.875rem] font-semibold font-nonito_sans text-gray-700 mb-2">
                Images{" "}
                {allowImageArrange && (
                  <span className="text-sm font-normal text-gray-500 font-nonito_sans">
                    (Drag to reorder)
                  </span>
                )}
              </h3>
              <Image.PreviewGroup
                preview={{
                  visible,
                  onVisibleChange: (vis) => setVisible(vis),
                }}
              >
                <div className="flex flex-col gap-2">
                  {groupedFiles.images.map((file, index) => (
                    <DraggableFileItem
                      key={file.name}
                      file={file}
                      index={index}
                      moveFile={moveFile}
                      onRemove={removeFile}
                      visible={visible}
                      setVisible={setVisible}
                      allowRemove={allowRemove}
                    />
                  ))}
                </div>
              </Image.PreviewGroup>
            </div>
          )}

          {groupedFiles.documents && groupedFiles.documents.length > 0 && (
            <div className="mt-4">
              <h3 className="text-[0.875rem] font-semibold font-nonito_sans text-gray-700 mb-2">
                Documents
              </h3>
              <div className="flex flex-col gap-2">
                {groupedFiles.documents.map((file) => (
                  <FileItem
                    key={file.name}
                    file={file}
                    onRemove={removeFile}
                    allowRemove={allowRemove}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default ImageUpload;

// Don't delete this commented code

// const ImageUpload = ({
//   label = "Upload Files",
//   isRequired,
//   labelStyle,
//   outerContainerStyle = "",
//   uploadFiles = [],
//   onFileUpload,
//   isLoading = false,
//   uploadText = "Jpeg, Jpg, png are allowed",
//   dragText = "Drop your image here, or browse",
//   error = "have an error",
//   accept = [referencesFormats.JPEG_JPG, referencesFormats.PNG], // Default to images
//   borderStyle = "border-dashed",
//   isDisabled = false,
//   maximumSize = '5MB',
//   allowImageArrange = false,
// }) => {
//   // Extract actual MIME types from selected references
//   const formattedAccept = accept.reduce((acc, format) => {
//     acc[format.mime] = format.extensions;
//     return acc;
//   }, {});

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     accept: formattedAccept,
//     onDrop: (acceptedFiles) => {
//       onFileUpload(acceptedFiles);
//     },
//     disabled: isDisabled,
//   });

//   return (
//     <div className={twMerge("flex flex-col gap-2 w-full", outerContainerStyle)}>
//       {label && (
//         <label
//           className={twMerge(
//             " text-light-gray font-inter font-medium text-sm",
//             labelStyle
//           )}
//         >
//           {label} {isRequired && <span className="text-light-red">*</span>}
//         </label>
//       )}
//       <div className="p-5 border rounded-lg lg:p-10 border-light-blue">
//         <div
//           aria-disabled={isLoading}
//           {...getRootProps()}
//           className={`border-2 ${borderStyle} ${
//             error ? "border-light-red" : "border-medium-gray"
//           } rounded p-8 min-h-[194px] flex flex-col items-center justify-center ${
//             isDisabled ? "opacity-50 cursor-not-allowed" : " cursor-pointer"
//           }`}
//         >
//           <input {...getInputProps()} />

//           {isLoading ? (
//             <div className="mb-4 ">
//               <ClipLoader
//                 loading={isLoading}
//                 speedMultiplier={1}
//                 size={24}
//                 color="var(--primary-color)"
//               />
//             </div>
//           ) : (
//             <div className="relative ">
//               <img
//                 src={UploadImg}
//                 alt="Upload"
//                 className="w-[68px] h-[64px] mb-4"
//               />
//               <span className=" w-[22px] h-[22px] rounded-full bg-gray-400 text-[14px] font-inter text-white flex items-center justify-center absolute top-0 -right-1">
//                 {uploadFiles.length || 0}
//               </span>
//             </div>
//           )}

//           <p className=" text-level-6 md:text-level-5 font-semibold text-[#8E95A9] text-center font-open_sans">
//             {dragText}
//           </p>
//           <p className=" text-level-6 md:text-level-5 font-semibold text-[#8E95A9] text-center font-open_sans">
//             {uploadText}
//           </p>

//           {/* {files.length > 0 && (
//           <div className="flex flex-wrap gap-4">
//             {files.map((file) => (
//               <img
//                 key={file.name}
//                 src={file.preview}
//                 alt={file.name}
//                 className="object-cover w-24 h-24 rounded"
//                 onLoad={() => {
//                   URL.revokeObjectURL(file.preview);
//                 }}
//               />
//             ))}
//           </div>
//         )} */}
//         </div>

//         {error && (
//           <span className="pl-3 text-light-red text-level-7 font-inter">
//             {error}
//           </span>
//         )}

//         {/* Uploaded Files: */}

//         <div className="flex flex-col w-full gap-2 mt-2 ">
//           <div className=" border border-light-blue rounded-lg p-1 h-[83px] flex w-full justify-between lg:pr-6 items-center flex-wrap gap-2">
//             <div className=" flex flex-row gap-[1.25rem] items-center">
//               <div className=" w-[123px] h-[73px] rounded-lg overflow-hidden">
//                 <img
//                   className="object-cover w-full h-full"
//                   src="https://images.unsplash.com/photo-1738447429433-69e3ecd0bdd0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8"
//                   alt=""
//                 />
//               </div>
//               <p className=" text-level-6 font-semibold text-[#8E95A9] text-center font-open_sans">
//                 image.jpg
//               </p>
//             </div>

//             <div className="flex flex-row items-center gap-2 ">
//               <div className=" w-[32px] h-[32px] rounded-md bg-[#DDE1E6] flex items-center justify-center">
//                 <PiEye className=" text-black text-[20px]" />
//               </div>
//               <div className=" w-[32px] h-[32px] rounded-md bg-[#F8E6E6] flex items-center justify-center">
//                 <HiTrash className=" text-[#C90303] text-[20px]" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// ImageUpload.defaultProps = {
//   style: {},
// };

// export default ImageUpload;
