import React from "react";
import { HiTrash } from "react-icons/hi2";
import { useDrag, useDrop } from "react-dnd";
import { Image } from "antd";

const DraggableFileItem = ({
                             file,
                             index,
                             moveFile,
                             onRemove,
                             visible,
                             setVisible,
                             allowRemove,
                             allowImageArrange = true, // Add this prop with default value
                           }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: "IMAGE",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => allowImageArrange, // Function that returns boolean
  });

  const [, dropRef] = useDrop({
    accept: "IMAGE",
    hover: (item) => {
      if (!allowImageArrange) return; // Don't allow hover/drop when arrangement is disabled

      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveFile(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    canDrop: () => allowImageArrange, // Function that returns boolean
  });

  return (
      <div
          ref={allowImageArrange ? (node) => dragRef(dropRef(node)) : null} // Only attach drag/drop refs when arrangement is allowed
          className={`
        border border-light-blue rounded-lg 
        p-1 pr-2 md:pr-6 
        h-auto sm:h-20 
        flex 
        w-full 
        justify-between 
        items-start sm:items-center 
        flex-wrap
        ${allowImageArrange ? 'cursor-move' : 'cursor-default'} 
        relative
        ${isDragging && allowImageArrange ? "opacity-50 bg-gray-100" : ""}
      `}
      >
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 items-start sm:items-center w-full sm:w-auto">
          <div className="w-full sm:w-28 h-16 rounded-lg overflow-hidden">
            <Image
                src={
                    file?.preview ||
                    "https://tilerstalk.co.uk/wp-content/themes/newscrunch/assets/images/no-preview.jpg"
                }
                alt={file?.name}
                onClick={() => setVisible(true)}
                className="w-full h-full object-cover"
            />
          </div>
          <div className=" flex items-center gap-1">
            <p
                title={file?.name}
                className="text-sm font-semibold max-w-40 sm:max-w-[7.5rem] md:w-[12.5rem] truncate block text-gray-600"
            >
              {file?.name}
            </p>
            {file?.size && (
                <span className="text-sm font-semibold text-gray-600 whitespace-nowrap">
              ({(file.size / (1024 * 1024)).toFixed(2)}MB)
            </span>
            )}
          </div>
        </div>

        <div className="absolute sm:relative right-2 top-1 sm:top-aut">
          {allowRemove && (
              <div
                  className=" w-7 h-7 md:w-8 md:h-8 border border-red-300 sm:border-none rounded-md bg-red-100 flex items-center justify-center cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
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

export default DraggableFileItem;
