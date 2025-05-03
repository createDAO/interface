import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  Timestamp,
  DocumentData,
  QueryConstraint,
  DocumentReference,
  CollectionReference,
  getCountFromServer,
} from 'firebase/firestore';
import { db } from './config';
import { getCacheItem, setCacheItem, generateDAOCacheKey } from '../../utils/firebaseCache';
import { isFirebaseConfigured } from './config';

// Generic function to add a document to a collection
export async function addDocument<T extends DocumentData>(
  collectionName: string,
  data: T,
  id?: string
): Promise<string> {
  try {
    const collectionRef = collection(db, collectionName);
    let docRef: DocumentReference;

    if (id) {
      // Use provided ID
      docRef = doc(collectionRef, id);
      await setDoc(docRef, {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return id;
    } else {
      // Generate a new ID
      docRef = doc(collectionRef);
      await setDoc(docRef, {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    }
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    throw error;
  }
}

// Generic function to get a document by ID
export async function getDocument<T>(
  collectionName: string,
  id: string
): Promise<T | null> {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error);
    throw error;
  }
}

// Generic function to query documents from a collection with pagination and total count
export async function queryDocuments<T>(
  collectionName: string,
  constraints: QueryConstraint[] = [],
  limitCount?: number,
  offsetCount: number = 0
): Promise<{ data: T[], totalCount: number }> {
  try {
    // Check if Firebase is configured
    if (!isFirebaseConfigured()) {
      console.warn('Firebase is not properly configured. Returning empty data.');
      return { data: [], totalCount: 0 };
    }
    
    // Generate cache key based on collection name, constraints, limit, and offset
    const cacheKey = `${collectionName}_${JSON.stringify(constraints)}_${limitCount || 0}_${offsetCount}`;
    
    // Check cache first
    const cachedResult = getCacheItem<{ data: T[], totalCount: number }>(cacheKey);
    if (cachedResult) {
      console.log(`Using cached data for ${cacheKey}`);
      return cachedResult;
    }
    
    const collectionRef = collection(db, collectionName);

    // Query for the total count first (without pagination constraints)
    const countBaseConstraints = constraints.filter(c => 
      c.type !== 'orderBy' && c.type !== 'limit' && 
      c.type !== 'startAt' && c.type !== 'startAfter' && 
      c.type !== 'endAt' && c.type !== 'endBefore'
    );
    const countQuery = query(collectionRef, ...countBaseConstraints);
    const countSnapshot = await getCountFromServer(countQuery);
    const totalCount = countSnapshot.data().count;

    // Build the data query with original constraints + ordering
    const dataConstraints = [...constraints];

    // Apply limit. If offset is used, fetch offset + limit items.
    const hasOrderBy = dataConstraints.some(c => c.type === 'orderBy');
    if (!hasOrderBy && (offsetCount > 0 || limitCount)) {
        console.warn(`Pagination (limit/offset) used without an orderBy constraint in queryDocuments for collection ${collectionName}. Order may be unpredictable.`);
    }

    let effectiveLimit = limitCount;
    if (offsetCount > 0 && limitCount) {
        effectiveLimit = offsetCount + limitCount;
    } else if (offsetCount > 0) {
        effectiveLimit = offsetCount + (limitCount || 50);
        console.warn(`Offset used without limit in queryDocuments for ${collectionName}. Fetching ${effectiveLimit} documents.`);
    }

    if (effectiveLimit) {
        dataConstraints.push(limit(effectiveLimit));
    }

    // Execute the data query
    const dataQuery = query(collectionRef, ...dataConstraints);
    const querySnapshot = await getDocs(dataQuery);

    // Map results
    let mappedData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];

    // Apply offset slicing if necessary
    if (offsetCount > 0 && mappedData.length > offsetCount) {
        mappedData = mappedData.slice(offsetCount);
    }
    
    // Ensure the final data does not exceed the original limitCount if both offset and limit were provided
    if (offsetCount > 0 && limitCount && mappedData.length > limitCount) {
       mappedData = mappedData.slice(0, limitCount);
    }

    // Cache the result
    const result = { data: mappedData, totalCount };
    setCacheItem(cacheKey, result);
    
    return result;

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error querying documents from ${collectionName}:`, error);
      // Check if this is a Firebase index error
      if (error.name === 'FirebaseError' && error.message?.includes('The query requires an index')) {
        console.log(`Firebase index error in ${collectionName}, returning empty data and count 0`);
        return { data: [] as T[], totalCount: 0 };
      }
    } else {
      console.error(`Error querying documents from ${collectionName}:`, String(error));
    }
    // For other errors, rethrow
    throw error;
  }
}

// Generic function to get all documents from a collection with pagination
export async function getAllDocuments<T>(
  collectionName: string,
  orderByField: string = 'createdAt',
  descending: boolean = true,
  limitCount?: number,
  offsetCount?: number
): Promise<{ data: T[], totalCount: number }> {
  try {
    // Check if Firebase is configured
    if (!isFirebaseConfigured()) {
      console.warn('Firebase is not properly configured. Returning empty data.');
      return { data: [], totalCount: 0 };
    }
    
    // For DAO collection, use the specialized cache key
    const useSpecializedCache = collectionName === 'daos';
    const cacheKey = useSpecializedCache 
      ? generateDAOCacheKey(null, offsetCount ? Math.floor(offsetCount / (limitCount || 10)) + 1 : 1, limitCount || 10)
      : `${collectionName}_all_${orderByField}_${descending}_${limitCount || 0}_${offsetCount || 0}`;
    
    // Check cache first
    const cachedResult = getCacheItem<{ data: T[], totalCount: number }>(cacheKey);
    if (cachedResult) {
      console.log(`Using cached data for ${cacheKey}`);
      return cachedResult;
    }
    
    const constraints: QueryConstraint[] = [
      orderBy(orderByField, descending ? 'desc' : 'asc'),
    ];

    // Get data from Firestore
    const result = await queryDocuments<T>(collectionName, constraints, limitCount, offsetCount);
    
    // Cache the result
    setCacheItem(cacheKey, result);
    
    return result;
  } catch (error: unknown) {
    console.error(`Error getting all documents from ${collectionName}:`, error);
    
    // Check if this is a Firebase index error
    if (
      typeof error === 'object' && 
      error !== null && 
      'name' in error && 
      'message' in error &&
      error.name === 'FirebaseError' &&
      typeof error.message === 'string' &&
      error.message.includes('The query requires an index')
    ) {
      console.log(`Firebase index error in getAllDocuments for ${collectionName}, returning empty data and count 0`);
      return { data: [] as T[], totalCount: 0 };
    }

    // For other errors, re-throw
    throw error;
  }
}

// Helper to create a collection reference with type safety
export function getCollectionRef<T>(collectionName: string): CollectionReference<T> {
  return collection(db, collectionName) as CollectionReference<T>;
}
