import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';

  return (
    <svg 
      width="100%" 
      height="100%" 
      viewBox="0 0 180 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      preserveAspectRatio="xMidYMid meet"
      className={className}
    >
      {/* Circle */}
      <circle cx="20" cy="20" r="20" fill={isDarkMode ? 'white' : 'black'}/>
      {/* Text */}
      <text
        x="48"
        y="27.5"
        fill={isDarkMode ? 'white' : 'black'}
        style={{
          fontSize: '24px',
          fontFamily: 'sans-serif',
          letterSpacing: '0.25px'
        }}
      >
        createDAO
      </text>
    </svg>
  );
};

export default Logo;
