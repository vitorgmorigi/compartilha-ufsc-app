import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Feather } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import { Circle } from '../../components/Circle';
import { theme } from '../../styles/theme';
import { styles } from './styles';
import { createHash } from '../../helpers/crypto';
import { getProfile, joinInAPrivateCircle, listCircles } from '../../requests';
import { getUserProfile, updateProfile } from '../../helpers/update-profile';
import { SearchBar } from 'react-native-elements';
import { unnacent } from '../../helpers/unnacent';
import { showMessage } from 'react-native-flash-message';
import { Loading } from '../../components/Loading';

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

    const [loading, setLoading] = useState(false);

    const [searchValue, setSearchValue] = useState('');

    const [profile, setProfile] = useState(null as any);

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

    function handleCreateCircle() {
      navigation.navigate('CreateCircle', { token });
    }

    function handleCircleItemListing(circle: ResponseAPICircles) {
      navigation.navigate('CircleItemListing', { token, circle: { id: circle.id, name: circle.name }, isFeed: false });
    }

    async function handleConfirmPassword(circle: ResponseAPICircles) {
      setLoading(true);
      
      const response = await joinInAPrivateCircle(token, circle.id, typedPassword);

      if (response.ok) {
        await updateProfile(token);

        setLoading(false);

        return handleCircleItemListing(circle);
      }

      showMessage({
        message: 'Senha incorreta!',
        type: 'warning'
      })
    }

    async function loadCircles() {
      setLoading(true);
      const response = await listCircles(token);
  
      const circles: ResponseAPICircles[] = await response.json();

      setCircles(circles);
      setLoading(false);
    }

    async function loadProfile() {
      const profile = await getUserProfile();
      
      setProfile(profile);
    }

      useEffect(() => {
        loadProfile();
        loadCircles();
      }, [])

   return <View style={styles.container}> 
     <View style={styles.content}>
      <View style={{flexDirection: 'row'}}>
       <Text style={styles.title}>Círculos</Text>
       <TouchableOpacity style={{ flexDirection: 'row', marginLeft: 135 }} onPress={handleCreateCircle}>
        <Feather
            name="plus" 
            color={theme.colors.secondary}
            size={40}
        />
       </TouchableOpacity>
      </View>
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
              <TouchableOpacity key={item.id} onPress={() => {
                setClickedCircle(item);
                
                if (item.visibility === 'private') {         
                  if (!profile?.privateCircles.includes(item.id)) {
                    return setModalVisibility(true)
                  }
                }
                
                return handleCircleItemListing(item);
                }}>
                <Circle 
                key={item.id} 
                name={item.name} 
                visibility={item.visibility === 'public' ? 'Público' : 'Privado'} 
                id={item.id} 
                isGrantedAccess={item.visibility === 'public' ? true : profile?.privateCircles.includes(item.id)}
                ></Circle>
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
            <Loading enabled={loading}/>
     </View>
    </View>
}