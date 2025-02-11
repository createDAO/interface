import { useChainId } from 'wagmi'
import { useWriteContract } from 'wagmi'
import { parseEther, decodeEventLog, Log } from 'viem'
import { env } from '../config/env'
import { getContractAddresses, getContractABI } from '../config/contracts'
import { DAOFormData, DeploymentResult } from '../types/dao'
import { useTransaction, formatTransactionError } from './useTransaction'
import { TransactionReceipt } from '../types/transaction'

// Helper to parse receipt for deployed addresses
function parseReceipt(receipt: TransactionReceipt | undefined): DeploymentResult | null {
  if (!receipt) return null

  // Find the DAOCreated event
  const event = receipt.logs.find((log: Log) => {
    try {
      const decodedLog = decodeEventLog({
        abi: getContractABI('daoFactory'),
        data: log.data,
        topics: log.topics,
      })
      return decodedLog.eventName === 'DAOCreated'
    } catch {
      return false
    }
  })

  if (!event) return null

  // Decode the event data
  const decodedEvent = decodeEventLog<{
    args: {
      daoAddress: string;
      tokenAddress: string;
      treasuryAddress: string;
      stakingAddress: string;
      name: string;
      versionId: string;
    };
  }>({
    abi: getContractABI('daoFactory'),
    data: event.data,
    topics: event.topics,
  })

  return {
    daoAddress: decodedEvent.args.daoAddress,
    tokenAddress: decodedEvent.args.tokenAddress,
    treasuryAddress: decodedEvent.args.treasuryAddress,
    stakingAddress: decodedEvent.args.stakingAddress,
    name: decodedEvent.args.name,
    versionId: decodedEvent.args.versionId,
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
      transaction.setError(formatTransactionError(error))
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
