import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from 'react-native-gesture-handler';
import { Circle, CircleData } from '../../components/Circle';
import { theme } from '../../styles/theme';
import { styles } from './styles';

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

export function CircleScreen() {
    const [circles, setCircles] = useState([] as ResponseAPICircles[])
    const route = useRoute();

    const [modalVisibility, setModalVisibility] = useState(false);

    const { token } = route.params as Params;

    console.log("TOKEN TELA CIRCLES: ", token);

    async function loadCircles() {
        const options = {
          method: "GET",
          headers: {
            Authorization: token,
            "Content-Type": "application/json;charset=UTF-8",
          }
        };

        console.log("PASSEI AQUIII ");
    
        const response = await fetch(`https://us-central1-compartilha-ufsc.cloudfunctions.net/api/circle`, options);

        console.log("RESPONSE CIRCLES: ", response);
    
        const circles: ResponseAPICircles[] = await response.json();
        console.log("Response do endpoint: ", circles);

        setCircles(circles);
      }

      useEffect(() => {
        loadCircles();
      }, [])

      console.log("CIRCLES: ", JSON.stringify(circles));

    const circleComponents = circles
    .map((circle) => 
    <TouchableOpacity key={circle.id} onPress={async () => {
      const userProfile = await AsyncStorage.getItem('@user_profile');

      const userProfileJson = userProfile !== null ? JSON.parse(userProfile) : null;

      return setModalVisibility(circle.visibility === 'private' && !userProfileJson?.privateCircles.includes(circle.id))
      }}>
      <Circle key={circle.id} name={circle.name} createdBy={circle.createdBy} visibility={circle.visibility} id={circle.id} password={circle.password}></Circle>
    </TouchableOpacity>)
    
   return <View style={styles.container}> 
     <View style={styles.content}>
       <Text style={styles.title}>Círculos</Text>
            <ScrollView>
                {circleComponents}
            </ScrollView>
            <Modal style={[StyleSheet.absoluteFill, styles.modal]} visible={modalVisibility} animationType='slide' transparent={true}>
              <View style={styles.modalView}>
                <TouchableOpacity
                  style={styles.buttonClose}
                  onPress={() => setModalVisibility(!modalVisibility)}>
                  <Text style={{fontFamily: theme.fonts.bold, color: 'white'}}>X</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.modalText}
                  placeholder='Digite a senha'
                  secureTextEntry={true}
                  keyboardType="default"
                />  
                <TouchableOpacity
                  style={styles.button} 
                  onPress={() => setModalVisibility(!modalVisibility)}>
                  <Text style={{fontFamily: theme.fonts.bold, color: 'white'}}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </Modal>
     </View>
    </View>
}