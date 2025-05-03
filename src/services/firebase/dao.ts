import { where, orderBy, Timestamp, QueryConstraint } from 'firebase/firestore'; 
import { addDocument, getDocument, queryDocuments, getAllDocuments } from './firestore';
import { DeploymentResult, NetworkInfo } from '../../types/dao';
import { getCacheItem, setCacheItem, generateDAOCacheKey, clearCacheItem } from '../../utils/firebaseCache';

// Collection name for DAOs
const COLLECTION_NAME = 'daos';

// Interface for DAO record in Firestore
export interface DAORecord {
  id: string;                  // Auto-generated or based on transaction hash
  name: string;                // DAO name
  tokenName: string;           // Token name
  symbol: string;              // Token symbol
  totalSupply: string;         // Total supply
  daoAddress: string;          // DAO contract address
  tokenAddress: string;        // Token contract address
  treasuryAddress: string;     // Treasury contract address
  stakingAddress: string;      // Staking contract address
  transactionHash: string;     // Transaction hash
  networkId: number;           // Network ID
  networkName: string;         // Network name
  creatorAddress: string;      // Creator's wallet address
  timestamp: Timestamp;        // Creation timestamp
  versionId: string;           // DAO version ID
  createdAt?: Timestamp;       // Document creation timestamp (added by Firestore service)
  updatedAt?: Timestamp;       // Document update timestamp (added by Firestore service)
}

// Function to save a DAO to Firestore
export async function saveDAO(
  deploymentData: DeploymentResult,
  formData: {
    daoName: string;
    tokenName: string;
    symbol: string;
    totalSupply: string;
  },
  network: NetworkInfo,
  creatorAddress: string
): Promise<string> {
  try {
    // Create DAO record
    const daoRecord: Omit<DAORecord, 'id' | 'createdAt' | 'updatedAt'> = {
      name: formData.daoName,
      tokenName: formData.tokenName,
      symbol: formData.symbol,
      totalSupply: formData.totalSupply,
      daoAddress: deploymentData.daoAddress,
      tokenAddress: deploymentData.tokenAddress,
      treasuryAddress: deploymentData.treasuryAddress,
      stakingAddress: deploymentData.stakingAddress,
      transactionHash: deploymentData.transactionHash,
      networkId: network.id,
      networkName: network.name,
      creatorAddress: creatorAddress,
      timestamp: Timestamp.now(),
      versionId: deploymentData.versionId || '1.0.0',
    };

    // Use network ID + transaction hash as document ID to ensure uniqueness across chains
    const docId = `${network.id}-${deploymentData.transactionHash}`;
    const result = await addDocument<Omit<DAORecord, 'id' | 'createdAt' | 'updatedAt'>>(
      COLLECTION_NAME,
      daoRecord,
      docId
    );
    
    // Clear cache for all DAOs and network-specific DAOs
    clearCacheItem(generateDAOCacheKey(null, 1, 10)); // Clear first page of all DAOs
    clearCacheItem(generateDAOCacheKey(network.id, 1, 10)); // Clear first page of network DAOs
    
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error saving DAO to Firestore:', error);
    } else {
      console.error('Error saving DAO to Firestore:', String(error));
    }
    throw error;
  }
}

// Function to get a DAO by transaction hash
export async function getDAOByTransactionHash(transactionHash: string): Promise<DAORecord | null> {
  return await getDocument<DAORecord>(COLLECTION_NAME, transactionHash);
}

// Function to get all DAOs with pagination
export async function getAllDAOs(
  limitCount?: number,
  offsetCount?: number
): Promise<{ data: DAORecord[], totalCount: number }> {
  // Generate cache key
  const cacheKey = generateDAOCacheKey(null, offsetCount ? Math.floor(offsetCount / (limitCount || 10)) + 1 : 1, limitCount || 10);
  
  // Check cache first
  const cachedResult = getCacheItem<{ data: DAORecord[], totalCount: number }>(cacheKey);
  if (cachedResult) {
    console.log(`Using cached DAOs data for ${cacheKey}`);
    return cachedResult;
  }
  
  // Fetch from Firestore if not in cache
  const result = await getAllDocuments<DAORecord>(COLLECTION_NAME, 'timestamp', true, limitCount, offsetCount);
  
  // Cache the result
  setCacheItem(cacheKey, result);
  
  return result;
}

// Function to get DAOs by creator address
export async function getDAOsByCreator(creatorAddress: string): Promise<DAORecord[]> {
  try {
    const constraints: QueryConstraint[] = [
      where('creatorAddress', '==', creatorAddress),
      orderBy('timestamp', 'desc')
    ];
    
    const result = await queryDocuments<DAORecord>(COLLECTION_NAME, constraints);
    return result.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error getting DAOs by creator:', error);
      // If there's a Firebase index error, return an empty array
      if (error.name === 'FirebaseError' && error.message?.includes('The query requires an index')) {
        console.log('Firebase index error in getDAOsByCreator, returning empty array');
        return [];
      }
    } else {
      console.error('Error getting DAOs by creator:', String(error));
    }
    // For other errors, rethrow
    throw error;
  }
}

// Function to get DAOs by network with pagination
export async function getDAOsByNetwork(
  networkId: number,
  limitCount?: number,
  offsetCount?: number
): Promise<{ data: DAORecord[], totalCount: number }> {
  try {
    // Generate cache key
    const cacheKey = generateDAOCacheKey(networkId, offsetCount ? Math.floor(offsetCount / (limitCount || 10)) + 1 : 1, limitCount || 10);
    
    // Check cache first
    const cachedResult = getCacheItem<{ data: DAORecord[], totalCount: number }>(cacheKey);
    if (cachedResult) {
      console.log(`Using cached network DAOs data for ${cacheKey}`);
      return cachedResult;
    }
    
    const constraints: QueryConstraint[] = [
      where('networkId', '==', networkId),
      orderBy('timestamp', 'desc'),
    ];

    // Fetch from Firestore if not in cache
    const result = await queryDocuments<DAORecord>(COLLECTION_NAME, constraints, limitCount, offsetCount);
    
    // Cache the result
    setCacheItem(cacheKey, result);
    
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error getting DAOs by network:', error);
      // If there's a Firebase index error, return empty data and count 0
      if (error.name === 'FirebaseError' && error.message?.includes('The query requires an index')) {
        console.log('Firebase index error in getDAOsByNetwork, returning empty data and count 0');
        return { data: [], totalCount: 0 };
      }
    } else {
      console.error('Error getting DAOs by network:', String(error));
    }
    // For other errors, rethrow
    throw error;
  }
}

// Function to check if a DAO with the given transaction hash and network already exists
export async function daoExists(transactionHash: string, networkId?: number): Promise<boolean> {
  try {
    if (networkId) {
      // If network ID is provided, check for the specific combination
      const constraints: QueryConstraint[] = [
        where('transactionHash', '==', transactionHash),
        where('networkId', '==', networkId)
      ];
      
      const daos = await queryDocuments<DAORecord>(COLLECTION_NAME, constraints);
      return daos.data.length > 0;
    } else {
      // Fallback to just checking the transaction hash
      const dao = await getDAOByTransactionHash(transactionHash);
      return dao !== null;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error checking if DAO exists:', error);
      // If there's a Firebase index error, assume the DAO doesn't exist
      if (error.name === 'FirebaseError' && error.message?.includes('The query requires an index')) {
        console.log('Firebase index error in daoExists, assuming DAO does not exist');
        return false;
      }
    } else {
      console.error('Error checking if DAO exists:', String(error));
    }
    // For other errors, rethrow
    throw error;
  }
}
