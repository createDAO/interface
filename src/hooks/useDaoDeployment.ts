import { useChainId } from 'wagmi'
import { useWriteContract } from 'wagmi'
import { parseEther, decodeEventLog, type Hex } from 'viem'
import { env } from '../config/env'
import { getContractAddresses, getContractABI } from '../config/contracts'
import { DAOFormData, DeploymentResult } from '../types/dao'
import { useTransaction, formatTransactionError } from './useTransaction'
import type { TransactionReceipt } from '../types/transaction'
import type { BaseError } from 'viem'

// Helper to parse receipt for deployed addresses
function parseReceipt(receipt: TransactionReceipt | undefined): DeploymentResult | null {
  if (!receipt) return null

  // Find the DAOCreated event
  // Type assertion since we know the logs will be compatible with ViemLog
  const event = receipt.logs.find((log) => {
    try {
      const decodedLog = decodeEventLog({
        abi: getContractABI('daoFactory'),
        data: log.data as Hex,
        topics: log.topics as [Hex, ...Hex[]],
      })
      return decodedLog.eventName === 'DAOCreated'
    } catch {
      return false
    }
  })

  if (!event) return null

  // Decode the event data
  const decodedEvent = decodeEventLog({
    abi: getContractABI('daoFactory'),
    data: event.data as Hex,
    topics: event.topics as [Hex, ...Hex[]],
  })

  // Type assertion since we know the event structure
  const args = decodedEvent.args as unknown as {
    daoAddress: string;
    tokenAddress: string;
    treasuryAddress: string;
    stakingAddress: string;
    name: string;
    versionId: string;
  };

  return {
    daoAddress: args.daoAddress,
    tokenAddress: args.tokenAddress,
    treasuryAddress: args.treasuryAddress,
    stakingAddress: args.stakingAddress,
    name: args.name,
    versionId: args.versionId,
    transactionHash: receipt.transactionHash,
  }
}

export function useDaoDeployment() {
  const chainId = useChainId()
  const addresses = chainId ? getContractAddresses(chainId) : null
  const { writeContractAsync } = useWriteContract()
  const transaction = useTransaction()

  const deploy = async (formData: DAOFormData): Promise<DeploymentResult> => {
    if (!addresses) {
      throw new Error('No contract addresses found for current network')
    }

    if (!addresses.daoFactory || addresses.daoFactory === '0x') {
      throw new Error('DAO Factory contract address is not configured')
    }

    try {
      // Reset state
      transaction.reset()

      // Convert total supply to wei
      const totalSupplyWei = parseEther(formData.totalSupply)

      // Set waiting for signature
      transaction.setWaitingForSignature()

      // Write contract and wait for hash
      const hash = await writeContractAsync({
        address: addresses.daoFactory as `0x${string}`,
        abi: getContractABI('daoFactory'),
        functionName: 'createDAO',
        args: [
          formData.versionId || env.dao.version,
          formData.daoName,
          formData.tokenName,
          formData.symbol,
          totalSupplyWei
        ],
      })

      // Set waiting for confirmation
      transaction.setWaitingForConfirmation(hash)

      return {
        transactionHash: hash,
      } as DeploymentResult
    } catch (error) {
      // Format and set error state
      transaction.setError(formatTransactionError(error as BaseError))
      // Re-throw for component error handling
      throw error
    }
  }

  // Parse deployment data from receipt
  const deploymentData = transaction.state.receipt ? parseReceipt(transaction.state.receipt) : null

  return {
    deploy,
    state: transaction.state,
    deploymentData,
  }
}
