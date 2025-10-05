import { twMerge } from "tailwind-merge";
// import NotFoundIcons from "../constants/NotFoundIcons";

const NotFound = ({
    message = "No Data Found",
    textSize = "text-base",
    iconSize = 64,
    iconType = "default", // 'default', 'emptyData', 'noResults', 'noReviews'
    containerClassName = "",
    messageClassName = "",
    containerHeight = "h-[200px]",
}) => {
    // Select the appropriate icon based on iconType prop
    const renderIcon = () => {
        // const iconFn = NotFoundIcons[iconType] || NotFoundIcons.default;
        // return iconFn(iconSize);
    };

    return (
        <div
            className={twMerge(
                `flex flex-col items-center justify-center ${containerHeight}`,
                containerClassName
            )}
        >
            <div className="mb-2">{renderIcon()}</div>

            <p
                className={twMerge(
                    `font-medium ${textSize} text-gray-700 font-inter`,
                    messageClassName
                )}
            >
                {message}
            </p>
        </div>
    );
};

export default NotFound;
