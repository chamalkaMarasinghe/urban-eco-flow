import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { IoSearch } from "react-icons/io5";

const SearchBar = ({
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
  isVerify = false,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getBorderClasses = () => {
    // if (error) return "border-light-red";
    // if (isFocused) return "border-light-blue-2";
    if (value && value.length > 0) return "border-light-orange";
    // if (isVerify) return "border-yellow-400";
    return "border-[#CBD5E0]";
  };

  if (type === "textarea") {
    return (
      <div
        className={twMerge("flex flex-col gap-2 w-full", outerContainerStyle)}
      >
        {label && (
          <label
            htmlFor={id}
            className={twMerge(
              " text-light-gray font-inter font-medium text-sm",
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
            `w-full h-12 px-4 py-[13px] rounded-lg border text-sm placeholder:text-[#33415580] font-roboto focus:outline-none ${className}
            ${allowFillColor && value ? "bg-[#E0F2F1] bg-opacity-[30%]" : ""}
            ${getBorderClasses()}`,
            inputStyle
          )}
          {...rest}
        />
        {error && (
          <span className=" text-light-red text-text-level-10 pl-[2px] font-inter">
            {error}
          </span>
        )}
      </div>
    );
  } else {
    return (
      <div
        className={twMerge("flex flex-col gap-2 w-full", outerContainerStyle)}
      >
        {label && (
          <label
            htmlFor={id}
            className={twMerge(
              " text-light-gray font-inter font-normal text-sm",
              labelStyle
            )}
          >
            {label} {isRequired && <span className="text-light-red">*</span>}
          </label>
        )}
      
        <div className="relative">
          {(searchIcon || icon) && (
            <span className="absolute transform -translate-y-1/2 top-1/2 left-3">
              {icon ? icon : <IoSearch className="w-5 h-5 text-dark-gray" />}
            </span>
          )}
          <input
            id={id}
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            spellCheck="false"
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              setIsFocused(false);
              if (onBlur) onBlur(e);
            }}
            className={twMerge(
              `w-full h-12 ${searchIcon || icon ? 'pl-10 pr-4' : 'px-4'} rounded-md border text-sm placeholder:text-[#33415580] font-roboto focus:outline-none ${className} 
              ${allowFillColor && value ? "bg-[#E0F2F1] bg-opacity-[30%]" : ""}
              ${getBorderClasses()}`,
              inputStyle
            )}

            {...rest}
          />
          {/* {icon} */}
        </div>

        {error && (
          <span className=" text-light-red text-text-level-10 pl-[2px] font-inter">
            {error}
          </span>
        )}
      </div>
    );
  }
};

export default SearchBar;