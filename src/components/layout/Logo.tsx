import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from './ThemeContext';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  const { theme } = useContext(ThemeContext);
  // Use state to track client-side rendering
  const [mounted, setMounted] = useState(false);
  
  // After hydration, set mounted to true
  useEffect(() => {
    setMounted(true);
  }, []);

  // Only use the theme context after client-side hydration
  const isDarkMode = mounted ? theme === 'dark' : false;

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
      {/* Circle - always use black for initial server render */}
      <circle cx="20" cy="20" r="20" fill={isDarkMode ? 'white' : 'black'}/>
      {/* Text - always use black for initial server render */}
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
        CreateDAO
      </text>
    </svg>
  );
};

export default Logo;
