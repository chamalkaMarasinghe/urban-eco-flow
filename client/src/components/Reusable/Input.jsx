import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import searchIconImg from "../../assets/icons/search-icon.png";

const Input = ({
  id,
  name,
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  onBlur,
  isRequired,
  labelStyle,
  inputStyle,
  error,
  className = "",
  outerContainerStyle = "",
  searchIcon = false,
  icon,
  allowFillColor = false,
  disabled,
  isFilterSearch = false,
  inlineCheckbox = false,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getBorderClasses = () => {
    if (error) return "border-light-red";
    if (isFocused) return "border-gray-300";
    return "";
  };

  // Special handling for inline checkbox
  if (type === "checkbox" && inlineCheckbox) {
    return (
      <div className={twMerge("flex items-center gap-2", outerContainerStyle)}>
        <input
          id={id}
          type={type}
          name={name}
          checked={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            if (onBlur) onBlur(e);
          }}
          className={twMerge(
            "h-4 w-4 accent-primary",
            className
          )}
          {...rest}
        />
        {label && (
          <label
            htmlFor={id}
            className={twMerge(
              "font-inter font-medium text-sm text-light-gray",
              labelStyle
            )}
          >
            {label} {isRequired && <span className="text-light-red">*</span>}
          </label>
        )}
        {!isFilterSearch && error && (
          <span className="text-light-red text-level-7 font-inter ml-2">
            {error}
          </span>
        )}
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div className={twMerge("flex flex-col  w-full", outerContainerStyle)}>
        {label && (
          <label
            htmlFor={id}
            className={twMerge(
              " text-light-gray font-inter font-medium text-sm mb-2",
              labelStyle
            )}
          >
            {label} {isRequired && <span className="text-light-red">*</span>}
          </label>
        )}
        <textarea
          id={id}
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            if (onBlur) onBlur(e);
          }}
          className={twMerge(
            `w-full h-12 px-4 py-[13px] rounded-lg border text-sm placeholder:text-content placeholder:text-opacity-50 font-inter focus:outline-none ${className}
            ${allowFillColor && value ? "bg-[#E0F2F1] bg-opacity-[30%]" : ""}
            ${getBorderClasses()}`,
            inputStyle
          )}
          {...rest}
        />
        {!isFilterSearch && (
          <div className="h-3 flex items-start justify-start  ">
            {error && (
              <span className=" text-light-red text-level-7 pl-2 font-inter">
                {error}
              </span>
            )}
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className={twMerge("flex flex-col w-full", outerContainerStyle)}>
        {label && (
          <label
            htmlFor={id}
            className={twMerge(
              " text-light-gray font-inter font-medium  mb-2 text-sm",
              labelStyle
            )}
          >
            {label} {isRequired && <span className="text-light-red">*</span>}
          </label>
        )}
        <div className="relative">
          {searchIcon && (
            <img
              src={searchIconImg}
              alt="search"
              className="absolute top-1/2 left-3 w-5 h-5 transform -translate-y-1/2"
            />
          )}
          <input
            id={id}
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              setIsFocused(false);
              if (onBlur) onBlur(e);
            }}
            className={twMerge(
              `w-full h-12 px-4 rounded-lg border text-sm placeholder:text-content placeholder:text-opacity-50 font-inter focus:outline-none ${className} 
              ${allowFillColor && value ? "bg-[#E0F2F1] bg-opacity-[30%]" : ""}
              ${getBorderClasses()} focus:border-gray-400`,
              inputStyle
            )}
            {...rest}
          />
          {icon}
        </div>

        {!isFilterSearch && (
          <div className="h-3 flex items-start justify-start sm:mb-0 mb-1">
            {error && (
              <span className="text-light-red text-level-7 pl-0 pt-[2px] font-inter">
                {error}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
};

export default Input;
