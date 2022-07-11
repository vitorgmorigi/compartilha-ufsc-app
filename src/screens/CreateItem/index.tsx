import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Alert, ScrollView, Text, View } from "react-native";
import { TextInput } from 'react-native-gesture-handler';
import {Picker} from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { showMessage } from "react-native-flash-message";

import { styles } from './styles';
import { createItem, listCategories, listCircles } from '../../requests';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import { Button } from '../../components/Button';

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

export function CreateItem() {
    const navigation = useNavigation();

    const [circles, setCircles] = useState([] as ResponseAPICircles[])

    const [categories, setCategories] = useState([] as ResponseAPICategories[])

    const [selectedCircle, setSelectedCircle] = useState({} as ResponseAPICircles);

    const [selectedCategory, setSelectedCategory] = useState({} as ResponseAPICategories);

    const today = new Date();

    const [expirationDate, setExpirationDate] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate()+7).toISOString());
    
    const [conservationState, setConservationState] = useState('Novo');

    const [image, setImage] = useState(null as ImageInfo | null);

    const [imageLabel, setImageLabel] = useState('Anexe a imagem');
    
    const route = useRoute();

    const [name, setName] = useState('');

    const [localization, setLocalization] = useState('');

    const [description, setDescription] = useState('');

    const { token } = route.params as Params;

    async function pickImage() {
      // No permissions request is necessary for launching the image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log("PICK IMAGE RESULT: ", result);
  
      if (!result.cancelled) {
        setImage(result);
        setImageLabel("Imagem anexada!");
      }
    };

    async function handleCreateItem() {
      const filename = image!.uri.split('/')[9];


      const payload: PayloadCreateItemAPI = {
        name,
        description,
        expiration_date: expirationDate || "",
        category: selectedCategory,
        circle: selectedCircle,
        conservation_state: conservationState,
        image: {
          uri: image!.uri,
          name: filename,
          type: "image/jpeg"
        },
        localization
      };

      console.log("PAYLOAD CREATE ITEM: ", JSON.stringify(payload));

      const response = await createItem(token, payload);

      const responseJson = await response.json();

      console.log("RESPONSE CREATE ITEM", JSON.stringify(responseJson));

      if (responseJson.statusCode === 201) {
        showMessage({
          message: "Item criado com sucesso",
          type: "success",
        });

        return navigation.navigate('Profile', { token });
      }

      showMessage({
        message: "Houve um erro ao criar o item",
        type: "danger",
      });
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
      loadCategories();
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
                  onChangeText={description => setDescription(description)}
                  multiline={true}
                  textAlignVertical='top'
                />  
                <Text style={styles.subtitle}>Categoria:</Text>
                <View style={styles.modalText}>
                  <Picker
                    selectedValue={selectedCategory}
                    onValueChange={(itemValue) =>
                      setSelectedCategory(itemValue)
                    }>
                    {categories.map((category) => <Picker.Item key={category.id} label={category.name} value={JSON.stringify(category)}/>)}
                  </Picker>
                </View>
                <Text style={styles.subtitle}>Círculo:</Text>
                <View style={styles.modalText}>
                  <Picker
                    selectedValue={selectedCircle}
                    onValueChange={(itemValue) =>
                      setSelectedCircle(itemValue)
                    }>
                    {circles.map((circle) => <Picker.Item key={circle.id} label={circle.name} value={JSON.stringify(circle)}/>)}
                  </Picker>
                </View>
                <Text style={styles.subtitle}>Estado de conservação:</Text>
                <View style={styles.modalText}>
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
                  onChangeText={localization => setLocalization(localization)}
                />  
                <Text style={styles.subtitle}>Data de Expiração:</Text>
                <View style={styles.modalText}>
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
                <Button
                  title={imageLabel}
                  icon='picture'
                  onPress={pickImage}
                />

                <View style={styles.buttons}>      
                  <Button
                    title="Publicar Item!"
                    icon='rocket'
                    onPress={async () => await handleCreateItem()}
                  />
                </View>
            </ScrollView>
     </View>
    </View>
}