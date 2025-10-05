import React, { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { FiMinus } from "react-icons/fi";
import arrowUpImg from "../../assets/icons/arrow-up.png";
import arrowDownImg from "../../assets/icons/arrow-down.png";

const CustomTimePicker = ({
  onChange,
  onBlur,
  onFocus,
  outerContainerStyle = "",
  error,
  disabled = false,
  label,
  labelStyle,
  isRequired,
  id,
  pickerbuttonContainerStyle,
  selectedTime,
  name,
  allowFillColor = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState("AM");
  const [hourInputFocused, setHourInputFocused] = useState(false);
  const [minuteInputFocused, setMinuteInputFocused] = useState(false);
  const dropdownRef = useRef(null);
  const hourInputRef = useRef(null);
  const minuteInputRef = useRef(null);

  // Parse selectedTime when it changes
  useEffect(() => {
    if (selectedTime) {
      const timeRegex = /^(\d{1,2}):(\d{2})\s(AM|PM)$/;
      const match = selectedTime.match(timeRegex);
      
      if (match) {
        const [, hourStr, minuteStr, periodStr] = match;
        setHour(String(parseInt(hourStr)).padStart(2, "0"));
        setMinute(minuteStr);
        setPeriod(periodStr);
      }
    }
  }, [selectedTime]);

  const validateHour = (value) => {
    // Only allow 1-12
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 1 || numValue > 12) {
      return false;
    }
    return true;
  };

  const validateMinute = (value) => {
    // Only allow 0-59
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 0 || numValue > 59) {
      return false;
    }
    return true;
  };

  const handleHourChange = (increment) => {
    const newHour = parseInt(hour || "12");
    const updatedHour = increment
      ? newHour === 12
        ? "01"
        : String(newHour + 1).padStart(2, "0")
      : newHour === 1
      ? "12"
      : String(newHour - 1).padStart(2, "0");
    setHour(updatedHour);
    triggerOnChange(updatedHour, minute, period);
  };

  const handleMinuteChange = (increment) => {
    const newMinute = parseInt(minute || "0");
    const updatedMinute = increment
      ? newMinute === 59
        ? "00"
        : String(newMinute + 1).padStart(2, "0")
      : newMinute === 0
      ? "59"
      : String(newMinute - 1).padStart(2, "0");
    setMinute(updatedMinute);
    triggerOnChange(hour, updatedMinute, period);
  };

  const handleHourInputChange = (e) => {
    const inputValue = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    
    if (inputValue === '') {
      setHour('');
      return;
    }
    
    const numValue = parseInt(inputValue, 10);
    
    // If inputValue is 1 or 2, allow it temporarily without formatting
    if (inputValue.length === 1) {
      setHour(inputValue);
      return;
    }
  
    // Validate hour (1-12)
    if (numValue >= 1 && numValue <= 12) {
      const formattedHour = String(numValue).padStart(2, "0");
      setHour(formattedHour);
      triggerOnChange(formattedHour, minute, period);
    }
  };
  
  const handleMinuteInputChange = (e) => {
    const inputValue = e.target.value.replace(/\D/g, '');
    
    if (inputValue === '') {
      setMinute('');
      return;
    }
    
    const numValue = parseInt(inputValue, 10);

    // If inputValue is 1 to 5, allow it temporarily without formatting
    if (inputValue.length === 1) {
      setMinute(inputValue);
      return;
    }
    
    // Validate minute (0-59)
    if (numValue >= 0 && numValue <= 59) {
      const formattedMinute = String(numValue).padStart(2, "0");
      setMinute(formattedMinute);
      triggerOnChange(hour, formattedMinute, period);
    }
  };

  const handleHourInputBlur = () => {
    setHourInputFocused(false);
    
    // hour is valid when leaving the field
    if (hour === '' || !validateHour(hour)) {
      setHour("12");
      triggerOnChange("12", minute, period);
    } else {
      // Format to leading zero if needed
      const formattedHour = String(parseInt(hour)).padStart(2, "0");
      setHour(formattedHour);
      triggerOnChange(formattedHour, minute, period);
    }
  };

  const handleMinuteInputBlur = () => {
    setMinuteInputFocused(false);
    
    // minute is valid when leaving the field
    if (minute === '' || !validateMinute(minute)) {
      setMinute("00");
      triggerOnChange(hour, "00", period);
    } else {
      // Format to leading zero
      const formattedMinute = String(parseInt(minute)).padStart(2, "0");
      setMinute(formattedMinute);
      triggerOnChange(hour, formattedMinute, period);
    }
  };

  const togglePeriod = () => {
    const updatedPeriod = period === "AM" ? "PM" : "AM";
    setPeriod(updatedPeriod);
    triggerOnChange(hour, minute, updatedPeriod);
  };

  const triggerOnChange = (hour, minute, period) => {
    if (onChange) {
      const formattedHour = hour ? String(parseInt(hour)).padStart(2, "0") : "12";
      const formattedMinute = minute ? String(parseInt(minute)).padStart(2, "0") : "00";
      const formattedTime = `${formattedHour}:${formattedMinute} ${period}`;
      onChange(formattedTime);
    }
  };

  const handleClearTime = () => {
    setHour("12");
    setMinute("00");
    setPeriod("AM");
    if (onChange) {
      onChange("");
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen]);

  const TimeButton = ({ onClick, imageSrc }) => (
    <button
      onClick={onClick}
      className={`w-7 h-7 xl:w-9 xl:h-9 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={disabled}
    >
      <img src={imageSrc} alt="arrow" className="w-6 h-6" />
    </button>
  );

  const inputBorderClasses = disabled
    ? "border-medium-gray cursor-not-allowed"
    : error && !isOpen
    ? "border-light-red"
    : "border-medium-gray focus-within:border-light-blue-2";

  // Handle keyboard navigation
  const handleHourKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleHourChange(true);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleHourChange(false);
    } else if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      minuteInputRef.current.focus();
    }
  };

  const handleMinuteKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleMinuteChange(true);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleMinuteChange(false);
    }
  };

  return (
    <div
      className={twMerge("relative flex flex-col w-full", outerContainerStyle)}
      ref={dropdownRef}
    >
      {label && (
        <label
          htmlFor={id}
          className={twMerge(
            "text-light-gray mb-2 font-inter font-medium text-sm",
            labelStyle
          )}
        >
          {label} {isRequired && <span className="text-light-red">*</span>}
        </label>
      )}

      <button
        onClick={() => {
          !disabled && setIsOpen(!isOpen);
        }}
        onFocus={onFocus}
        onBlur={onBlur}
        className={twMerge(
          `w-full h-12 px-4 flex items-center justify-between bg-white rounded-lg border ${inputBorderClasses}
          ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
          ${
            allowFillColor && selectedTime
              ? "bg-[#E0F2F1] bg-opacity-[30%]"
              : ""
          }
          `,
          pickerbuttonContainerStyle
        )}
        disabled={disabled}
      >
        <span
          className={`font-inter text-level-6 font-medium text-content ${
            selectedTime ? "opacity-100" : "opacity-50"
          }`}
        >
          {selectedTime || "Select Time"}
        </span>
        <div className="flex items-center gap-1">
          {/* Clear Button */}
          {selectedTime && !disabled && (
            <div
              onClick={(event) => {
                event.stopPropagation();
                handleClearTime();
              }}
              className="flex items-center justify-center w-3 h-3 bg-red-100 rounded-full hover:bg-red-200"
            >
              <FiMinus className="w-3 h-3 text-red-500" />
            </div>
          )}

          <img
            src={isOpen ? arrowUpImg : arrowDownImg}
            alt="chevron"
            className="w-4 h-4"
          />
        </div>
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-10 top-full mt-0 w-full bg-white rounded-lg px-4 py-6 border border-[#CBD5E0] flex items-center justify-center shadow-lg">
          <div className="w-full max-w-[220px] sm:border-none p-2 sm:p-0 border border-gray-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-1 2xl:gap-4">
              {/* Hours */}
              <div className="flex flex-col items-center gap-2.5">
                <TimeButton
                  onClick={(event) => {
                    event.stopPropagation();
                    handleHourChange(true);
                  }}
                  imageSrc={arrowUpImg}
                />
                <input
                  ref={hourInputRef}
                  type="text"
                  value={hour}
                  onChange={handleHourInputChange}
                  onFocus={() => setHourInputFocused(true)}
                  onBlur={handleHourInputBlur}
                  onKeyDown={handleHourKeyDown}
                  className={`w-10 text-center text-content text-lg font-inter bg-transparent border ${
                    hourInputFocused ? 'border-light-blue-2' : 'border-transparent'
                  } rounded outline-none`}
                  maxLength={2}
                />
                <TimeButton
                  onClick={(event) => {
                    event.stopPropagation();
                    handleHourChange(false);
                  }}
                  imageSrc={arrowDownImg}
                />
              </div>

              <span className="self-center text-lg text-content font-inter">
                :
              </span>

              {/* Minutes */}
              <div className="flex flex-col items-center gap-2.5">
                <TimeButton
                  onClick={(event) => {
                    event.stopPropagation();
                    handleMinuteChange(true);
                  }}
                  imageSrc={arrowUpImg}
                />
                <input
                  ref={minuteInputRef}
                  type="text"
                  value={minute}
                  onChange={handleMinuteInputChange}
                  onFocus={() => setMinuteInputFocused(true)}
                  onBlur={handleMinuteInputBlur}
                  onKeyDown={handleMinuteKeyDown}
                  className={`w-10 text-center text-content text-lg font-inter bg-transparent border ${
                    minuteInputFocused ? 'border-light-blue-2' : 'border-transparent'
                  } rounded outline-none`}
                  maxLength={2}
                />
                <TimeButton
                  onClick={(event) => {
                    event.stopPropagation();
                    handleMinuteChange(false);
                  }}
                  imageSrc={arrowDownImg}
                />
              </div>
            </div>

            {/* AM/PM */}
            <button
              onClick={(event) => {
                event.stopPropagation();
                togglePeriod();
              }}
              className="flex items-center justify-center w-8 h-8 text-base rounded-full xl:w-9 xl:h-9 text-content xl:text-lg font-inter hover:bg-gray-100"
              disabled={disabled}
            >
              {period}
            </button>
          </div>
        </div>
      )}

      <div className="h-2">
        {error && !isOpen && (
          <span className="pl-3 text-light-red text-level-7 font-inter">
            {error}
          </span>
        )}
      </div>
    </div>
  );
};

export default CustomTimePicker;