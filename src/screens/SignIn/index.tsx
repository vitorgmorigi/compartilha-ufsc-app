import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import * as AuthSession from 'expo-auth-session';

import { Button } from '../../components/Button';
import { SignInContent } from '../../components/SignInContent';

import { styles } from './styles';

type AuthResponse = {
  type: string;
  params: {
    access_token: string;
  }
}

export function SignIn() {
  const navigation = useNavigation();

  async function handleSignIn() {
    const CLIENT_ID = "tccmorigi";
    const REDIRECT_URI = "tccmorigi://tccmorigi.setic_oauth.ufsc.br";
    const RESPONSE_TYPE = "code";
    const STATE = "E3ZYKC1T6H2yP4z";

    const authUrl = `https://sistemas.ufsc.br/oauth2.0/authorize?response_type=${RESPONSE_TYPE}&client_id=${CLIENT_ID}&state=${STATE}&redirect_uri=${REDIRECT_URI}`;

    const response = await AuthSession.startAsync({ authUrl, returnUrl: "exp://10.0.0.109:19000" });

    console.log("RESPONSE: ", response);

    if (response.type = "success") {
      navigation.navigate('Profile');
    }

  }

  return (
    <View style={styles.container}>
      <SignInContent />

      <Button
        title="Entrar com idUFSC"
        icon="social-google"
        onPress={handleSignIn}
      />
    </View>
  );
}