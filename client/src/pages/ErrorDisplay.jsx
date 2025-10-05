import React from 'react';
import PropTypes from 'prop-types';

const ErrorDisplay = ({
  errorMessage = 'An error occurred',
  buttonText = 'Try Again',
  onButtonClick,
  showIcon = true,
}) => {
  return (
    <div className="flex flex-col items-center justify-center px-6 mt-[12px] py-6 md:py-12 bg-white rounded-lg border border-[#DDE1E6]">
      <div className="flex flex-col items-center gap-4 mb-5">
        {showIcon && (
          <div className="text-light-red flex-shrink-0">
            <svg 
              xmlns="http://www.w3.org/2000/svg"
              width="40" 
              height="40" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
        )}
        <div className="text-center md:text-left max-w-md break-words">
          <p className="text-light-red font-inter text-center">{errorMessage}</p>
        </div>
      </div>
      {onButtonClick && (
        <button 
          type='button'
          onClick={onButtonClick}
          className="h-[40px] w-full md:w-[300px] bg-primary text-tertiary font-inter font-semibold rounded-[8px] transition-colors duration-300"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

ErrorDisplay.propTypes = {
  errorMessage: PropTypes.string,
  buttonText: PropTypes.string,
  onButtonClick: PropTypes.func,
  showIcon: PropTypes.bool,
};

export default ErrorDisplay;