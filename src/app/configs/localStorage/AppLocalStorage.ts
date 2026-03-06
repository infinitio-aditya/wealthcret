import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Application Local Storage Utilities
 * 
 * Wrapper around React Native AsyncStorage for:
 * - Token storage/retrieval
 * - User data persistence
 * - App preferences
 * - Session management
 */

/**
 * Get string data from local storage
 * @param key - Storage key
 * @returns Promise resolving to stored string or null
 */
export const getStringDataFromLocal = async (key: string): Promise<string | null> => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data;
  } catch (error) {
    console.error(`Error retrieving ${key} from storage:`, error);
    return null;
  }
};

/**
 * Get object data from local storage
 * @param key - Storage key
 * @returns Promise resolving to parsed object or null
 */
export const getObjectDataFromLocal = async (key: string): Promise<any | null> => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error retrieving object ${key} from storage:`, error);
    return null;
  }
};

/**
 * Store string data in local storage
 * @param key - Storage key
 * @param value - Value to store
 */
export const setStringDataToLocal = async (key: string, value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error storing ${key} to storage:`, error);
  }
};

/**
 * Store object data in local storage
 * @param key - Storage key
 * @param value - Object value to store
 */
export const setObjectDataToLocal = async (key: string, value: any): Promise<void> => {
  try {
    const jsonString = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonString);
  } catch (error) {
    console.error(`Error storing object ${key} to storage:`, error);
  }
};

/**
 * Delete data from local storage
 * @param key - Storage key
 * @param deleteAll - If true, deletes all storage (use with caution)
 */
export const deleteStringDataFromLocal = async (
  key: string,
  deleteAll: boolean = false
): Promise<void> => {
  try {
    if (deleteAll) {
      await AsyncStorage.clear();
      console.log('All local storage cleared');
    } else {
      await AsyncStorage.removeItem(key);
    }
  } catch (error) {
    console.error(`Error deleting ${key} from storage:`, error);
  }
};

/**
 * Check if key exists in storage
 * @param key - Storage key
 * @returns Promise resolving to boolean
 */
export const keyExistsInLocal = async (key: string): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null;
  } catch (error) {
    console.error(`Error checking key ${key} in storage:`, error);
    return false;
  }
};
