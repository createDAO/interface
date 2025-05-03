import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/layout/Layout';
import CodeBlock from '../components/ui/CodeBlock';

// Component for feature cards
const FeatureCard: React.FC<{
  title: string;
  description: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}> = ({ title, description, icon, className = "" }) => {
  return (
    <div className={`bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex items-start">
        {icon && <div className="mr-3 text-primary-600 dark:text-primary-400">{icon}</div>}
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-1">{title}</h4>
          <div className="text-sm text-gray-600 dark:text-gray-300">{description}</div>
        </div>
      </div>
    </div>
  );
};

// Component for section headers
const SectionHeader: React.FC<{
  title: string;
  description?: string;
  className?: string;
}> = ({ title, description, className = "" }) => {
  return (
    <div className={`mb-6 ${className}`}>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
      {description && (
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      )}
    </div>
  );
};


const DAOFeaturesPage: React.FC = () => {
  return (
    <Layout>
      <Head>
        <title>DAO Features & Information | CreateDAO</title>
        <meta name="description" content="Learn about the features and components of DAOs created with CreateDAO" />
      </Head>

      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">DAO Features & Information</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Understand the components, features, and technical details of your DAO
          </p>
        </div>

        {/* Introduction Section */}
        <div className="mb-16">
          <SectionHeader
            title="Introduction"
            description="CreateDAO deploys a complete DAO ecosystem with four core smart contracts that work together to provide governance, token management, treasury control, and staking capabilities."
          />

          <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-medium text-primary-800 dark:text-primary-300 mb-3">What You Get</h3>
            <p className="text-primary-700 dark:text-primary-400 mb-4">
              When you create a DAO through CreateDAO, you receive a complete governance system with:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-primary-700 dark:text-primary-400">
              <li>A fully-functional <strong>DAO Core</strong> contract with proposal and voting systems</li>
              <li>An <strong>ERC20 Governance Token</strong> with customizable tax mechanisms</li>
              <li>A secure <strong>Treasury</strong> to manage your DAO&#39;s assets</li>
              <li>A <strong>Staking System</strong> with time-based voting power multipliers</li>
              <li>All contracts deployed as <strong>upgradeable proxies</strong> for future improvements</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">For DAO Creators</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                As the creator, you&#39;ll receive:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                <li>1 governance token to start participating</li>
                <li>Ability to create initial proposals</li>
                <li>Control over the initial deployment</li>
                <li>Tools to bootstrap your community</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">For DAO Members</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Your community members will be able to:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                <li>Stake tokens to gain voting power</li>
                <li>Create and vote on proposals</li>
                <li>Participate in presales</li>
                <li>Help govern the DAO&#39;s treasury and future</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contract Architecture Section */}
        <div className="mb-16">
          <SectionHeader
            title="DAO Architecture"
            description="Your DAO consists of four main contracts that work together to provide a complete governance system."
          />

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
            <div className="flex justify-center">
              <div className="max-w-full overflow-auto">
                <svg width="650" height="320" viewBox="0 0 650 320" className="mx-auto">
                  {/* Main DAO Contract */}
                  <rect x="245" y="20" width="160" height="60" rx="4" fill="#4f46e5" fillOpacity="0.2" stroke="#4f46e5" strokeWidth="2" />
                  <text x="325" y="50" textAnchor="middle" fill="currentColor" className="text-gray-900 dark:text-white" fontWeight="500">DAO Core</text>
                  <text x="325" y="70" textAnchor="middle" fill="currentColor" className="text-gray-600 dark:text-gray-300" fontSize="12">Governance & Proposals</text>

                  {/* Token Contract */}
                  <rect x="60" y="140" width="160" height="60" rx="4" fill="#10b981" fillOpacity="0.2" stroke="#10b981" strokeWidth="2" />
                  <text x="140" y="170" textAnchor="middle" fill="currentColor" className="text-gray-900 dark:text-white" fontWeight="500">DAO Token</text>
                  <text x="140" y="190" textAnchor="middle" fill="currentColor" className="text-gray-600 dark:text-gray-300" fontSize="12">ERC20 Governance Token</text>

                  {/* Treasury Contract */}
                  <rect x="245" y="140" width="160" height="60" rx="4" fill="#f59e0b" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="2" />
                  <text x="325" y="170" textAnchor="middle" fill="currentColor" className="text-gray-900 dark:text-white" fontWeight="500">Treasury</text>
                  <text x="325" y="190" textAnchor="middle" fill="currentColor" className="text-gray-600 dark:text-gray-300" fontSize="12">Asset Management</text>

                  {/* Staking Contract */}
                  <rect x="430" y="140" width="160" height="60" rx="4" fill="#ec4899" fillOpacity="0.2" stroke="#ec4899" strokeWidth="2" />
                  <text x="510" y="170" textAnchor="middle" fill="currentColor" className="text-gray-900 dark:text-white" fontWeight="500">Staking</text>
                  <text x="510" y="190" textAnchor="middle" fill="currentColor" className="text-gray-600 dark:text-gray-300" fontSize="12">Voting Power</text>

                  {/* Factory Contract */}
                  <rect x="245" y="260" width="160" height="40" rx="4" fill="#6b7280" fillOpacity="0.2" stroke="#6b7280" strokeWidth="2" />
                  <text x="325" y="285" textAnchor="middle" fill="currentColor" className="text-gray-900 dark:text-white" fontWeight="500">DAO Factory</text>

                  {/* Connecting Lines */}
                  {/* DAO to Token */}
                  <line x1="245" y1="50" x2="140" y2="140" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4" className="text-gray-400 dark:text-gray-500" />
                  {/* DAO to Treasury */}
                  <line x1="325" y1="80" x2="325" y2="140" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4" className="text-gray-400 dark:text-gray-500" />
                  {/* DAO to Staking */}
                  <line x1="405" y1="50" x2="510" y2="140" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4" className="text-gray-400 dark:text-gray-500" />
                  {/* Factory to All */}
                  <line x1="325" y1="260" x2="325" y2="200" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4" className="text-gray-400 dark:text-gray-500" />
                  <line x1="325" y1="240" x2="140" y2="200" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4" className="text-gray-400 dark:text-gray-500" />
                  <line x1="325" y1="240" x2="510" y2="200" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4" className="text-gray-400 dark:text-gray-500" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
              All contracts are deployed as upgradeable proxies with the latest implementations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard
              title="Upgradeable Design"
              description={
                <div>
                  <p className="mb-2">All contracts use the UUPS (Universal Upgradeable Proxy Standard) pattern, allowing for future improvements while preserving state and balances.</p>
                  <p>Upgrades can only be executed through governance proposals that have passed community voting.</p>
                </div>
              }
            />

            <FeatureCard
              title="Contract Interactions"
              description={
                <div>
                  <p className="mb-2">The DAO Core contract is the central hub that coordinates all governance actions.</p>
                  <p>It interacts with the Token, Treasury, and Staking contracts to execute proposals approved by the community.</p>
                </div>
              }
            />
          </div>
        </div>

        {/* Core Components Section */}
        <div className="mb-16">
          <SectionHeader
            title="Core Components"
            description="Each contract in your DAO ecosystem serves a specific purpose and has unique features."
          />

          {/* DAO Core */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              DAO Core
            </h3>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                The DAO Core contract is the central governance hub that manages proposals, voting, and execution of community decisions.
              </p>

              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Key Features:</h4>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-4">
                <li><span className="font-medium">Proposal System:</span> Create, vote on, and execute various types of proposals</li>
                <li><span className="font-medium">Voting Mechanism:</span> Secure voting with stake-based voting power</li>
                <li><span className="font-medium">Execution Logic:</span> Safe execution of approved proposals</li>
                <li><span className="font-medium">Emergency Controls:</span> Pause/unpause functionality for security</li>
              </ul>

              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Governance Parameters:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                  <span className="font-medium">Voting Period:</span> 3 days
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                  <span className="font-medium">Minimum Proposal Stake:</span> 1 token
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                  <span className="font-medium">Quorum:</span> 50% of voting power
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                  <span className="font-medium">Version:</span> 1.0.0
                </div>
              </div>

              <CodeBlock
                title="DAO Core Contract Initialization"
                code={`function initialize(
  string memory _name,
  address _treasury,
  address _stakingContract,
  address _token,
  address _factory
) external initializer {
  require(bytes(_name).length > 0, "Empty name");
  require(_treasury != address(0), "Zero treasury");
  require(_stakingContract != address(0), "Zero staking");
  require(_token != address(0), "Zero token");
  require(_factory != address(0), "Zero factory");

  __Ownable_init(_factory);
  __UUPSUpgradeable_init();

  CoreStorage.Layout storage core = _getCore();
  core.name = _name;
  core.factory = _factory;

  // Initialize upgradeable contract addresses
  core.upgradeableContracts[IDAOBase.UpgradeableContract.DAO] = address(this);
  core.upgradeableContracts[IDAOBase.UpgradeableContract.Treasury] = _treasury;
  core.upgradeableContracts[IDAOBase.UpgradeableContract.Staking] = _stakingContract;
  core.upgradeableContracts[IDAOBase.UpgradeableContract.Token] = _token;

  // Initialize governance parameters
  core.votingPeriod = 1 minutes;
  core.minProposalStake = 1e18; // 1 token
  core.quorum = 5000; // 50%
}`}
              />
            </div>
          </div>

          {/* DAO Token */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              </div>
              DAO Token
            </h3>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                The DAO Token is an ERC20 token that serves as the governance token for your DAO. It includes additional features beyond a standard ERC20 token.
              </p>

              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Key Features:</h4>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-4">
                <li><span className="font-medium">Initial Distribution:</span> 1 token to creator, rest to treasury</li>
                <li><span className="font-medium">Tax Mechanism:</span> Configurable tax rate up to 10%</li>
                <li><span className="font-medium">Whitelisting:</span> Addresses can be exempted from tax</li>
                <li><span className="font-medium">Staking Integration:</span> Works with the staking contract for governance</li>
              </ul>

              <CodeBlock
                title="DAO Token Tax Mechanism"
                code={`function _update(
  address from,
  address to,
  uint256 amount
) internal virtual override {
  if (
    taxRate > 0 && // Tax is enabled
    !isWhitelisted[from] && // Sender not whitelisted
    !isWhitelisted[to] && // Recipient not whitelisted
    from != address(0) && // Not minting
    to != address(0) // Not burning
  ) {
    uint256 taxAmount = (amount * taxRate) / 10000;
    super._update(from, taxRecipient, taxAmount);
    super._update(from, to, amount - taxAmount);
  } else {
    super._update(from, to, amount);
  }
}`}
              />
            </div>
          </div>

          {/* Treasury */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-600 dark:text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
              </div>
              Treasury
            </h3>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                The Treasury contract securely holds and manages all assets owned by the DAO, including tokens and ETH.
              </p>

              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Key Features:</h4>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-4">
                <li><span className="font-medium">Asset Control:</span> Holds majority of tokens initially</li>
                <li><span className="font-medium">Multi-Asset:</span> Can hold ETH and any ERC20 tokens</li>
                <li><span className="font-medium">Governance-Controlled:</span> Only DAO can authorize transfers</li>
                <li><span className="font-medium">Balance Tracking:</span> Methods to check current balances</li>
              </ul>

              <CodeBlock
                title="Treasury Transfer Functions"
                code={`function transferETH(address payable recipient, uint256 amount) external onlyDAO {
  require(recipient != address(0), "Zero recipient");
  require(amount > 0, "Zero amount");
  require(address(this).balance >= amount, "Insufficient ETH");

  (bool success, ) = recipient.call{value: amount}("");
  require(success, "ETH transfer failed");

  emit ETHTransferred(recipient, amount);
}

function transferERC20(address token, address recipient, uint256 amount) external onlyDAO {
  require(token != address(0), "Zero token");
  require(recipient != address(0), "Zero recipient");
  require(amount > 0, "Zero amount");

  IERC20(token).safeTransfer(recipient, amount);

  emit ERC20Transferred(token, recipient, amount);
}`}
              />
            </div>
          </div>

          {/* Staking */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pink-600 dark:text-pink-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
              </div>
              Staking
            </h3>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                The Staking contract allows token holders to stake their tokens to gain voting power in the DAO.
              </p>

              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Key Features:</h4>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-4">
                <li><span className="font-medium">Time-Based Multipliers:</span> Longer staking periods increase voting power</li>
                <li><span className="font-medium">Voting Power Calculation:</span> Stake × Time Multiplier</li>
                <li><span className="font-medium">Flexible Staking:</span> Users can stake and unstake at any time</li>
                <li><span className="font-medium">Configurable Parameters:</span> Multipliers and thresholds can be adjusted through governance</li>
              </ul>

              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Staking Multipliers:</h4>
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Staking Duration</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Multiplier</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Example</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Less than 1 week</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">1x (base)</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">100 tokens = 100 voting power</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">1 week to 1 month</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">1.25x</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">100 tokens = 125 voting power</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">1 month to 3 months</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">1.5x</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">100 tokens = 150 voting power</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">More than 3 months</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">2x</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">100 tokens = 200 voting power</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <CodeBlock
                title="Staking Voting Power Calculation"
                code={`function getVotingPower(address account) public view returns (uint256) {
  uint256 staked = stakedAmount[account];
  if (staked == 0) return 0;

  uint256 stakeDuration = block.timestamp - stakingTime[account];
  uint256 multiplier = multipliers[0]; // Base multiplier

  // Apply time-based multiplier
  if (stakeDuration >= thresholds[2]) {
    multiplier = multipliers[3];
  } else if (stakeDuration >= thresholds[1]) {
    multiplier = multipliers[2];
  } else if (stakeDuration >= thresholds[0]) {
    multiplier = multipliers[1];
  }

  return (staked * multiplier) / MULTIPLIER_DENOMINATOR;
}`}
              />
            </div>
          </div>
        </div>

        {/* Governance Features Section */}
        <div className="mb-16">
          <SectionHeader
            title="Governance Features"
            description="Your DAO includes a comprehensive governance system with various proposal types and voting mechanisms."
          />

          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Available Proposal Types</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FeatureCard
                title="Treasury Transfers"
                description="Propose to transfer tokens or ETH from the treasury to any address"
              />

              <FeatureCard
                title="Presale Creation"
                description="Launch token presales with customizable token amount and initial price"
              />

              <FeatureCard
                title="Presale Management"
                description="Pause/unpause presales and withdraw funds from completed presales"
              />

              <FeatureCard
                title="Contract Upgrades"
                description="Upgrade core contracts or modules to newer implementations"
              />

              <FeatureCard
                title="Emergency Controls"
                description="Pause/unpause the entire DAO in case of emergencies"
              />

              <FeatureCard
                title="Module Upgrades"
                description="Add or upgrade specific modules like presale or vesting contracts"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Voting Process</h3>
            <ol className="list-decimal pl-5 space-y-3 text-gray-600 dark:text-gray-300">
              <li><span className="font-medium">Proposal Creation:</span> Any member with at least 1 staked token can create a proposal</li>
              <li><span className="font-medium">Voting Period:</span> Members have a set time period to cast their votes</li>
              <li><span className="font-medium">Vote Casting:</span> Members vote &#34;For&#34; or &#34;Against&#34; with their voting power</li>
              <li><span className="font-medium">Quorum Check:</span> At least 50% of total voting power must participate</li>
              <li><span className="font-medium">Execution:</span> If approved, the proposal can be executed to implement the changes</li>
            </ol>
          </div>
        </div>

        {/* Deployment Process Section */}
        <div className="mb-16">
          <SectionHeader
            title="Deployment Process"
            description="When you create a DAO, the following steps happen automatically in a single transaction."
          />

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <ol className="list-decimal pl-5 space-y-3 text-gray-600 dark:text-gray-300">
              <li><span className="font-medium">Token Deployment:</span> Your ERC20 governance token is deployed first</li>
              <li><span className="font-medium">Treasury Deployment:</span> Treasury contract is deployed (uninitialized)</li>
              <li><span className="font-medium">Staking Deployment:</span> Staking contract is deployed and linked to your token</li>
              <li><span className="font-medium">DAO Deployment:</span> Main DAO contract is deployed and connected to all other contracts</li>
              <li><span className="font-medium">Treasury Initialization:</span> Treasury is initialized with the DAO as owner</li>
              <li><span className="font-medium">Token Configuration:</span> Staking contract is set in token and ownership transferred to DAO</li>
              <li><span className="font-medium">Token Distribution:</span> Remaining tokens are transferred to treasury</li>
              <li><span className="font-medium">Ownership Transfer:</span> DAO becomes self-governing (owns itself)</li>
            </ol>

            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">Important Note</h4>
              <p className="text-yellow-700 dark:text-yellow-400 text-sm">
                After deployment, your DAO is fully autonomous and controlled by governance. The creator receives 1 token to start participating, but has no special privileges beyond that. All major decisions must go through the governance process.
              </p>
            </div>
          </div>
        </div>

        {/* Getting Started Section */}
        <div className="mb-16">
          <SectionHeader
            title="Getting Started"
            description="After creating your DAO, here are some steps to get started with governance."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-3">
                  <span className="text-primary-600 dark:text-primary-400 font-bold">1</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Stake Your Token</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Stake your initial token to gain voting power. The longer you stake, the more voting power you&#39;ll have.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-3">
                  <span className="text-primary-600 dark:text-primary-400 font-bold">2</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Create a Proposal</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Create your first proposal to distribute tokens from the treasury or launch a presale to grow your community.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-3">
                  <span className="text-primary-600 dark:text-primary-400 font-bold">3</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Grow Your Community</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Invite members to join your DAO, distribute tokens through proposals, and build a decentralized community.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/create" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              Create Your DAO Now
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DAOFeaturesPage;
