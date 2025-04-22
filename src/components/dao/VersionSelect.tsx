import React from 'react';
import { DAO_VERSIONS } from '../../config/dao';

interface VersionSelectProps {
  value: string;
  onChange: (version: string) => void;
  className?: string;
}

export function VersionSelect({ value, onChange, className = '' }: VersionSelectProps) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-3 appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        {DAO_VERSIONS.map((version) => (
          <option
            key={version.id}
            value={version.id}
            disabled={!version.isAvailable}
            title={version.description}
          >
            {version.name}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}
