import React, { useState } from "react";
import { useLanguage } from "../../context/language/language";
import { stringTemplates } from "../../config/Static_content_Client";

const HeroSearchBar = ({
  searchTerm = "",
  setSearchTerm = () => {},
  handleSearch = () => {},
}) => {

  const {language} = useLanguage();

  return (
    <div className="w-full max-w-4xl mx-auto border-[3px] rounded-[10px] border-[#FFFFFF]">
      <div className="flex items-center">
        <div className="flex items-center justify-between w-full bg-[#00000066] bg-opacity-70 rounded-[10px]">
          <input
            type="text"
            placeholder="Search for events, activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-[600px] h-11 sm:h-[55px] py-2 px-4 bg-transparent font-normal font-roboto text-[13px] sm:text-[16px] md:text-[16px] text-[#FFFFFF] capitalize focus:outline-none placeholder:text-[#FFFFFF] placeholder:font-normal placeholder:font-roboto"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch(searchTerm);
              }
            }}
          />
          <button
            onClick={() => {
              handleSearch(searchTerm);
            }}
            className="w-24 sm:w-28 md:w-[114px] h-9 sm:h-[45px] flex items-center justify-center mr-[5px] bg-white rounded-[5px] font-semibold text-black font-roboto text-[13px] sm:text-[16px] md:text-[16px]"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSearchBar;