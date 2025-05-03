import React from 'react';
import { AnimatedIcon } from './';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
}

// Step icons and descriptions
const STEP_INFO = [
  {
    label: "Network",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
      </svg>
    ),
    description: "Choose blockchain network"
  },
  {
    label: "DAO Details",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
      </svg>
    ),
    description: "Configure DAO and token"
  },
  {
    label: "Review",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
      </svg>
    ),
    description: "Verify configuration"
  },
  {
    label: "Pre-Deploy",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
        <path d="M10 6a1 1 0 011 1v3.586l2.707 2.707a1 1 0 01-1.414 1.414l-3-3A1 1 0 019 11V7a1 1 0 011-1z" clipRule="evenodd" />
      </svg>
    ),
    description: "Run pre-deployment checks"
  },
  {
    label: "Success",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    description: "View your new DAO"
  }
];

const StepIndicator: React.FC<StepIndicatorProps> = ({ 
  currentStep, 
  totalSteps, 
  onStepClick 
}) => {
  return (
    <div className="mb-10">
      {/* Mobile view - simplified steps */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Step {currentStep + 1} of {totalSteps}
          </span>
          <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
            {STEP_INFO[currentStep].label}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-primary-600 dark:bg-primary-500 h-2.5 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          ></div>
        </div>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {STEP_INFO[currentStep].description}
        </p>
      </div>
      
      {/* Desktop view - full step indicator */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between mb-8">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <React.Fragment key={index}>
              {/* Step circle with icon */}
              <div className="flex flex-col items-center relative">
                <div 
                  className={`relative flex items-center justify-center w-12 h-12 rounded-full 
                    ${currentStep > index 
                      ? 'bg-primary-600 text-white shadow-md' 
                      : currentStep === index 
                        ? 'bg-primary-100 text-primary-600 border-2 border-primary-600 dark:bg-primary-900 dark:text-primary-400 dark:border-primary-400 shadow-md' 
                        : 'bg-gray-100 text-gray-400 dark:bg-gray-800'
                    } 
                    ${onStepClick && currentStep > index ? 'cursor-pointer hover:opacity-80' : ''}
                    transition-all duration-200
                  `}
                  onClick={() => onStepClick && currentStep > index && onStepClick(index)}
                >
                  {currentStep > index ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    currentStep === index ? (
                      <AnimatedIcon>
                        {STEP_INFO[index].icon}
                      </AnimatedIcon>
                    ) : (
                      STEP_INFO[index].icon
                    )
                  )}
                  
                  {/* Pulse animation for current step */}
                  {currentStep === index && (
                    <span className="absolute w-full h-full rounded-full animate-ping bg-primary-400 opacity-20"></span>
                  )}
                </div>
                
                {/* Step label */}
                <div className="mt-3 text-center">
                  <p className={`text-sm font-medium ${
                    currentStep >= index 
                      ? 'text-primary-600 dark:text-primary-400' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {STEP_INFO[index].label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-[120px]">
                    {STEP_INFO[index].description}
                  </p>
                </div>
              </div>
              
              {/* Connector line */}
              {index < totalSteps - 1 && (
                <div className="flex-grow mx-2 relative">
                  <div className={`h-1 absolute top-6 left-0 right-0 ${
                    currentStep > index ? 'bg-primary-600 dark:bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`}></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
