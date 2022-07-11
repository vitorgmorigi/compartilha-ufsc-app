import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { styles } from './styles';
import { listFeed, listItemsInACircle } from '../../requests';
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
    isFeed: boolean
  }

export function CircleItemListing() {
    const navigation = useNavigation();

    const [items, setItems] = useState([] as ItemResponseAPI[])

    const [clickedItem, setClickedItem] = useState({} as ItemResponseAPI);
    
    const route = useRoute();

    const { token, circle, isFeed } = route.params as Params;

    function handleItemDetails(itemId: string) {  
      navigation.navigate('ItemDetails', { token, itemId });
    }

    async function loadItems() {
      const response = isFeed ? await listFeed(token) : 
        await listItemsInACircle(token, circle.id);

      const responseJson: CircleItemListingAPIResponse = await response.json();
      
      setItems(responseJson.body.items);
    }

      useEffect(() => {
        loadItems();
      }, [])

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
       <Text style={styles.title}>{ isFeed ? 'Feed' : circle.name}</Text>
            <ScrollView>
                {itemComponents}
            </ScrollView>
     </View>
    </View>
}