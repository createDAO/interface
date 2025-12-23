# CreateDAO Interface (v2)

CreateDAO Interface is a Next.js web application for creating and deploying DAOs (Decentralized Autonomous Organizations) on EVM chains.

This repository is the **interface** for the CreateDAO **contracts v2** architecture.

---

## Overview

CreateDAO v2 deploys a complete, independent governance system using **OpenZeppelin Governor** primitives.

Each DAO deployment includes:

- **DAOToken** (ERC20Votes governance token)
- **TimelockController** (acts as both **Treasury** and **execution timelock**)
- **DAOGovernor** (proposals, voting, queueing, execution)

All three are created via a single `DAOFactory.createDAO(...)` transaction.

---

## DAO Architecture (v2)

### Contracts

1. **DAOFactory**
   - Deploys and tracks DAOs
   - Uses **EIP-1167 minimal proxies (Clones)** to deploy `DAOToken` and `DAOGovernor` efficiently

2. **DAOToken (ERC20Votes + ERC20Permit)**
   - Governance token with checkpoint-based voting
   - **Auto self-delegation**: when an address receives tokens for the first time, it delegates to itself so voting power is active immediately

3. **TimelockController (Treasury)**
   - Holds DAO assets (including **99% of token supply** by default)
   - Enforces a **1-day delay** between proposal approval and execution
   - Only governance-approved actions can move treasury funds

4. **DAOGovernor**
   - Manages proposal lifecycle: propose → vote → queue → execute
   - Default parameters are designed to bootstrap governance safely
   - Includes a **Manager role** (on-chain source of truth for off-chain authorization), changeable **only via governance**

### Token distribution

At DAO creation time:

- **1%** of total supply is sent to the DAO creator (bootstraps governance)
- **99%** of total supply is sent to the treasury (TimelockController)

This ensures the creator can meet default quorum/threshold to start governance, and the community can later distribute tokens via proposals.

### High-level diagram

```
┌───────────────────────────────────────────────────────────┐
│                         DAOFactory                        │
│   - Holds impl addresses                                  │
│   - createDAO() deploys a full DAO system                 │
└───────────────────────────────┬───────────────────────────┘
                                │
                                ▼
        ┌─────────────────────────────────────────────────┐
        │            Deployed DAO Governance System       │
        │                                                 │
        │  ┌─────────────────┐      ┌─────────────────┐   │
        │  │ DAOToken (clone)│────▶ │ DAOGovernor    │   │
        │  │ ERC20Votes      │      │ (clone)         │   │
        │  └─────────────────┘      └────────┬────────┘   │
        │                                    │            │
        │                                    ▼            │
        │                         ┌───────────────────┐   │
        │                         │ TimelockController│   │
        │                         │ Treasury + Delay  │   │
        │                         └───────────────────┘   │
        └─────────────────────────────────────────────────┘
```

---

## Deployment Flow (v2)

When a user creates a DAO, the factory performs these actions:

1. **Clone DAOToken** (EIP-1167) and initialize it
2. **Deploy TimelockController** (full contract)
3. **Clone DAOGovernor** (EIP-1167) and initialize it
4. **Configure roles** so the Governor controls the Timelock
5. **Distribute tokens** (1% creator / 99% treasury)
6. **Emit `DAOCreated`** event with deployed addresses

---

## Supported Networks

Currently supported (as shipped in this repository):

- **Sepolia** (testnet)
- **Base** (mainnet)

Additionally, **Hardhat** is enabled automatically in `NODE_ENV=development`.

---

## Deployed Factory Addresses

The interface reads factory addresses from `src/config/dao.ts`.

| Network | Chain ID | DAOFactory |
|--------:|---------:|-----------:|
| Sepolia | 11155111 | [`0x2e00e5c34d7779bcaeb0f1d679efb89ea98624ae`](https://sepolia.etherscan.io/address/0x2e00e5c34d7779bcaeb0f1d679efb89ea98624ae) |
| Base | 8453 | [`0x2e00E5c34D7779BcaEB0f1D679efB89ea98624AE`](https://basescan.org/address/0x2e00E5c34D7779BcaEB0f1D679efB89ea98624AE) |

---

## Features

- Deploy a complete DAO governance system in **one transaction**
- Supports **OpenZeppelin Governor** proposal lifecycle
- **Timelock-protected treasury** (security delay before execution)
- **Auto-delegation** for immediate voting power after receiving tokens
- **Manager role** for off-chain authorization (OpenBook-ready)
- Wallet integration (MetaMask / WalletConnect / Coinbase Wallet)
- Transaction status tracking and confirmations
- Internationalization (i18n)

---

## Tech Stack

- **Frontend**: Next.js + React + TypeScript
- **Styling**: Tailwind CSS
- **Web3**: wagmi + viem
- **Wallets**: MetaMask SDK, WalletConnect, Coinbase Wallet

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm
- A Web3 wallet (MetaMask, WalletConnect, etc.)

### Install

```bash
git clone https://github.com/createDAO/interface.git
cd interface
npm install
```

### Configure environment

```bash
cp .env.example .env
```

For WalletConnect and DRPC you can set:

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_DRPC_API_KEY=your_drpc_api_key
```

### Run

```bash
npm run dev
```

Open: http://localhost:3000

---

## Related Projects

- **Contracts (v2 core)**: https://github.com/createdao/v2-core
- **Interface (this repo)**: https://github.com/createDAO/interface

---

## License

This project is licensed under the Business Source License 1.1 - see the [LICENSE](LICENSE) file for details.
