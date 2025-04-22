import React from 'react';
import Link from 'next/link';

const Hero: React.FC = () => {
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
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 md:p-8 transform rotate-1 transition-transform duration-300 hover:rotate-0">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="ml-4 text-sm text-gray-500 dark:text-gray-400">CreateDAO Interface</div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
                    <div className="h-10 bg-primary-100 dark:bg-primary-900 rounded flex items-center justify-center">
                      <div className="h-4 w-1/3 bg-primary-500 dark:bg-primary-400 rounded"></div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                  </div>
                  <div className="h-10 w-24 bg-primary-600 dark:bg-primary-500 rounded-lg"></div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary-100 dark:bg-primary-900 rounded-full z-[-1]"></div>
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-primary-200 dark:bg-primary-800 rounded-full z-[-1]"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
