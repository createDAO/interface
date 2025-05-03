import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Loading');

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let textInterval: NodeJS.Timeout;

    const handleStart = (url: string) => {
      // Don't show loader for hash changes on the same page
      if (url.split('?')[0] === router.asPath.split('?')[0] && url.includes('#')) {
        return;
      }
      
      setIsTransitioning(true);
      setLoadingProgress(0);
      
      // Simulate progress
      progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          // Slow down as we approach 90%
          if (prev < 30) return prev + 5;
          if (prev < 60) return prev + 3;
          if (prev < 80) return prev + 1;
          if (prev < 90) return prev + 0.5;
          return prev;
        });
      }, 100);
      
      // Animate loading text
      let dots = 0;
      textInterval = setInterval(() => {
        dots = (dots + 1) % 4;
        setLoadingText(`Loading${'.'.repeat(dots)}`);
      }, 500);
    };

    const handleComplete = () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
      
      // Jump to 100% and then fade out
      setLoadingProgress(100);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, [router]);

  return (
    <>
      {/* Loading overlay */}
      {isTransitioning && (
        <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 z-50 flex flex-col items-center justify-center transition-opacity duration-300">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
          <p className="text-primary-700 dark:text-primary-300 text-lg font-medium">{loadingText}</p>
          
          {/* Progress bar */}
          <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-4 overflow-hidden">
            <div 
              className="h-full bg-primary-600 dark:bg-primary-500 transition-all duration-300 ease-out"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            {Math.round(loadingProgress)}%
          </p>
        </div>
      )}
      
      {/* Page content */}
      {children}
    </>
  );
};

export default PageTransition;
