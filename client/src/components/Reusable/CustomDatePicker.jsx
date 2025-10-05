import { twMerge } from "tailwind-merge";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { useState } from "react";

export default function CustomeDatePicker({
  id,
  label,
  placeholder,
  onChange,
  onBlur,
  value,
  isRequired = false,
  labelStyle,
  outerContainerStyle,
  inputStyle,
  pickerWidth = "100%",
  pickerHeight = "3rem",
  error,
  disabled = false,
  onFocus,
  allowFillColor = false,
  borderRadius = "8px",
}) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerIconClicked, setPickerIconClicked] = useState(false);

  // Handle real blur events
  const handleRealBlur = () => {
    if (!isPickerOpen && onBlur) {
      onBlur();
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={twMerge("flex flex-col  w-full", outerContainerStyle)}>
        {label && (
          <label
            htmlFor={id}
            className={twMerge(
              "text-light-gray font-inter mb-2 font-medium text-sm",
              labelStyle
            )}
          >
            {label} {isRequired && <span className="text-light-red">*</span>}
          </label>
        )}
        <div
          style={{
            width: pickerWidth,
            height: pickerHeight,
          }}
          className={
            disabled ? "cursor-not-allowed" : "bg-white cursor-pointer"
          }
          onBlur={onBlur}
          // onFocus={onFocus}
        >
          <DatePicker
            disabled={disabled}
            sx={{
              width: "100%",
              height: "100%",
              "& .MuiOutlinedInput-root": {
                width: "100%",
                height: "100%",
                "& input": {
                  width: "100%",
                },
                "& fieldset": {
                  borderWidth: "1px",
                  borderRadius: borderRadius,
                  borderColor: error ? "#C90303" : "#D1D5DB",
                  backgroundColor:
                    allowFillColor && value ? "rgba(224, 242, 241, 0.3)" : "",
                },
                "&:hover fieldset": {
                  borderColor: error ? "#C90303" : "#B9C1CA",
                },
                "&.Mui-focused fieldset": {
                  borderWidth: "1px",
                  borderColor: "#B9C1CA",
                },
              },
            }}
            slotProps={{
              popper: {
                sx: {
                  "& .MuiDateCalendar-root": {
                    backgroundColor: "white",
                    "& .MuiPickersDay-root": {
                      "&.Mui-selected": {
                        backgroundColor: "var(--primary-color)",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "var(--secondary-color)",
                        },
                      },
                      "& .font-size-12": {
                        fontSize: "12px",
                      },
                    },
                  },
                },
              },
              textField: {
                onBlur: handleRealBlur,
                onFocus: onFocus,
              },
            }}
            format="YYYY/MM/DD"
            value={value || null}
            onChange={onChange}
            onFocus={onFocus}
            onOpen={() => {
              setPickerIconClicked(true);
              setIsPickerOpen(true);
            }}
            onClose={() => {
              setPickerIconClicked(false);
              setIsPickerOpen(false);
            }}
          />
        </div>
        <div className="h-3">
          {!isPickerOpen && !pickerIconClicked && error && (
            <span className="text-light-red text-level-7 pl-3 font-inter">
              {error}
            </span>
          )}
        </div>
      </div>
    </LocalizationProvider>
  );
}
