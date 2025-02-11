import { useCallback, useState } from 'react'
import { type Address, createPublicClient, http } from 'viem'
import { getContractABI, getContractAddresses } from '../config/contracts'
import { SUPPORTED_NETWORKS } from '../config/networks'

interface VerificationResult {
  daoAddress: Address
  tokenAddress: Address
  treasuryAddress: Address
  stakingAddress: Address
  name: string
  versionId: string
}

interface VerificationState {
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  error?: string
  data?: VerificationResult
}

export function useDAOVerification() {
  const [state, setState] = useState<VerificationState>({
    isLoading: false,
    isSuccess: false,
    isError: false
  })

  const verify = useCallback(async (daoAddress: string, chainId: number) => {
    setState({ isLoading: true, isSuccess: false, isError: false })
    
    try {
      const network = SUPPORTED_NETWORKS.find(n => n.id === chainId)
      if (!network) {
        throw new Error('Unsupported network')
      }

      // Use configured RPC URL
      const rpcUrl = network.rpcUrls.default.http[0]
      if (!rpcUrl) {
        throw new Error(`RPC URL not configured for ${network.name}. Please check your environment variables.`)
      }

      // Validate RPC URL format
      try {
        new URL(rpcUrl)
      } catch {
        throw new Error(`Invalid RPC URL format for ${network.name}. Please check your environment variables.`)
      }

      const publicClient = createPublicClient({
        chain: network,
        transport: http(rpcUrl, {
          timeout: 30000, // 30s timeout
          retryCount: 3,
          retryDelay: 1000, // 1s between retries
        })
      })

      const factoryAddress = getContractAddresses(chainId).daoFactory
      const factoryABI = getContractABI('daoFactory')

      // Get current block and start from 100000 blocks back
      const latestBlock = await publicClient.getBlockNumber()
      const fromBlock = latestBlock - 100000n > 0n ? latestBlock - 100000n : 0n

      setState(prev => ({
        ...prev,
        isLoading: true,
        error: 'Searching for DAO creation event...'
      }))

      // Get logs with event and address filtering
      const logs = await publicClient.getLogs({
        address: factoryAddress,
        event: factoryABI[1], // DAOCreated event from ABI
        args: {
          daoAddress: daoAddress as Address
        },
        fromBlock,
        toBlock: latestBlock,
        strict: true
      })

      if (logs.length === 0) {
        setState({
          isLoading: false,
          isSuccess: false,
          isError: true,
          error: `DAO ${daoAddress} was not created through the official factory contract ${factoryAddress} on ${network.name}.`
        })
        return
      }

      // Get the first matching event
      const event = logs[0]

      setState({
        isLoading: false,
        isSuccess: true,
        isError: false,
        data: {
          daoAddress: event.args.daoAddress,
          tokenAddress: event.args.tokenAddress,
          treasuryAddress: event.args.treasuryAddress,
          stakingAddress: event.args.stakingAddress,
          name: event.args.name,
          versionId: event.args.versionId
        }
      })
    } catch (error) {
      setState({
        isLoading: false,
        isSuccess: false,
        isError: true,
        error: error instanceof Error ? error.message : 'Verification failed'
      })
    }
  }, [])

  return {
    verify,
    state
  }
}
