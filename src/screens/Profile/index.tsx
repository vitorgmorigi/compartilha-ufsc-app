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

type ResponseAPISignIn = {
  body: Body;
}

type Params = {
  token: string;
}

export function Profile() {
  const [profile, setProfile] = useState({} as Data)

  const navigation = useNavigation();
  const route = useRoute();

  const { token } = route.params as Params;

  async function handleLogout() {
    navigation.navigate('SignIn');
  }

  async function handleCircleScreen() {
    navigation.navigate('CircleScreen', { token });
  }

  async function loadProfile() {
    const options = {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json;charset=UTF-8",
      }
    };

    const response = await fetch(`https://us-central1-compartilha-ufsc.cloudfunctions.net/api/login`, options);
    
    const responseJson: ResponseAPISignIn = await response.json();
    console.log("Response do endpoint: ", responseJson);
    
    const profile = responseJson.body.data;
    
    await AsyncStorage.setItem('@user_profile', JSON.stringify(profile))
    
    setProfile(profile);
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
            source={{ uri: 'https://github.com/vitorgmorigi.png' }}
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
              name="heart"
              size={34}
              color={theme.colors.note}
            />
            <Text style={styles.label}>
              E-mail
            </Text>
            <Text style={styles.text}>
              { profile.institutionalEmail }
            </Text>
          </View>
        </View>

        <View style={styles.locale}>
          <Feather
            name="map-pin"
            size={18}
            color={theme.colors.note}
          />

          <Text style={styles.localeText}>
            Localidade do perfil do usuário: pt-BR
          </Text>
        </View>

        <Button
          title="Ver Círculos"
          icon="power"
          onPress={handleCircleScreen}
        />
      </View>
    </View>
  );
}