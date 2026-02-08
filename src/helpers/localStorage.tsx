import AsyncStorage from '@react-native-async-storage/async-storage';

/* ===================== STORE ===================== */

const storeData = async (
  key: string,
  data: string,
): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, data);
  } catch {
    // silent fail (same behavior)
  }
};

/* ===================== GET ===================== */

const getData = async (key: string): Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch {
    return null;
  }
};

/* ===================== CLEAR ===================== */

const clearAll = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch {
    // silent fail
  }
};

/* ===================== REMOVE ONE ===================== */

const removeKeyData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // silent fail
  }
};

/* ===================== REMOVE MULTIPLE ===================== */

const removeMultipleKeysDataFromLocalStorage = async (
  ...removeAllKeyDataExceptThisKeys: string[]
): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const filteredKeys = keys.filter(
      key => !removeAllKeyDataExceptThisKeys.includes(key),
    );
    await AsyncStorage.multiRemove(filteredKeys);
  } catch {
    // silent fail
  }
};

/* ===================== GET ALL KEYS ===================== */

const getAllKeys = async (): Promise<readonly string[] | undefined> => {
  try {
    return await AsyncStorage.getAllKeys();
  } catch {
    return undefined;
  }
};

/* ===================== EXPORTS ===================== */

export {
  storeData,
  getData,
  clearAll,
  removeKeyData,
  removeMultipleKeysDataFromLocalStorage,
  getAllKeys,
};
