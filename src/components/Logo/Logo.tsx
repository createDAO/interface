import { useState, useEffect } from 'react';

export function Logo() {
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.getAttribute('data-theme') === 'dark'
  );

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'data-theme'
        ) {
          setIsDarkMode(document.documentElement.getAttribute('data-theme') === 'dark');
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <svg width="100%" height="100%" viewBox="0 0 180 40" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
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
}
