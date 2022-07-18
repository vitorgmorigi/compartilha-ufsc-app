import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ProfileHeader } from '../../components/ProfileHeader';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';

import { styles } from './styles';
import { theme } from '../../styles/theme';
import { getProfile } from '../../requests';
import { Loading } from '../../components/Loading';

type Data = {
  id: string;
  cpf: string;
  birthday: string;
  email: string;
  institutionalEmail: string;
  login: string;
  name: string;
  privateCircles: string[];
}

type Body = {
  success: boolean;
  message: string;
  data: Data;
}

export type ResponseAPISignIn = {
  body: Body;
}

type Params = {
  token: string;
}

export function Profile() {
  const [profile, setProfile] = useState({} as Data)

  const navigation = useNavigation();
  const route = useRoute();

  const [loading, setLoading] = useState(false);

  const { token } = route.params as Params;

  async function handleLogout() {
    navigation.navigate('SignIn');
  }

  async function handleUserItemListing() {
    navigation.navigate('UserItemListing', { token });
  }

  async function handleCircleItemListing() {
    navigation.navigate('CircleItemListing', { token, isFeed: true });
  }

  async function handleCircleListing() {
    navigation.navigate('CircleListing', { token });
  }

  async function handleCreateItem() {
    navigation.navigate('CreateItem', { token });
  }

  async function loadProfile() {
    setLoading(true);

    const response = await getProfile(token);
    
    const responseJson: ResponseAPISignIn = await response.json();
    
    const profile = responseJson.body.data;
    
    await AsyncStorage.setItem('@user_profile', JSON.stringify(profile))
    
    setProfile(profile);
    setLoading(false);
  }

  useEffect(() => {
    loadProfile();
  }, [])

  return (
    <View style={styles.container}>
      <ProfileHeader />

      <View style={styles.content}>
        <View style={styles.profile}>
          <Avatar
            source={{ uri: 'https://www.seekpng.com/png/detail/402-4022635_avatar-generic-person-icon.png' }}
          />

          <Text style={styles.name}>
            { profile.name }
          </Text>

          <View style={styles.email}>
            <Feather name="mail" color={theme.colors.secondary} size={18} />
            <Text style={styles.emailText}>
              { profile.email }
            </Text>
          </View>
        </View>

        <View style={styles.about}>
          <View style={styles.info}>
            <Feather
              name="user"
              size={34}
              color={theme.colors.note}
            />
            <Text style={styles.label}>
              Login
            </Text>
            <Text style={styles.text}>
              { profile.login }
            </Text>
          </View>

          <View style={styles.info}>
            <Feather
              name="smile"
              size={34}
              color={theme.colors.note}
            />
            <Text style={styles.label}>
              Pontuação
            </Text>
            <Text style={styles.text}>
              { 0 }
            </Text>
          </View>
        </View>

        <View style={styles.buttons}>
          <Button
            title="Visualizar Feed"
            icon="feed"
            onPress={handleCircleItemListing}
          />
        </View>

        <View style={styles.buttons}>
          <Button
            title="Visualizar Círculos"
            icon="eye"
            onPress={handleCircleListing}
          />
        </View>

        <View style={styles.buttons}>
          <Button
            title="Meus itens publicados"
            icon="cloud-upload"
            onPress={handleUserItemListing}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="Publicar item"
            icon="rocket"
            onPress={handleCreateItem}
          />
        </View>


        <Loading enabled={loading}/>
      </View>
    </View>
  );
}