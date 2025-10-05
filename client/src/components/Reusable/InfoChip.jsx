import React from 'react';
import { IoRepeatOutline } from "react-icons/io5";


const InfoChip = ({icon: Icon, label, value, recurring}) => {
  return (
    <div className='flex items-center gap-1 h-7 sm:h-9 rounded-[4px] pt-1.5 pr-2 pb-1.5 pl-2 bg-[#FFF7ED] '>
      {Icon && <Icon className="md:w-6 md:h-6 md:mb-1 text-light-gray " />}
      <span className="font-medium text-light-gray font-sf_pro text-level-7 xs:text-level-6">{`${label}:`}</span>
      {value &&
        <span className="text-deep-gray font-normal text-level-7 xs:text-level-6 font-sf_pro">  
          {value}
        </span>}
        {recurring && <IoRepeatOutline className='text-primary md:w-6 md:h-6 ml-2 sm:w-5 sm:h-5'/>}
    </div>
  )
}

export default InfoChip
