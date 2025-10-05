import React, { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import arrowDownImg from "../../assets/icons/arrow-down.png";
import { IoClose } from "react-icons/io5";
import { FiCheck } from "react-icons/fi";

const MultiSelectDropdown = ({
  options = [],
  wrapperClassName = "",
  defaultSelected = [],
  isSearchable = false,
  label,
  labelStyle,
  error,
  isDisabled = false,
  filterClassName,
  dropdownClassName,
  outerContainerStyle = "",
  isRequired = false,
  idKey = "_id",
  displayKey = "name",
  placeholder = "Select an option",
  onSelect,
  onFocus,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOptions, setSelectedOptions] = useState(defaultSelected);
  const multiSelectDropdownRef = useRef(null);
  const [displayedOptions, setDisplayedOptions] = useState([]);
  const [hiddenCount, setHiddenCount] = useState(0);
  const containerRef = useRef(null);
  const chipRefs = useRef([]);

  useEffect(() => {
    setSelectedOptions(defaultSelected);
  }, [defaultSelected]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        multiSelectDropdownRef.current &&
        !multiSelectDropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate which options can be displayed
  useEffect(() => {
    const calculateVisibleOptions = () => {
      if (!containerRef.current || selectedOptions.length === 0) {
        setDisplayedOptions([]);
        setHiddenCount(0);
        return;
      }

      const containerWidth = containerRef.current.offsetWidth;
      const padding = 32; // Container padding
      const moreTextWidth = 80; // Width for "+X more" text
      const spacing = 8; // Gap between chips
      let availableWidth = containerWidth - padding;
      let visibleOptions = [];
      let hidden = 0;

      // Try to fit each option
      for (let i = 0; i < selectedOptions.length; i++) {
        const option = selectedOptions[i];
        const chipRef = chipRefs.current[option[idKey]];

        if (!chipRef) {
          // If we can't measure the chip yet, we'll measure it in the next render
          visibleOptions.push(option);
          continue;
        }

        const chipWidth = chipRef.offsetWidth + spacing;

        // Check if we need space for "+X more" text
        const needsMoreText = i < selectedOptions.length - 1;
        const widthNeeded = chipWidth + (needsMoreText ? moreTextWidth : 0);

        if (availableWidth - widthNeeded >= 0) {
          visibleOptions.push(option);
          availableWidth -= chipWidth;
        } else {
          hidden = selectedOptions.length - visibleOptions.length;
          break;
        }
      }

      setDisplayedOptions(visibleOptions);
      setHiddenCount(hidden);
    };

    // Initial calculation
    calculateVisibleOptions();

    // Recalculate on window resize
    window.addEventListener("resize", calculateVisibleOptions);

    return () => window.removeEventListener("resize", calculateVisibleOptions);
  }, [selectedOptions, idKey]);

  const handleOptionClick = (option) => {
    if (isDisabled) return;

    setSelectedOptions((prevSelected) => {
      const updatedSelected = prevSelected.includes(option)
        ? prevSelected.filter((item) => item !== option)
        : [...prevSelected, option];

      onSelect && onSelect(updatedSelected);
      return updatedSelected;
    });
  };

  const filteredOptions = options.filter((option) => {
    const displayValue = option[displayKey];
    return (
      displayValue &&
      typeof displayValue === "string" &&
      displayValue.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className={twMerge("flex flex-col gap-2 w-full", outerContainerStyle)}>
      {label && (
        <label
          className={twMerge(
            "text-light-gray font-inter font-medium text-sm",
            labelStyle
          )}
        >
          {label} {isRequired && <span className="text-light-red">*</span>}
        </label>
      )}
      <div
        ref={multiSelectDropdownRef}
        className={twMerge("relative w-full h-12", wrapperClassName)}
      >
        {/* Dropdown Header */}
        <div
          onClick={() => !isDisabled && setIsOpen(!isOpen)}
          className={`w-full px-4 p-[9px] h-full border  ${
            error
              ? "border-light-red"
              : "border-medium-gray focus:border-light-blue-2"
          } rounded-lg bg-white flex justify-between items-center ${
            isDisabled ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          onFocus={onFocus}
        >
          <div className="flex-1 overflow-hidden" ref={containerRef}>
            <div className="flex truncate gap-2">
              {selectedOptions.length === 0 ? (
                <span className="font-inter text-level-6 font-medium text-content opacity-50">
                  {placeholder || "Select Options"}
                </span>
              ) : (
                <>
                  {displayedOptions.map((option) => (
                    <span
                      key={option[idKey]}
                      ref={(el) => (chipRefs.current[option[idKey]] = el)}
                      title={option[displayKey]}
                      className="bg-gray-200 font-inter text-[0.875rem] truncate text-gray-700 w-[108px] h-[30px] rounded flex items-center justify-between px-2 overflow-hidden"
                    >
                      <span className="truncate max-w-[80px] whitespace-nowrap overflow-hidden text-ellipsis">
                        {option[displayKey]}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOptionClick(option);
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <IoClose size={16} className="text-content" />
                      </button>
                    </span>
                  ))}
                  {hiddenCount > 0 && (
                    <span className="text-gray-500">+{hiddenCount} more</span>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <img
              src={arrowDownImg}
              alt="chevron"
              className={`w-4 h-4 transition-transform ${
                isOpen ? "transform rotate-180" : ""
              }`}
            />
          </div>
        </div>

        {/* Dropdown List */}
        {isOpen && (
          <div
            className={`absolute w-full px-4 py-2 mt-2 rounded-md bg-white border z-10 ${dropdownClassName}`}
          >
            {isSearchable && (
              <div className="p-2 border-b mb-1">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-3 py-2 border rounded outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}

            <div
              className={twMerge`max-h-[190px] overflow-y-auto scrollbar-no-radius ${filterClassName}`}
            >
              {filteredOptions.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className={`flex items-center p-4 py-[10px] gap-2 mb-1 cursor-pointer ${
                    isDisabled
                      ? "cursor-not-allowed"
                      : selectedOptions.includes(option)
                      ? "bg-gray-100"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {/* Custom Checkbox */}
                  <input
                    type="checkbox"
                    id={`checkbox-${index}`} // Unique ID
                    checked={selectedOptions.includes(option)}
                    onChange={() => handleOptionClick(option)}
                    readOnly
                    className="peer hidden" // Hide default checkbox
                    disabled={isDisabled}
                  />

                  {/* Custom Label Checkbox with React Icon */}
                  <label
                    htmlFor={`checkbox-${index}`}
                    className="w-4 h-4 flex items-center justify-center rounded-[4px] border border-[#CFD9E0] cursor-pointer 
                 peer-checked:bg-primary peer-checked:border-primary transition duration-200"
                  >
                    {selectedOptions.includes(option) && (
                      <FiCheck className="text-tertiary text-[13px] font-bold" />
                    )}
                  </label>

                  {/* Option Text */}
                  <label
                    title={option[displayKey]}
                    htmlFor={`checkbox-${index}`}
                    className="text-content font-inter text-[0.875rem] font-normal cursor-pointer truncate"
                  >
                    {option[displayKey]}
                  </label>
                </div>
              ))}
              {filteredOptions.length === 0 && (
                <div className="px-4 py-2 text-gray-500 text-center">
                  No results found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {error && (
        <span className=" text-light-red text-level-7 pl-3 font-inter">
          {error}
        </span>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
