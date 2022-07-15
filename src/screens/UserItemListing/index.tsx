import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { styles } from './styles';
import { listFeed, listItemsInACircle, listUserItems } from '../../requests';
import { Item } from '../../components/Item';
import { SearchBar } from 'react-native-elements';
import { unnacent } from '../../helpers/unnacent';
import { ItemDetails } from '../ItemDetails';
import { Button } from '../../components/Button';

export type ItemInterest = {
  id: string;
  interested: {
      id: string;
      name: string;
      birthday: string;
      login: string;
      createdAt: string;
      email: string;
      institutionalEmail: string;
  },
  status: string;
}

type UserItemResponseBodyAPI = ItemDetails & {
    itemInterests: ItemInterest[]
}

type UserItemResponseAPI = {
    body: {
        items: UserItemResponseBodyAPI[]
    }
}

type Params = {
    token: string;
  }

export function UserItemListing() {
    const navigation = useNavigation();

    const [items, setItems] = useState([] as UserItemResponseBodyAPI[])

    const [filteredItems, setFilteredItems] = useState(null as UserItemResponseBodyAPI[] | null)

    const [searchValue, setSearchValue] = useState('')

    const [clickedItem, setClickedItem] = useState({} as UserItemResponseBodyAPI);
    
    const route = useRoute();

    const { token } = route.params as Params;

    function handleItemInterested(itemInterests: ItemInterest[], itemId: string) {  
      navigation.navigate('ItemInterestedListing', { token, itemInterests, itemId });
    }

    function handleItemDetails(itemId: string) {  
      navigation.navigate('ItemDetails', { token, itemId });
    }

    function searchFunction(text: string) {
      setSearchValue(text);

      const updatedData = items.filter((item) => unnacent(item.name.toLowerCase().trim())
      .includes(unnacent(text.toLowerCase().trim())));
      
      setFilteredItems(updatedData);
    };

    async function loadUserItems() {
      const response = await listUserItems(token);

      const responseJson: UserItemResponseAPI = await response.json();
      
      setItems(responseJson.body.items);
    }

      useEffect(() => {
        loadUserItems();
      }, [])
    
   return <View style={styles.container}> 
     <View style={styles.content}>
       <Text style={styles.title}>Meus itens</Text>
            <SearchBar
              placeholder="Procure o item aqui..."
              round
              value={searchValue}
              // @ts-ignore
              onChangeText={(text) => searchFunction(text)}
              onClear={() => setFilteredItems(null)}
              autoCorrect={false}
            />

            <FlatList
              style={{ marginTop: 35 }}
              data={filteredItems || items}
              keyExtractor={ item => String(item.id)}
              renderItem={ ({ item }) => 
              <View style={styles.item}>
                <TouchableOpacity key={item.id} onPress={() => {
                  setClickedItem(item);
            
                  return handleItemDetails(item.id);
                  }}>
                  <Item 
                  key={item.id} 
                  name={item.name} 
                  circle={item.circle.name} 
                  createdAt={new Date(item.createdAt)} 
                  createdBy={item.createdBy.login} 
                  expirationDate={new Date(item.expirationDate)} 
                  id={item.id} 
                  image={item.image}></Item>
                </TouchableOpacity>
                { item.itemInterests.length ? 
                <Button
                  title='Visualizar Interessados'
                  icon='envelope'
                  onPress={() => handleItemInterested(item.itemInterests, item.id)}
                /> : <Text style={styles.notInterestedLabel}>Ainda não há interessados</Text> }  
              </View>
              }
            />
     </View>
    </View>
}