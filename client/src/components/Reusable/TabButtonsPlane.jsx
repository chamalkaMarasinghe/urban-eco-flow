import React, { useState } from "react";
import { CLIENT_ORDERS_TABLE_TABS } from "../../constants/commonConstants";
import { twMerge } from "tailwind-merge";

const TabButtonPlane = ({ options = [], selectedOption = null, setSelectedOptions = () => {}, isDisabled = false }) => {
    
    return (
        <div className="flex w-full max-w-[1162px] h-auto">
            <div className="flex flex-row w-full border-b border-light-blue relative">
                {
                    options?.map((item, index) => {
                        return(
                            <>
                                <p
                                    className={twMerge(`flex justify-center items-center h-[100%] cursor-pointer lg:text-[16px] px-3 pt-1 text-[16px] text-dark-gray font-roboto font-medium relative capitalize ${
                                        selectedOption === item
                                            ? "text-[var(--primary-color)]"
                                            : ""
                                    }`, isDisabled ? "cursor-not-allowed text-gray-400" : "")}
                                    onClick={!isDisabled ? () => setSelectedOptions(item) : () => {}}
                                    key={index}
                                    
                                >
                                    {item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}
                                        {selectedOption === item && (
                                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--primary-color)]"></span>
                                    )}
                                </p>
                            </>
                        );
                    })
                }
            </div>
        </div>
    );
};

export default TabButtonPlane;
