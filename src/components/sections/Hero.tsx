import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const Hero: React.FC = () => {
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [progress, setProgress] = useState(0);
  const fullText = 'MyAwesomeDAO';
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Typing animation effect
  useEffect(() => {
    if (typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.substring(0, typedText.length + 1));
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [typedText]);
  
  // Reset typing animation periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setTypedText('');
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  // Progress bar animation
  useEffect(() => {
    // Start progress animation when component mounts
    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          // Reset progress when it reaches 100%
          return 0;
        }
        return prev + 1;
      });
    }, 100);
    
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Create Your DAO <span className="text-primary-600 dark:text-primary-400">Effortlessly</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Launch your decentralized autonomous organization on multiple blockchains with just a few clicks. No coding required.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/create" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-center">
                Create DAO
              </Link>
              <Link href="#features" className="bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border border-primary-600 dark:border-primary-400 px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-center">
                Learn More
              </Link>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Only pay network gas fees for deployment
            </p>
          </div>
          <div className="md:w-1/2">
            <div className="relative">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 md:p-8 transform rotate-1 transition-all duration-300 hover:rotate-0 hover:shadow-2xl animate-float relative overflow-hidden">
                {/* Blockchain node visualization */}
                <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
                  <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary-500 rounded-full"></div>
                  <div className="absolute top-3/4 left-1/2 w-2 h-2 bg-primary-500 rounded-full"></div>
                  <div className="absolute top-1/2 left-3/4 w-2 h-2 bg-primary-500 rounded-full"></div>
                  <div className="absolute top-1/3 left-2/3 w-2 h-2 bg-primary-500 rounded-full"></div>
                  <div className="absolute top-2/3 left-1/3 w-2 h-2 bg-primary-500 rounded-full"></div>
                  
                  {/* Connection lines */}
                  <div className="absolute top-1/4 left-1/4 w-[150px] h-[1px] bg-primary-500 transform rotate-45"></div>
                  <div className="absolute top-3/4 left-1/2 w-[100px] h-[1px] bg-primary-500 transform -rotate-45"></div>
                  <div className="absolute top-1/3 left-2/3 w-[120px] h-[1px] bg-primary-500 transform rotate-30"></div>
                  <div className="absolute top-2/3 left-1/3 w-[80px] h-[1px] bg-primary-500 transform -rotate-30"></div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="ml-4 text-sm text-gray-500 dark:text-gray-400">CreateDAO Interface</div>
                  </div>
                  <div className="space-y-3">
                    {/* Network selector */}
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex-1">
                        <div className="relative">
                          <div 
                            className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded p-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                            onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
                          >
                            <div className="flex items-center">
                              <div className="w-4 h-4 rounded-full bg-primary-500 mr-2"></div>
                              <span>Ethereum</span>
                            </div>
                            <svg className={`w-4 h-4 transition-transform duration-200 ${showNetworkDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                          <div className={`absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded shadow-lg z-10 transition-opacity duration-200 ${showNetworkDropdown ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                            <div className="p-1">
                              <div className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                                <div className="w-4 h-4 rounded-full bg-primary-500 mr-2"></div>
                                <span className="text-xs">Ethereum</span>
                              </div>
                              <div className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                                <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
                                <span className="text-xs">Polygon</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-100 dark:bg-gray-700 rounded p-2 text-xs text-gray-700 dark:text-gray-300 flex items-center justify-between">
                          <span>v1.0.0</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* DAO Name input */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Name</span>
                      </div>
                      <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded h-8 pl-16 pr-3 flex items-center text-xs text-gray-800 dark:text-gray-200">
                        <span className="inline-block">{typedText}</span>
                        <span className="inline-block w-1 h-4 bg-primary-500 ml-0.5 animate-pulse"></span>
                      </div>
                    </div>
                    
                    {/* Token Name input */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Token</span>
                      </div>
                      <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded h-8 pl-16 pr-3 flex items-center text-xs text-gray-800 dark:text-gray-200">
                        MyDAO Token
                      </div>
                    </div>
                    
                    {/* Symbol and Supply */}
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Symbol</span>
                        </div>
                        <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded h-8 pl-16 pr-3 flex items-center text-xs text-gray-800 dark:text-gray-200">
                          MDT
                        </div>
                      </div>
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Supply</span>
                        </div>
                        <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded h-8 pl-16 pr-3 flex items-center text-xs text-gray-800 dark:text-gray-200">
                          1,000,000
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden mt-2">
                      <div 
                        className="h-full bg-primary-500 dark:bg-primary-400 transition-all duration-100 ease-linear"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    
                    {/* Create button with animation */}
                    <div className="relative mt-4 group">
                      <div className="absolute inset-0 bg-primary-400 dark:bg-primary-600 rounded animate-pulse opacity-30"></div>
                      <div className="h-10 bg-primary-500 dark:bg-primary-600 rounded flex items-center justify-center relative transition-all duration-200 group-hover:bg-primary-600 dark:group-hover:bg-primary-700 cursor-pointer">
                        <span className="text-white text-sm font-medium group-hover:scale-105 transition-transform duration-200">Create DAO</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-2 animate-ping opacity-75"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 text-xs text-gray-600 dark:text-gray-400 flex items-center px-2">Gas: 0.005 ETH</div>
                    </div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 text-xs text-gray-600 dark:text-gray-400 flex items-center px-2">Deployment ready</div>
                  </div>
                  <div className="relative">
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="h-10 w-24 bg-primary-600 dark:bg-primary-500 rounded-lg flex items-center justify-center hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors duration-200 cursor-pointer">
                      <span className="text-white text-xs">Connect</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary-100 dark:bg-primary-900 rounded-full z-[-1] animate-pulse"></div>
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-primary-200 dark:bg-primary-800 rounded-full z-[-1] animate-pulse animation-delay-1000"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
