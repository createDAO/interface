import React from 'react';
import { ErrorBoundary } from './';

interface ErrorBoundaryWrapperProps {
  children: React.ReactNode;
}

const ErrorBoundaryWrapper: React.FC<ErrorBoundaryWrapperProps> = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-6 max-w-4xl mx-auto my-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <h2 className="text-xl font-bold text-red-800 dark:text-red-300 mb-4">Something went wrong</h2>
          <p className="text-red-600 dark:text-red-400 mb-4">
            An unexpected error occurred while processing your request. This could be due to a temporary issue or a problem with the current operation.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors"
          >
            Reload Page
          </button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundaryWrapper;
