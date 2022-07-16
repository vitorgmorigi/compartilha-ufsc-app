import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from 'react-native-gesture-handler';
import { Circle } from '../../components/Circle';
import { theme } from '../../styles/theme';
import { styles } from './styles';
import { createHash } from '../../helpers/crypto';
import { joinInAPrivateCircle, listCircles } from '../../requests';
import { updateProfile } from '../../helpers/update-profile';
import { SearchBar } from 'react-native-elements';
import { unnacent } from '../../helpers/unnacent';

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

export function CircleListing() {
    const navigation = useNavigation();

    const [circles, setCircles] = useState([] as ResponseAPICircles[])

    const [filteredCircles, setFilteredCircles] = useState(null as ResponseAPICircles[] | null)

    const [searchValue, setSearchValue] = useState('')

    const [clickedCircle, setClickedCircle] = useState({} as ResponseAPICircles);
    
    const route = useRoute();

    const [modalVisibility, setModalVisibility] = useState(false);

    const [typedPassword, setTypedPassword] = useState('');

    const { token } = route.params as Params;

    function searchFunction(text: string) {
      setSearchValue(text);

      const updatedData = circles.filter((circle) => unnacent(circle.name.toLowerCase().trim())
      .includes(unnacent(text.toLowerCase().trim())));
      
      setFilteredCircles(updatedData);
    };

    function handleCircleItemListing(circle: ResponseAPICircles) {
      navigation.navigate('CircleItemListing', { token, circle: { id: circle.id, name: circle.name }, isFeed: false });
    }

    async function handleConfirmPassword(circle: ResponseAPICircles) {  
      const response = await joinInAPrivateCircle(token, circle.id, typedPassword);

      if (response.ok) {
        await updateProfile(token);

        handleCircleItemListing(circle);
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

   return <View style={styles.container}> 
     <View style={styles.content}>
       <Text style={styles.title}>Círculos</Text>
            <SearchBar
              placeholder="Procure o círculo aqui..."
              round
              value={searchValue}
              // @ts-ignore
              onChangeText={(text) => searchFunction(text)}
              onClear={() => setFilteredCircles(null)}
              autoCorrect={false}
            />
            <FlatList
              data={filteredCircles || circles}
              style={{ marginTop: 35 }}
              keyExtractor={ circle => String(circle.id)}
              renderItem={({ item }) => 
              <TouchableOpacity key={item.id} onPress={async () => {
                setClickedCircle(item);
                
                if (item.visibility === 'private') {
                  const userProfile = await AsyncStorage.getItem('@user_profile');
                  
                  const userProfileJson = userProfile !== null ? JSON.parse(userProfile) : null;
                  
                  if (!userProfileJson?.privateCircles.includes(item.id)) {
                    return setModalVisibility(true)
                  }
                }
                
                return handleCircleItemListing(item);
                }}>
                <Circle key={item.id} name={item.name} createdBy={item.createdBy} visibility={item.visibility} id={item.id} password={item.password}></Circle>
              </TouchableOpacity>}
            />
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
                    
                    return handleConfirmPassword(clickedCircle);
                    }}>
                  <Text style={{fontFamily: theme.fonts.bold, color: 'white'}}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </Modal>
     </View>
    </View>
}