# CreateDAO Platform

A modern web application for creating and deploying DAOs (Decentralized Autonomous Organizations) on multiple blockchains.

## Features

- Create and deploy DAOs on multiple blockchains with a governance token
- User-friendly interface with step-by-step guidance
- Support for multiple blockchain networks
- Wallet integration with MetaMask, WalletConnect, and more
- Transaction status tracking and confirmation
- Dark/light mode support
- Responsive design for all devices

## Tech Stack

- **Frontend Framework**: Next.js
- **CSS Framework**: Tailwind CSS v4.0
- **Build Tool**: Vite
- **Language**: TypeScript
- **Blockchain Integration**: wagmi, viem
- **Wallet Connection**: MetaMask, WalletConnect, Coinbase Wallet

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- A web3 wallet (MetaMask, WalletConnect, etc.)

### Quick Setup

We've included a setup script to make it easy to get started:

```bash
# Make the script executable (if needed)
chmod +x setup.sh

# Run the setup script
./setup.sh
```

This will install all dependencies and start the development server.

### Manual Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/createDAO.git
   cd createDAO
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Creating a DAO

1. Navigate to the "Create DAO" page from the homepage or directly at `/create`
2. Connect your wallet using the "Connect Wallet" button
3. Select the network you want to deploy on
4. Choose the DAO version
5. Fill in the DAO details:
   - DAO Name
   - Token Name
   - Token Symbol
   - Total Supply
6. Click "Create DAO" and confirm the transaction in your wallet
7. Once the transaction is confirmed, you'll see the deployment details including:
   - DAO Address
   - Token Address
   - Treasury Address
   - Staking Address

## Supported Networks

- Ethereum Mainnet
- Sepolia Testnet
- BNB Chain
- Base
- Arbitrum
- Avalanche
- Polygon
- Optimism

## Environment Variables

For WalletConnect and Alchemy integration, you can set the following environment variables:

```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
