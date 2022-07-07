import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from 'react-native-gesture-handler';
import {Picker} from '@react-native-picker/picker';

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

    const today = new Date();

    const [expirationDate, setExpirationDate] = useState(null as Date | null);
    
    const [conservationState, setConservationState] = useState('');
    
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
                <TouchableOpacity style={{backgroundColor: '#fff', height: 50}} onPress={loadCategories}>
                  <Picker
                    selectedValue={selectedCategory}
                    onValueChange={(itemValue) =>
                      setSelectedCategory(itemValue)
                    }>
                    {categories.map((category) => <Picker.Item key={category.id} label={category.name} value={JSON.stringify(category)}/>)}
                  </Picker>
                </TouchableOpacity>
                <Text style={styles.subtitle}>Círculo:</Text>
                <TouchableOpacity style={{backgroundColor: '#fff', height: 50}} onPress={loadCircles}>
                  <Picker
                    selectedValue={selectedCircle}
                    onValueChange={(itemValue) =>
                      setSelectedCategory(itemValue)
                    }>
                    {circles.map((circle) => <Picker.Item key={circle.id} label={circle.name} value={JSON.stringify(circle)}/>)}
                  </Picker>
                </TouchableOpacity>
                <Text style={styles.subtitle}>Estado de conservação:</Text>
                <View style={{backgroundColor: '#fff', height: 50}}>
                  <Picker
                    selectedValue={conservationState}
                    onValueChange={(itemValue) =>
                      setConservationState(itemValue)
                    }>
                    <Picker.Item label="Novo" value="Novo"/>
                    <Picker.Item label="Estado de novo" value="Estado de novo"/>
                    <Picker.Item label="Em boas condições" value="Em boas condições"/>
                    <Picker.Item label="Em condições razoáveis" value="Em condições razoáveis"/>
                  </Picker>
                </View>
                <Text style={styles.subtitle}>Localização:</Text>
                <TextInput
                  style={styles.modalText}
                  placeholder="Sala, laboratório..."
                  keyboardType="default"
                  onChangeText={name => setName(name)}
                />  
                <Text style={styles.subtitle}>Data de Expiração:</Text>
                <View style={{backgroundColor: '#fff', height: 50}}>
                  <Picker
                    selectedValue={expirationDate}
                    onValueChange={(itemValue, itemIndex) =>
                      setExpirationDate(itemValue)
                    }>
                    <Picker.Item label="1 semana" value={new Date(today.getFullYear(), today.getMonth(), today.getDate()+7).toISOString()} />
                    <Picker.Item label="2 semanas" value={new Date(today.getFullYear(), today.getMonth(), today.getDate()+14).toISOString()} />
                    <Picker.Item label="1 mês" value={new Date(today.getFullYear(), today.getMonth()+1, today.getDate()).toISOString()} />
                    <Picker.Item label="3 meses" value={new Date(today.getFullYear(), today.getMonth()+3, today.getDate()).toISOString()} />
                    <Picker.Item label="6 meses" value={new Date(today.getFullYear(), today.getMonth()+6, today.getDate()).toISOString()} />
                    <Picker.Item label="1 ano" value={new Date(today.getFullYear()+1, today.getMonth(), today.getDate()).toISOString()} />
                  </Picker>
                </View>
                <Text style={styles.subtitle}>Imagem:</Text>
            </ScrollView>
     </View>
    </View>
}