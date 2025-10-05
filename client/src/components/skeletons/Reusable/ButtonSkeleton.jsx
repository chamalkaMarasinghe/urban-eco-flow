import React from 'react';

export const ButtonSkeleton = ({ width = "w-24" }) => {
    return (
        <div className={`animate-pulse h-8 rounded-md ${width} md:h-9 md:w-[85px] lg:h-10 lg:w-28 bg-slate-300`}></div>
    );
};