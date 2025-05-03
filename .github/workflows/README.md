# GitHub Workflows for CreateDAO v2

This directory contains GitHub Actions workflows for CI/CD of the CreateDAO v2 project.

## Workflows

### 1. Pull Request Checks (`pr.yml`)

This workflow runs on pull requests to the `main` branch and performs the following checks:
- TypeScript type checking
- Linting
- Build verification

### 2. CI/CD Pipeline (`main.yml`)

This workflow runs on pushes to the `main` branch and manual triggers. It:
- Runs all checks (TypeScript, linting, build)
- Deploys to production (if on main branch or manually triggered)
- Creates a GitHub release
- Purges Cloudflare cache (if configured)

## Required Secrets

For the deployment workflow to function properly, you need to set up the following secrets in your GitHub repository:

### SSH Deployment

- `SSH_PRIVATE_KEY`: The private SSH key for connecting to your server
- `SSH_KNOWN_HOSTS`: The SSH known hosts entry for your server
- `DEPLOY_HOST`: The hostname or IP address of your server
- `DEPLOY_USER`: The username to use when connecting to your server
- `DEPLOY_PATH`: The path on your server where the application should be deployed

### Cloudflare Cache Purging (Optional)

- `CLOUDFLARE_ZONE_ID`: Your Cloudflare Zone ID
- `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token with cache purge permissions

## Docker Deployment

The deployment workflow uses Docker and docker-compose to deploy the application. Make sure Docker and docker-compose are installed on your server:

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install docker-compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.6/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

## Environment Variables

The workflow will:
1. Get the existing `.env` file from your server
2. Add `NEXT_PUBLIC_COMMIT_HASH` and `NEXT_PUBLIC_APP_VERSION` variables
3. Use this updated `.env` file for the deployment

## First-Time Setup

Before the first deployment, you should manually set up the deployment directory on your server:

1. Create the deployment directory:
   ```bash
   mkdir -p /path/to/deployment
   ```

2. Create an initial `.env` file with any required environment variables, including:
   ```
   NGINX_SERVER_NAME=your-domain.com
   ```

## Docker Configuration

The deployment includes:

1. **Dockerfile**: Multi-stage build for Next.js with Nginx
2. **docker-compose.yml**: Container orchestration with proper networking
3. **nginx.conf**: Nginx configuration optimized for Next.js

The workflow will automatically build and deploy the Docker containers on each deployment.
