# CreateDAO Platform

A web application for creating and deploying DAOs (Decentralized Autonomous Organizations) on multiple EVM blockchains.

## Introduction

CreateDAO is a platform that allows anyone to create and deploy fully-functional DAOs on various EVM-compatible blockchains. The platform provides a user-friendly interface with step-by-step guidance, making DAO creation accessible to everyone, regardless of technical expertise.

When you create a DAO through CreateDAO, you receive a complete governance system with four core smart contracts that work together to provide governance, token management, treasury control, and staking capabilities.

## DAO Architecture

Your DAO consists of four main contracts that work together to provide a complete governance system:

1. **DAO Core**: The central governance hub that manages proposals, voting, and execution of community decisions.
2. **DAO Token**: An ERC20 token that serves as the governance token for your DAO with additional features like tax mechanisms.
3. **Treasury**: Securely holds and manages all assets owned by the DAO, including tokens and native currency.
4. **Staking**: Allows token holders to stake their tokens to gain voting power in the DAO with time-based multipliers.

All contracts are deployed as upgradeable proxies with the latest implementations, allowing for future improvements while preserving state and balances.

```
                       ┌─────────────┐
                       │   DAO Core  │
                       │  Governance │
                       └──────┬──────┘
                              │
                 ┌────────────┼────────────┐
                 │            │            │
        ┌────────▼─────┐ ┌────▼─────┐ ┌────▼─────┐
        │  DAO Token   │ │ Treasury │ │  Staking │
        │    ERC20     │ │  Assets  │ │  Voting  │
        └──────────────┘ └──────────┘ └──────────┘
```

## Features

### Core Features

- Create and deploy DAOs on multiple blockchains with a governance token
- User-friendly interface with step-by-step guidance
- Support for multiple blockchain networks
- Wallet integration with MetaMask, WalletConnect, and more
- Transaction status tracking and confirmation
- DAO recording service with Firebase Firestore
- Browse and filter all deployed DAOs
- Dark/light mode support
- Responsive design for all devices

### Governance Features

- **Proposal System**: Create, vote on, and execute various types of proposals
- **Voting Mechanism**: Secure voting with stake-based voting power
- **Treasury Management**: Propose to transfer tokens or ETH from the treasury
- **Presale Creation**: Launch token presales with customizable parameters
- **Contract Upgrades**: Upgrade core contracts or modules to newer implementations
- **Emergency Controls**: Pause/unpause the entire DAO in case of emergencies

### Staking Features

- **Time-Based Multipliers**: Longer staking periods increase voting power
- **Flexible Staking**: Users can stake and unstake at any time
- **Configurable Parameters**: Multipliers and thresholds can be adjusted through governance

## Tech Stack

- **Frontend Framework**: Next.js
- **CSS Framework**: Tailwind CSS v4.0
- **Build Tool**: Vite
- **Language**: TypeScript
- **Blockchain Integration**: wagmi, viem
- **Wallet Connection**: MetaMask, WalletConnect, Coinbase Wallet
- **Database**: Firebase Firestore

## Supported Networks

CreateDAO supports the following networks:

- **Testnets**:
  - Sepolia

- **Mainnets**:
  - Ethereum
  - BNB Chain
  - Polygon
  - Arbitrum
  - Optimism
  - Base
  - Avalanche
  - Gnosis
  - Mantle
  - Celo
  - Blast
  - Scroll
  - Unichain

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- A web3 wallet (MetaMask, WalletConnect, etc.)

### Manual Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/createDAO/interface.git
   cd interface
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your own values.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

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
6. Review your DAO configuration
7. Proceed through the pre-deployment checks
8. Click "Create DAO" and confirm the transaction in your wallet
9. Once the transaction is confirmed, you'll see the deployment details including:
   - DAO Address
   - Token Address
   - Treasury Address
   - Staking Address

## Deployment Process

When you create a DAO, the following steps happen automatically in a single transaction:

1. Token Deployment: Your ERC20 governance token is deployed first
2. Treasury Deployment: Treasury contract is deployed
3. Staking Deployment: Staking contract is deployed and linked to your token
4. DAO Deployment: Main DAO contract is deployed and connected to all other contracts
5. Treasury Initialization: Treasury is initialized with the DAO as owner
6. Token Configuration: Staking contract is set in token and ownership transferred to DAO
7. Token Distribution: Remaining tokens are transferred to treasury
8. Ownership Transfer: DAO becomes self-governing (owns itself)

## Environment Variables

For WalletConnect, DRPC, and Firebase integration, you can set the following environment variables:

```
# WalletConnect and DRPC
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_DRPC_API_KEY=your_drpc_api_key

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
```

## Related Projects

- [createDAO/v1-core](https://github.com/createDAO/v1-core) - The smart contracts used by this interface, licensed under MIT.

## License

This project is licensed under the Business Source License 1.1 - see the [LICENSE](LICENSE) file for details.
