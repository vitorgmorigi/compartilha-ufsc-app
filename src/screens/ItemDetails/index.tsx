import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';

import { ScrollView, Text, View } from "react-native";
import { styles } from './styles';
import { listItemDetails } from '../../requests';
import { ItemDetailsImage } from '../../components/ItemDetailsImage';
import { Button } from '../../components/Button';

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
      
      setItemDetails(responseJson.body);
    }

      useEffect(() => {
        loadItemDetails();
      }, [])

   return <View style={styles.container}> 
     <View style={styles.content}>
       <Text style={styles.title}>{itemDetails.name}</Text>
            <ScrollView>
                <ItemDetailsImage uri={itemDetails.image} />
                <Text style={styles.subtitle}>Descrição:</Text>
                <Text style={styles.textValue}>{itemDetails?.description}</Text>
                <Text style={styles.subtitle}>Localização:</Text>
                <Text style={styles.textValue}>{itemDetails?.localization}</Text>
                <Text style={styles.subtitle}>Estado de conservação:</Text>
                <Text style={styles.textValue}>{itemDetails?.conservationState}</Text>
                <Text style={styles.subtitle}>Anunciante:</Text>
                <Text style={styles.textValue}>{itemDetails?.createdBy?.name}</Text>
                <Text style={styles.textValue}>{itemDetails?.createdBy?.institutionalEmail}</Text>
                <Text style={styles.textValue}>{itemDetails?.createdBy?.email}</Text>
                <Text style={styles.subtitle}>Anunciado em:</Text>
                <Text style={styles.textValue}>{new Date(itemDetails?.createdAt).toLocaleString()}</Text>
                <Text style={styles.subtitle}>Expira em:</Text>
                <Text style={styles.textValue}>{new Date(itemDetails?.expirationDate).toLocaleString()}</Text>
            </ScrollView>
            <Button
              title="Tenho interesse!"
              icon="basket"
            />
     </View>
    </View>
}