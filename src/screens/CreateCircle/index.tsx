import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';

import { ScrollView, Text, View } from "react-native";
import { TextInput } from 'react-native-gesture-handler';
import { RadioButton } from 'react-native-paper';

import { styles } from './styles';
import { Button } from '../../components/Button';
import { createCircle } from '../../requests';
import { showMessage } from 'react-native-flash-message';
import { theme } from '../../styles/theme';
import { Loading } from '../../components/Loading';

export type PayloadCreateItemAPI = {
  name: string;
  description: string;
  expiration_date: string;
  localization: string;
  circle: {
    id: string;
    name: string;
    visibility: string;
  };
  conservation_state: string;
  category: {
    id: string;
    name: string;
  }
  image: {
    uri: string;
    type: string;
    name: string;
  };
}

type Params = {
    token: string;
  }

export function CreateCircle() {    
    const navigation = useNavigation();

    const route = useRoute();

    const [name, setName] = useState('');

    const [loading, setLoading] = useState(false);

    const [visibility, setVisibility] = useState('' as 'public' | 'private');

    const [password, setPassword] = useState('');

    const { token } = route.params as Params;

    async function handleCreateCircle() {
        setLoading(true);
        const response = await createCircle(token, name, visibility, password);
  
        if (response.ok) {
          showMessage({
            message: "Círculo criado com sucesso",
            type: "success",
          });

          setLoading(false);
  
          return navigation.navigate('Profile', { token });
        }
  
        showMessage({
          message: "Houve um erro ao criar o círculo",
          type: "danger",
        });

        setLoading(false);
      }

   return <View style={styles.container}> 
     <View style={styles.content}>
       <Text style={styles.title}>Criar Círculo</Text>
            <ScrollView>
                <Text style={styles.subtitle}>Nome:</Text>
                <TextInput
                  style={styles.modalText}
                  keyboardType="default"
                  onChangeText={name => setName(name)}
                />
                <Text style={styles.subtitle}>Visibilidade:</Text>
                <View style={{flex: 1, justifyContent: 'center', flexDirection: 'row'}}>
                  <Text style={styles.subtitle}>Público:</Text>
                  <RadioButton
                      value='public'
                      uncheckedColor={theme.colors.secondary}
                      color={theme.colors.secondary}
                      status={visibility === 'public' ? 'checked' : 'unchecked'}
                      onPress={() => setVisibility('public')} 
                  />
                  <Text style={{...styles.subtitle, marginLeft: 20} }>Privado:</Text>  
                  <RadioButton
                      value='private'
                      uncheckedColor={theme.colors.secondary}
                      color={theme.colors.secondary}
                      status={visibility === 'private' ? 'checked' : 'unchecked'}
                      onPress={() => setVisibility('private')} 
                  />
                </View>
                <Text style={styles.subtitle}>Senha:</Text>  
                <TextInput
                  style={{...styles.modalText, backgroundColor: visibility === 'private' ? 'white' : '#808080'}}
                  secureTextEntry={true}
                  keyboardType="default"
                  editable={visibility === 'private'}
                  onChangeText={password => setPassword(password)}
                />  
                <View style={styles.buttons}>      
                  <Button
                    title="Criar Círculo"
                    icon='rocket'
                    onPress={handleCreateCircle}
                  />
                </View>
            </ScrollView>
            <Loading enabled={loading}/>
     </View>
    </View>
}