import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from 'react-native-gesture-handler';
import { Circle, CircleData } from '../../components/Circle';
import { theme } from '../../styles/theme';
import { styles } from './styles';
import { createHash } from '../../helpers/crypto';
import { joinInAPrivateCircle, listCircles } from '../../requests';

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
    const navigation = useNavigation();

    const [circles, setCircles] = useState([] as ResponseAPICircles[])

    const [clickedCircle, setClickedCircle] = useState({} as ResponseAPICircles);
    
    const route = useRoute();

    const [modalVisibility, setModalVisibility] = useState(false);

    const [typedPassword, setTypedPassword] = useState('');

    const { token } = route.params as Params;

    async function handleConfirmPassword() {  
      const response = await joinInAPrivateCircle(token, clickedCircle.id, typedPassword);

      if (response.ok) {
        console.log("RESPONSE DO JOIN CIRCLE: ", JSON.stringify(response));

        navigation.navigate('Profile', { token });
      }
    }

    async function loadCircles() {
      const response = await listCircles(token);
  
      const circles: ResponseAPICircles[] = await response.json();

      setCircles(circles);
    }

      useEffect(() => {
        loadCircles();
      }, [])

    const circleComponents = circles
    .map((circle) => 
    <TouchableOpacity key={circle.id} onPress={async () => {
      setClickedCircle(circle);

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
                  onChangeText={typedPassword => setTypedPassword(createHash(typedPassword))}
                />  
                <TouchableOpacity
                  style={styles.button} 
                  onPress={() => {
                    setModalVisibility(!modalVisibility)
                    
                    return handleConfirmPassword();
                    }}>
                  <Text style={{fontFamily: theme.fonts.bold, color: 'white'}}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </Modal>
     </View>
    </View>
}