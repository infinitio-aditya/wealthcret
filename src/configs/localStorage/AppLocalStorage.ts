import AsyncStorage from '@react-native-async-storage/async-storage';


export const getStringDataFromLocal = async (key: string) => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value;
    } catch (e) {
        console.log('Exception occurred while getting local data' + e);
    }
    return null;
};

export const getObjectDataFromLocal = async (key: string) => {
    const objectData = await getStringDataFromLocal(key);
    return objectData !== null ? JSON.parse(objectData) : null;
};

export const setStringDataToLocal = async (key: string, value: string) => {
    try {
        AsyncStorage.setItem(key, value);
    } catch (e) {

    }
};

export const deleteStringDataFromLocal = async (key: string, all: boolean) => {
    try {
        AsyncStorage.removeItem(key);
        if (all) {
            await AsyncStorage.clear();
        }
    } catch (e) {

    }
};
