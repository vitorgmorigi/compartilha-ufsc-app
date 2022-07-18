import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';

import { ScrollView, Text, View } from "react-native";
import { TextInput } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import { RadioButton } from 'react-native-paper';

import { styles } from './styles';
import { Button } from '../../components/Button';
import { createHash } from '../../helpers/crypto';
import { createCircle } from '../../requests';
import { showMessage } from 'react-native-flash-message';
import { theme } from '../../styles/theme';

type ResponseAPICategories = {
    id: string;
    createdBy: string;
    name: string;
}

type ResponseAPICircles = {
    id: string;
    createdBy: string;
    name: string;
    visibility: string;
    password: string;
}

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

    const [visibility, setVisibility] = useState('' as 'public' | 'private');

    const [password, setPassword] = useState('');

    const { token } = route.params as Params;

    async function handleCreateCircle() {
        const response = await createCircle(token, name, visibility, password);
  
        if (response.ok) {
          showMessage({
            message: "Círculo criado com sucesso",
            type: "success",
          });
  
          return navigation.navigate('Profile', { token });
        }
  
        showMessage({
          message: "Houve um erro ao criar o círculo",
          type: "danger",
        });
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
                  style={styles.modalText}
                  secureTextEntry={true}
                  keyboardType="default"
                  enabled={visibility === 'private'}
                  onChangeText={password => setPassword(createHash(password))}
                />  
                <View style={styles.buttons}>      
                  <Button
                    title="Criar Círculo"
                    icon='rocket'
                    onPress={handleCreateCircle}
                  />
                </View>
            </ScrollView>
     </View>
    </View>
}