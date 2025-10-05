import React from "react";
import { twMerge } from "tailwind-merge";
import { ClipLoader } from "react-spinners";

const Button = ({
  buttonText = "Button",
  bgColor = "bg-primary",
  textColor = "text-white",
  width = "w-full",
  height = "h-12",
  borderColor = "border-transparent",
  icon,
  iconPosition = "left",
  loading = false,
  pulse = false,
  className,
  textWeight = "font-bold",
  loaderColor = "var(--tertiary-color)",
  hoverEffect = "lighten", // scale, glow, slide, darken, lighten, border, none
  showTooltip = false,
  tooltipMessage = "",
  ...rest
}) => {

  const getHoverClasses = () => {
    if (rest.disabled) return "";

    switch (hoverEffect) {
      case "scale":
        return "hover:scale-105 active:scale-95";
      case "glow":
        return "hover:shadow-[0_0_15px_rgba(0,123,255,0.5)]";
      case "slide":
        return "relative overflow-hidden before:absolute before:content-[''] before:top-0 before:left-0 before:w-full before:h-full before:bg-white before:opacity-0 before:transition-opacity hover:before:opacity-20";
      case "darken":
        return "hover:brightness-90";
      case "lighten":
        return "hover:brightness-110";
      case "border":
        return "hover:border-2";
      case "none":
        return "";
      default:
        return "hover:scale-105 active:scale-95";
    }
  };

  if (pulse) {
    return (
      <div
        className={twMerge(
          `flex items-center justify-center border gap-2 rounded-xl font-medium focus:outline-none`,
          bgColor,
          textColor,
          width,
          height,
          borderColor,
          className,
          "border-none bg-slate-300 animate-pulse text-transparent"
        )}
      >
        Loading
      </div>
    );
  }

  return (
    <button
      className={twMerge(
        `flex items-center justify-center border gap-2 rounded-xl font-medium focus:outline-none transition-all duration-300 ease-in-out`,
        bgColor,
        textColor,
        width,
        height,
        borderColor,
        getHoverClasses(),
        className,
        rest.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      )}
      {...rest}
    >
      {loading ? (
        <ClipLoader size={18} color={loaderColor} />
      ) : (
        <>
          {icon && iconPosition === "left" && icon}
          <span className={textWeight}>{buttonText}</span>
          {icon && iconPosition === "right" && icon}
        </>
      )}
    </button>
  );
};

export default Button;