import React, { useState } from "react";
import { DatePicker } from "antd";
import { twMerge } from "tailwind-merge";
import moment from "moment/moment";

const { RangePicker } = DatePicker;

const DateRangePicker = ({
  id,
  name,
  label,
  placeholder = ["Start date", "End date"],
  value,
  onChange,
  onBlur,
  isRequired,
  labelStyle,
  inputStyle,
  error,
  className = "",
  outerContainerStyle = "",
  disabled,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getBorderClasses = () => {
    if (error) return "border-light-red";
    if (isFocused) return "border-light-blue-2";
    return "border-medium-gray";
  };

  const handleChange = (dates) => {
    if (onChange) {
      // Format selected dates to 'YYYY-MM-DD'
      const formattedDates = dates
        ? [dates[0]?.format("YYYY-MM-DD"), dates[1]?.format("YYYY-MM-DD")]
        : [null, null];
      onChange(formattedDates);
    }
  };

  // Convert value to moment objects if they are in 'YYYY-MM-DD' format
  const momentValue =
    value && value[0] && value[1]
      ? [moment(value[0], "YYYY-MM-DD"), moment(value[1], "YYYY-MM-DD")]
      : null;

  return (
    <div className={twMerge("flex flex-col gap-2 w-full", outerContainerStyle)}>
      {label && (
        <label
          htmlFor={id}
          className={twMerge(
            "text-light-gray font-inter font-medium text-sm",
            labelStyle
          )}
        >
          {label} {isRequired && <span className="text-light-red">*</span>}
        </label>
      )}
      <div className="relative">
        <RangePicker
          id={id}
          name={name}
          placeholder={placeholder}
          value={momentValue}
          onChange={handleChange}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            if (onBlur) onBlur(e);
          }}
          className={twMerge(
            `w-full h-10 px-4 rounded-[6px] border border-stroke hover:border-stroke focus:border-primary text-sm placeholder:text-content placeholder:text-opacity-50 font-inter focus:outline-none ${className} ${getBorderClasses()}`,
            inputStyle
          )}
        />
      </div>
      {error && (
        <span className="text-light-red text-level-10 pl-3 font-inter">
          {error}
        </span>
      )}
    </div>
  );
};

export default DateRangePicker;
