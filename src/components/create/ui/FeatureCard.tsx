import React from 'react';

interface FeatureCardProps {
  title: string;
  description: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  icon, 
  className = "", 
  onClick 
}) => {
  return (
    <div 
      className={`bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 transition-all duration-300 ${onClick ? 'hover:border-primary-500 dark:hover:border-primary-400 cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-start">
        {icon && <div className="mr-3 text-primary-600 dark:text-primary-400">{icon}</div>}
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-1">{title}</h4>
          <div className="text-sm text-gray-600 dark:text-gray-300">{description}</div>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
