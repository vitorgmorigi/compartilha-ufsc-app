import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from 'react-native-gesture-handler';
import { Circle, CircleData } from '../../components/Circle';
import { theme } from '../../styles/theme';
import { styles } from './styles';
import { createHash } from '../../helpers/crypto';
import { joinInAPrivateCircle, listCategories, listCircles } from '../../requests';
import { updateProfile } from '../../helpers/update-profile';

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

type Params = {
    token: string;
  }

export function CreateItem() {
    const navigation = useNavigation();

    const [circles, setCircles] = useState([] as ResponseAPICircles[])

    const [categories, setCategories] = useState([] as ResponseAPICategories[])

    const [selectedCircle, setSelectedCircle] = useState({} as ResponseAPICircles);

    const [selectedCategory, setSelectedCategory] = useState({} as ResponseAPICategories);
    
    const route = useRoute();

    const [modalVisibility, setModalVisibility] = useState(false);

    const [name, setName] = useState('');

    const { token } = route.params as Params;

    function handleCircleItemListing(circle: ResponseAPICircles) {
      navigation.navigate('CircleItemListing', { token, circle: { id: circle.id, name: circle.name } });
    }

    async function handleConfirmPassword(circle: ResponseAPICircles) {  
      const response = await joinInAPrivateCircle(token, circle.id, name);

      if (response.ok) {
        await updateProfile(token);

        handleCircleItemListing(circle);
      }
    }

    async function loadCircles() {
      const response = await listCircles(token);
  
      const circles: ResponseAPICircles[] = await response.json();

      const userProfile = await AsyncStorage.getItem('@user_profile');
        
      const localUserProfile = userProfile !== null ? JSON.parse(userProfile) : null;

      const userCircles = circles.filter((circle) => circle.visibility === 'public' || localUserProfile.privateCircles.includes(circle.id));

      setCircles(userCircles);
    }

    async function loadCategories() {
        const response = await listCategories(token);
    
        const categories: ResponseAPICategories[] = await response.json();
  
        setCategories(categories);
      }

      useEffect(() => {
        loadCircles();
      }, [])
    
   return <View style={styles.container}> 
     <View style={styles.content}>
       <Text style={styles.title}>Criar item</Text>
            <ScrollView>
                <Text style={styles.subtitle}>Nome:</Text>
                <TextInput
                  style={styles.modalText}
                  keyboardType="default"
                  onChangeText={name => setName(name)}
                />  
                <Text style={styles.subtitle}>Descrição:</Text>
                <TextInput
                  style={styles.description}
                  keyboardType="default"
                  onChangeText={name => setName(name)}
                  multiline={true}
                  textAlignVertical='top'
                />  
                <Text style={styles.subtitle}>Categoria:</Text>
                <Text style={styles.subtitle}>Círculo:</Text>
                <Text style={styles.subtitle}>Estado de conservação:</Text>
                <TextInput
                  style={styles.modalText}
                  keyboardType="default"
                  onChangeText={name => setName(name)}
                />  
                <Text style={styles.subtitle}>Localização:</Text>
                <TextInput
                  style={styles.modalText}
                  keyboardType="default"
                  onChangeText={name => setName(name)}
                />  
                <Text style={styles.subtitle}>Data de Expiração:</Text>
                <Text style={styles.subtitle}>Imagem:</Text>
            </ScrollView>
     </View>
    </View>
}