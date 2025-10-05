import React from "react";
import { twMerge } from "tailwind-merge";
const CustomInput = ({
  label,
  id,
  isRequired,
  placeholder,
  containerStyle,
  labelStyle,
  inputStyle,
  className,
  onChange,
  onBlur,
  error,
  icon,
  type = "text",
  ...props
}) => (
  <div className={twMerge("flex flex-col gap-3", containerStyle)}>
    <label htmlFor={id} className="text-base font-medium text-dark font-inter">
      {label} {isRequired && <span className=" text-light-red">*</span>}
    </label>
    <div className="relative">
      <input
        {...props}
        type={type}
        id={id}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full h-[54px] px-3 rounded-xl border border-gray-300 bg-[#e0f2f14d] text-content"
      />
      {icon}
    </div>
  </div>
);

export default CustomInput;
