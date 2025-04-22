import React from 'react';

const Networks: React.FC = () => {
  const networks = [
    { name: 'Ethereum', logo: '/images/networks/ethereum.svg' },
    { name: 'BSC', logo: '/images/networks/bsc.svg' },
    { name: 'Base', logo: '/images/networks/base.svg' },
    { name: 'Arbitrum', logo: '/images/networks/arbitrum.svg' },
    { name: 'Avalanche', logo: '/images/networks/avalanche.svg' },
    { name: 'Polygon', logo: '/images/networks/polygon.svg' },
    { name: 'OP Mainnet', logo: '/images/networks/optimism.svg' },
    { name: 'Gnosis', logo: '/images/networks/gnosis.svg' },
    { name: 'Unichain', logo: '/images/networks/unichain.svg' },
    { name: 'Mantle', logo: '/images/networks/mantle.svg' },
    { name: 'Celo', logo: '/images/networks/celo.svg' },
    { name: 'Blast', logo: '/images/networks/blast.svg' },
    { name: 'Scroll', logo: '/images/networks/scroll.svg' },
  ];

  // Placeholder SVG for network logos that might not exist yet
  const placeholderSvg = (name: string) => (
    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold">
      {name.substring(0, 2)}
    </div>
  );

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
          {networks.map((network, index) => (
            <div 
              key={index}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex flex-col items-center justify-center transition-transform duration-300 hover:-translate-y-1"
            >
              {placeholderSvg(network.name)}
              <span className="mt-3 font-medium text-gray-900 dark:text-white">
                {network.name}
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
