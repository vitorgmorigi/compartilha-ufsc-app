import { getProfile } from "../requests";
import { ResponseAPISignIn } from "../screens/Profile";
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function updateProfile(token: string) {
    const response = await getProfile(token);
    
    const responseJson: ResponseAPISignIn = await response.json();
    
    const profile = responseJson.body.data;
    
    await AsyncStorage.setItem('@user_profile', JSON.stringify(profile))
}