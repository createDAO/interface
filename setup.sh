#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install

# Install additional dependencies for wallet connection
echo "Installing wallet connection dependencies..."
npm install viem wagmi

# Run the application
echo "Starting the application..."
npm run dev
