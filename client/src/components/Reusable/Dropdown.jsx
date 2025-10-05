import React, { useState, useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import ArrowDownIcon from "../../assets/icons/arrow-down.png";
import ArrowUpIcon from "../../assets/icons/arrow-up.png";
import { FiMinus } from "react-icons/fi";

const DropDownNew = ({
                       options = [],
                       placeholder = "Select an option",
                       defaultOption = null,
                       displayKey = "name", // Key for displaying the option
                       idKey = "_id", // Key for the unique option identifier
                       isSearchable = false,
                       disabled = false,
                       wrapperClassName = "",
                       buttonClassName = "",
                       dropdownClassName = "",
                       optionClassName = "",
                       filterClassName = "",
                       outerContainerStyle = "",
                       onSelect,
                       error,
                       label,
                       labelStyle,
                       isRequired = false,
                       name,
                       onBlur,
                       onFocus,
                       allowFillColor = false,
                       isForm = false,
                       showArrow = true,
                       icon = null,
                       iconPosition = "right",
                       changePlaceholder = false,
                     }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState(defaultOption);
  const [hasBlurred, setHasBlurred] = useState(false);
  const [arrowLoaded, setArrowLoaded] = useState(false);

  // Add ref to track if an option was just selected
  const justSelectedRef = useRef(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Only close dropdown if it's open
        if (isOpen) {
          setIsOpen(false);
          // Only trigger blur validation if no option was just selected
          if (!justSelectedRef.current && hasBlurred && name && onBlur) {
            onBlur(name, selectedOption ? getDisplayValue(selectedOption) : "");
          }
          // Reset the flag after a short delay
          setTimeout(() => {
            justSelectedRef.current = false;
          }, 100);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, hasBlurred, name, onBlur, selectedOption]);

  const handleSelect = (option) => {
    // Set flag to indicate an option was just selected
    justSelectedRef.current = true;

    setSelectedOption(option);
    setSearchTerm("");
    setIsOpen(false);

    // Call onSelect immediately
    if (onSelect) {
      onSelect(option);
    }

    // Trigger form validation with selected option
    if (name && onBlur) {
      // Use a slight delay to ensure state updates are processed
      setTimeout(() => {
        onBlur(name, option ? getDisplayValue(option) : "");
      }, 0);
    }
  };

  const handleBlur = () => {
    // Only trigger blur validation if we're not in the middle of selecting
    if (name && onBlur && !justSelectedRef.current) {
      onBlur(name, selectedOption ? getDisplayValue(selectedOption) : "");
    }
  };

  const handleButtonClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (onFocus) {
        onFocus();
      }
      setHasBlurred(true);
    }
  };

  // Update selectedOption when defaultOption changes
  useEffect(() => {
    setSelectedOption(defaultOption);
  }, [defaultOption]);

  const getDisplayValue = (option) => {
    if (!option) return "";
    if (displayKey?.includes("+")) {
      // Handle key combination (e.g., "firstName + lastName")
      const keys = displayKey.split("+").map((key) => key.trim());
      return keys.map((key) => option[key]).join(" ");
    }
    return option[displayKey] || "";
  };

  const filteredOptions = options.filter((option) =>
      getDisplayValue(option).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRemoveSelected = () => {
    justSelectedRef.current = true; // Prevent blur validation
    setSelectedOption(null);

    if (onSelect) {
      onSelect(null);
    }

    // Trigger validation when clearing selection
    if (name && onBlur) {
      setTimeout(() => {
        onBlur(name, "");
        justSelectedRef.current = false;
      }, 0);
    }
  };

  return (
      <div className={twMerge("flex flex-col gap-2 w-full", outerContainerStyle)}>
        {label && !isForm && (
            <label
                className={twMerge(
                    "text-light-gray font-inter font-medium text-sm",
                    labelStyle
                )}
            >
              {label} {isRequired && <span className="text-light-red">*</span>}
            </label>
        )}
        <div ref={dropdownRef} className={`relative ${wrapperClassName}`}>
          <button
              onClick={handleButtonClick}
              onBlur={() => {
                // Only trigger blur if dropdown is closed and no recent selection
                if (!isOpen && hasBlurred && !justSelectedRef.current) {
                  handleBlur();
                }
              }}
              className={`w-full flex items-center border border-[#CBD5E0] justify-between px-2 py-[10px] rounded-md text-sm placeholder:text-content placeholder:text-opacity-50 font-inter focus:outline-none ${
                  disabled ? "cursor-not-allowed" : "bg-white cursor-pointer"
              } ${
                  error
                      ? "border-light-red"
                      : "border-medium-gray focus:border-light-blue-2"
              } ${buttonClassName} ${
                  allowFillColor && selectedOption
                      ? "bg-[#E0F2F1] bg-opacity-[30%]"
                      : ""
              } `}
          >
            {/* Label inside the border when isForm is true */}
            {label && isForm && (
                <label
                    className={twMerge(
                        "absolute text-level-6 font-roboto text-light-gray font-medium -top-2.5 left-3 px-1 bg-white",
                        labelStyle
                    )}
                >
                  {label} {isRequired && <span className="text-light-red">*</span>}
                </label>
            )}

            <div className="relative">
              {icon && (
                  <span className="absolute left-0 transform -translate-y-1/2 top-1/2">
                {icon}
              </span>
              )}
              <span
                  className={`text-level-6 font-roboto font-normal block truncate ${
                      selectedOption ? "text-[#334155] font-medium" : "text-[#33415580]"
                  } ${icon ? 'pl-6 pr-4' : 'px-2'}`}
                  title={
                    typeof selectedOption === "object" && selectedOption !== null
                        ? getDisplayValue(selectedOption)
                        : selectedOption || placeholder || "Select an option"
                  } // Tooltip on hover
              >
              {typeof selectedOption === "object" && selectedOption !== null
                  ? getDisplayValue(selectedOption)
                  : selectedOption || placeholder || "Select an option"}
            </span>
            </div>

            <div className="flex items-center gap-2">
              {selectedOption && !disabled && (
                  <div
                      onClick={(event) => {
                        event.stopPropagation(); // Prevent click event from propagating to the parent button
                        handleRemoveSelected();
                      }}
                      className="flex items-center justify-center w-4 h-4 bg-red-100 rounded-full cursor-pointer hover:bg-red-200"
                  >
                    <FiMinus className="w-3 h-3 text-red-500" />
                  </div>
              )}
              {showArrow && (
                  <div className={twMerge(
                      "relative w-4 h-4",
                      arrowLoaded ? "bg-transparent" : "bg-gray-100"
                  )}>
                    <LazyLoadImage
                        src={isOpen ? ArrowUpIcon : ArrowDownIcon}
                        placeholderSrc={isOpen ? ArrowUpIcon : ArrowDownIcon}
                        alt="arrow"
                        className="w-4 h-4"
                        effect="blur"
                        onLoad={() => setArrowLoaded(true)}
                    />
                  </div>
              )}
            </div>
          </button>

          {isOpen && (
              <div
                  className={`absolute w-full rounded-md px-2 py-2 mt-[2px] bg-white border z-[99] ${dropdownClassName}`}
              >
                {isSearchable && (
                    <div className="p-2 mb-1 border-b">
                      <input
                          type="text"
                          placeholder="Search..."
                          className="w-full px-3 py-2 border rounded outline-none "
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                )}

                <div
                    className={twMerge`max-h-[200px] overflow-y-auto scrollbar-no-radius pr-2 ${filterClassName}`}
                >
                  {filteredOptions.map((option) => {
                    const isSelected =
                        selectedOption && option[idKey] === selectedOption[idKey];

                    return (
                        <div
                            key={option[idKey]}
                            onClick={() => handleSelect(option)}
                            className={twMerge(
                                "px-4 py-2 cursor-pointer rounded-md",
                                optionClassName,
                                isSelected ? "bg-gray-50" : "hover:bg-gray-100"
                            )}
                            style={isSelected ? { border: "1px solid #DDE1E666" } : {}}
                            title={getDisplayValue(option)} // Tooltip on hover
                        >
                    <span
                        className={`font-roboto text-level-6 text-light-gray block truncate ${
                            isSelected ? "font-medium" : "font-semibold"
                        }`}
                    >
                      {getDisplayValue(option)}
                    </span>
                        </div>
                    );
                  })}

                  {filteredOptions.length === 0 && (
                      <div className="px-4 py-2 font-medium text-center text-gray-500 font-inter">
                        No results found
                      </div>
                  )}
                </div>
              </div>
          )}
          <div className="h-3 flex items-start justify-start">
            {error && (
                <span className="text-light-red text-level-7 pt-[2px] font-inter">
                  {error}
              </span>
            )}
          </div>
        </div>
      </div>
  );
};

export default DropDownNew;
