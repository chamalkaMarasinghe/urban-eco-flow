import React from 'react'

function TagButton(Props) {
  return (
    <>
        <div className="bg-[#FAFAFA] border-[1px] rounded-[20px] px-[20px] py-[12px] border-light-blue flex justify-center items-center text-[12px] font-inter text-[#404145] font-normal ">
            {Props.title}
        </div>
    </>
  )
}

export default TagButton
