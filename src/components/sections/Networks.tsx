import React from 'react';
import { SUPPORTED_NETWORKS, getExplorerUrl } from '../../config/networks';
import { getFactoryAddress } from '../../config/dao';
import Image from 'next/image';

const Networks: React.FC = () => {
  // Filter out testnet networks for display in the Networks section
  const mainnetNetworks = SUPPORTED_NETWORKS.filter(network => !network.isTestnet);

  return (
    <section id="networks" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Supported Networks
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Create and deploy your DAO on any of these popular blockchain networks.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
          {mainnetNetworks.map((network) => (
            <div
              key={network.id}
              className={`rounded-xl p-4 flex flex-col items-center justify-center transition-transform duration-300 ${network.isAvailable
                ? "bg-gray-50 dark:bg-gray-800 hover:-translate-y-1 hover:shadow-md cursor-pointer"
                : "bg-gray-100 dark:bg-gray-700 opacity-50 cursor-not-allowed"
                }`}
              title={network.isAvailable ? `View DAO Factory contract on ${network.name}` : `${network.name} coming soon`}
              onClick={() => {
                if (network.isAvailable) {
                  const factoryConfig = getFactoryAddress(network.id);
                  const baseUrl = getExplorerUrl(network.id);
                  
                  // If factory address is available, link directly to the contract
                  if (factoryConfig.isAvailable && factoryConfig.address) {
                    window.open(`${baseUrl}/address/${factoryConfig.address}`, '_blank', 'noopener,noreferrer');
                  } else {
                    // Otherwise, just link to the explorer main page
                    window.open(baseUrl, '_blank', 'noopener,noreferrer');
                  }
                }
              }}
            >
              <div className="relative">
                <Image
                  src={network.icon ?? '/images/networks/ethereum.png'}
                  alt={`${network.name} logo`}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full"
                />
                {!network.isAvailable && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-gray-200 dark:bg-gray-600 bg-opacity-70 dark:bg-opacity-70 rounded-full w-full h-full flex items-center justify-center">
                      <Image
                        src={network.icon ?? '/images/networks/ethereum.png'}
                        alt={`${network.name} logo`}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full"
                      />
                    </div>
                  </div>
                )}
              </div>
              <span className={`mt-3 font-medium ${network.isAvailable
                ? "text-gray-900 dark:text-white"
                : "text-gray-500 dark:text-gray-400"
                }`}>
                {network.name}
                {network.isAvailable}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            More networks coming soon based on community feedback.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Networks;
