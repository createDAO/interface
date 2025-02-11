# createDAO

A minimalist, open-source tool for deploying DAOs with governance tokens on EVM-compatible networks.

## Features

- Simple DAO deployment with governance token creation
- Support for multiple EVM networks
- WalletConnect integration
- Responsive design
- Transaction status tracking
- Error handling
- Multiple DAO versions support
- Token distribution system (1 token to deployer, remaining to treasury)

## Prerequisites

- Node.js 20.x or later
- npm 10.x or later
- wagmi 2.x or later
- A WalletConnect Project ID

## Installation

1. Clone the repository:
```bash
git clone https://github.com/createDAO/interface.git
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp example.env .env
```

4. Configure your environment variables in `.env`:
- Add your WalletConnect Project ID
- Configure contract addresses
- (Optional) Add custom RPC URLs

## Configuration

### Networks

The application supports multiple EVM networks. Default networks include:
- Sepolia Testnet

To add or modify networks, edit `src/config/networks.ts`.

### Contract Addresses

Contract addresses are configured through environment variables:
- `VITE_DAO_FACTORY_ADDRESS`: Your DAO Factory contract address

## Usage

### Development
1. Start the development server:
```bash
npm run dev
```

### Production Deployment

#### CI/CD Pipeline

The project uses GitHub Actions for automated testing and deployment:

1. Test Environment (Triggered on Pull Requests):
   - Runs TypeScript compilation check
   - Builds the project
   - Deploys to test environment
   - Shows commit hash in footer for version tracking

2. Production Environment (Triggered on merge to main):
   - Builds Docker image with production configuration
   - Deploys to createdao.org
   - Updates commit hash display in footer

#### Prerequisites
- A Linux server with Docker and Docker Compose installed
- A Cloudflare account for DNS management
- A GitHub account for repository hosting
- Environment variables configured (see Environment Setup below)

#### Environment Setup for Production

Since this is an open-source project, environment variables should be handled securely:

1. On your production server, create a `.env` file in the deployment directory:
```bash
cd /var/www/createdao
cp example.env .env
```

2. Edit the `.env` file with your production values:
```bash
# Required
VITE_WALLET_CONNECT_PROJECT_ID="your_project_id"
VITE_DAO_FACTORY_ADDRESS="your_factory_address"

# Optional: Custom RPC URLs (use default public RPCs if not se  t)
VITE_SEPOLIA_RPC_URL="your_sepolia_rpc"
# ... other RPC URLs as needed
```

Note: The `.env` file is excluded from Git and Docker copying for security. You need to manually manage this file on your production server.

#### Initial Setup

1. Create a GitHub repository and push your code:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/createDAO/interface.git
git push -u origin main
```

2. Configure GitHub Repository Secrets:
   
   Go to your GitHub repository → Settings → Secrets and Variables → Actions and add the following secrets:

   Required GitHub Secrets:
   - `DEPLOY_HOST`: Your server's IP or hostname
   - `DEPLOY_USER`: SSH user for deployment
   - `DEPLOY_PATH`: Path on server (e.g., /var/www/createdao)
   - `SSH_PRIVATE_KEY`: Your deployment SSH private key
   - `SSH_KNOWN_HOSTS`: Server's SSH known hosts entry
   - `CLOUDFLARE_API_TOKEN`: Cloudflare API token
   - `CLOUDFLARE_ZONE_ID`: Your domain's Cloudflare Zone ID
   - `DOCKER_USERNAME`: Docker Hub username
   - `DOCKER_PASSWORD`: Docker Hub access token

   Security Notes:
   - Create a dedicated SSH key pair for deployment
   - Limit SSH user permissions to deployment tasks only
   - Keep your .env file secure on the production server
   - Never commit sensitive values to the repository

3. Server Setup:
```bash
# Create deployment directory
mkdir -p /var/www/createdao

# Set up SSH for deployment
# Add your deployment public key to ~/.ssh/authorized_keys
```

4. Cloudflare Setup:
   - Add your domain to Cloudflare
   - Create an API token with Cache Purge permissions
   - Configure SSL/TLS to Full (strict)
   - Add DNS A record pointing to your server IP

#### Version Management

The project uses Git tags for version management:
```bash
# Create a new version tag
git tag -a v1.0.0 -m "v1.0.0"
git push origin v1.0.0
```

The version number will automatically appear in the footer along with the commit hash.

#### Deployment

The project uses GitHub Actions for automated deployment:
- Pull requests trigger test environment deployment
- Merges to main branch trigger production deployment
- GitHub Actions will:
  1. Run tests and checks
  2. Get version from latest Git tag
  3. Build Docker image with version tag
  4. Deploy to appropriate environment
  5. Display version and commit hash in footer

Docker images are tagged with both:
- Latest tag: `createdao:latest`
- Version tag: `createdao:v1.0.0` (matches Git tag)

Manual deployment (if needed):
```bash
docker-compose up -d --build
```

To stop the application:
```bash
docker-compose down
```

### Using the Application

1. Connect your wallet using WalletConnect or MetaMask

2. Fill in the DAO creation form:
   - Select network from supported networks
   - Choose DAO version
   - DAO Name (required)
   - Token Name (required)
   - Token Symbol (required, max 5 characters)
   - Total Supply (required, must be positive number)

3. Deploy your DAO

The application will guide you through the deployment process and provide transaction status updates. Upon successful deployment, you'll receive:
- DAO contract address
- Token contract address
- Treasury contract address
- Staking contract address

Note: After deployment, 1 token will be sent to your wallet and the remaining tokens will be locked in the treasury.

4. Post-Deployment

To start managing your DAO, create proposals, launch presale, or manage team allocations, register your DAO at [dao.cafe](https://dao.cafe).

## Development

### Project Structure

```
src/
├── components/        # Reusable UI components
├── config/           # Configuration files
├── hooks/            # Custom React hooks
├── pages/            # Page components
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

## License

This project is licensed under the Business Source License 1.1 - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## Support

For support, please open an issue in the GitHub repository.
