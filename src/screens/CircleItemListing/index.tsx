import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from 'react-native-gesture-handler';
import { Circle, CircleData } from '../../components/Circle';
import { theme } from '../../styles/theme';
import { styles } from './styles';
import { createHash } from '../../helpers/crypto';
import { listItemDetails, listItemsInACircle } from '../../requests';
import { Item } from '../../components/Item';

type ItemResponseAPI = {
  id: string;
  createdBy: string;
  circle: string;
  createdAt: Date;
  expirationDate: Date;
  name: string;
  image: string;
}

type CircleItemListingAPIResponse = {
    body: {
      items: ItemResponseAPI[];
      filters: {
        categories: {
          id: string;
          name: string;
        } [];
        circles: {
          id: string;
          name: string;
        } []
      }
    }

}

type Params = {
    token: string;
    circle: { 
      id: string; 
      name: string;
    };
  }

export function CircleItemListing() {
    const navigation = useNavigation();

    const [items, setItems] = useState([] as ItemResponseAPI[])

    const [clickedItem, setClickedItem] = useState({} as ItemResponseAPI);
    
    const route = useRoute();

    const { token, circle } = route.params as Params;

    function handleItemDetails(itemId: string) {  
      navigation.navigate('ItemDetails', { token, itemId });
    }

    async function loadItems() {
      const response = await listItemsInACircle(token, circle.id);

      const responseJson: CircleItemListingAPIResponse = await response.json();
      
      console.log("listItemsInACircle RESPONSE: ", responseJson);

      setItems(responseJson.body.items);
    }

      useEffect(() => {
        loadItems();
      }, [])

    console.log("ITEMS: ", JSON.stringify(items));

    const itemComponents = items
    .map((item) => 
    <TouchableOpacity key={item.id} onPress={() => {
      setClickedItem(item);

      return handleItemDetails(item.id);
      }}>
      <Item 
      key={item.id} 
      name={item.name} 
      circle={item.circle} 
      createdAt={item.createdAt} 
      createdBy={item.createdBy} 
      expirationDate={item.expirationDate} 
      id={item.id} 
      image={item.image}></Item>
    </TouchableOpacity>)
    
   return <View style={styles.container}> 
     <View style={styles.content}>
       <Text style={styles.title}>{circle.name}</Text>
            <ScrollView>
                {itemComponents}
            </ScrollView>
     </View>
    </View>
}