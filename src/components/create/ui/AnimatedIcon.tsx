import React, { useEffect, useState } from 'react';

interface AnimatedIconProps {
  children: React.ReactNode;
  duration?: number;
}

const AnimatedIcon: React.FC<AnimatedIconProps> = ({ 
  children, 
  duration = 1500 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    // Start animation
    setIsAnimating(true);
    
    // Set up animation interval
    const interval = setInterval(() => {
      setIsAnimating(prev => !prev);
    }, duration);
    
    // Clean up
    return () => clearInterval(interval);
  }, [duration]);
  
  return (
    <div className={`transition-transform duration-300 ease-in-out ${isAnimating ? 'scale-110' : 'scale-100'}`}>
      {children}
    </div>
  );
};

export default AnimatedIcon;
