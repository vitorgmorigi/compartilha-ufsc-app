import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import * as AuthSession from 'expo-auth-session';

import { Button } from '../../components/Button';
import { SignInContent } from '../../components/SignInContent';

import { styles } from './styles';
import { getToken } from '../../requests';
import { Loading } from '../../components/Loading';

type AuthorizationCodeResponse = {
  type: string;
  params: {
    code: string;
  }
}

type TokenResponse = {
  response: {
    access_token: string;
  }
}

export function SignIn() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    setLoading(true);
    const CLIENT_ID = "tccmorigi";
    const REDIRECT_URI = "tccmorigi://tccmorigi.setic_oauth.ufsc.br";
    const RESPONSE_TYPE = "code";
    const STATE = "E3ZYKC1T6H2yP4z";

    const authUrl = `https://sistemas.ufsc.br/oauth2.0/authorize?response_type=${RESPONSE_TYPE}&client_id=${CLIENT_ID}&state=${STATE}&redirect_uri=${REDIRECT_URI}`;

    const response = await AuthSession.startAsync({ authUrl, returnUrl: REDIRECT_URI }) as AuthorizationCodeResponse;
      
      if (response.type === "success") {
        const tokenResponse = await getToken(response.params.code);
  
        const tokenResponseJson: TokenResponse = await tokenResponse.json();

        setLoading(false);

        navigation.navigate('Profile', { token: tokenResponseJson.response.access_token });
      }

  }

  return (
    <View style={styles.container}>
      <SignInContent />

      <Button
        title="Entrar com idUFSC"
        icon="rocket"
        onPress={handleSignIn}
      />
      <Loading enabled={loading}/>
    </View>
  );
}