import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { styles } from './styles';
import { listItemDetails, listItemsInACircle } from '../../requests';
import { ItemDetailsImage } from '../../components/ItemDetailsImage';

type ItemDetails = {
  id: string;
  name: string;
  createdBy: {
    id: string;
    name: string;
    birthday: string;
    login: string;
    email: string;
    institutionalEmail: string;
  };
  circle: {
    id: string;
    name: string;
    visibility: string;
  };
  category: {
    id: string;
    name: string;
  }
  conservationState: string;
  description: string;
  expirationDate: string;
  localization: string;
  image: string;
  createdAt: string;
}

type ItemDetailsResponseAPI = {
    statusCode: number;
    body: ItemDetails;
}

type Params = {
    token: string;
    itemId: string;
  }

export function ItemDetails() {
    const navigation = useNavigation();

    const [itemDetails, setItemDetails] = useState({} as ItemDetails)

    const route = useRoute();

    const { token, itemId } = route.params as Params;

    async function handleItemDetails() {  
      const response = await listItemDetails(token, itemId);

      if (response.ok) {
        navigation.navigate('Profile', { token });
      }
    }

    async function loadItemDetails() {
      const response = await listItemDetails(token, itemId);

      const responseJson: ItemDetailsResponseAPI = await response.json();
      
      console.log("listItemDetails RESPONSE: ", responseJson);

      setItemDetails(responseJson.body);
    }

      useEffect(() => {
        loadItemDetails();
      }, [])

    console.log("ITEM DETAILS: ", JSON.stringify(itemDetails));

    
   return <View style={styles.container}> 
     <View style={styles.content}>
       <Text style={styles.title}> {itemDetails.name} </Text>
            <ScrollView>
                <ItemDetailsImage uri={itemDetails.image} />
            </ScrollView>
     </View>
    </View>
}