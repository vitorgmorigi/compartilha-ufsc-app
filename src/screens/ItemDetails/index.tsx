import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';

import { Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import { styles } from './styles';
import { createItemInterest, deleteItem, listItemDetails } from '../../requests';
import { ItemDetailsImage } from '../../components/ItemDetailsImage';
import { Button } from '../../components/Button';
import { showMessage } from 'react-native-flash-message';
import { getUserProfile } from '../../helpers/update-profile';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { theme } from '../../styles/theme';
import { Loading } from '../../components/Loading';

export type ItemDetails = {
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

    const [modalVisibility, setModalVisibility] = useState(false);

    const [loading, setLoading] = useState(false);

    const { token, itemId } = route.params as Params;

    const [profile, setProfile] = useState(null as any);

    async function handleItemInterest() {  
      const response = await createItemInterest(token, itemDetails);

      if (response.ok) {
        const responseJson = await response.json();
        
        showMessage({
          message: responseJson.body.message,
          type: "success",
        });

        return navigation.navigate('Profile', { token });
      }

      showMessage({
        message: "Ocorreu um erro ao criar o registro de interesse",
        type: "danger",
      });
    }

    async function handleDeleteItem() {  
      const response = await deleteItem(token, itemId);
      
      const responseJson = await response.json();

      if (response.ok) {
        
        showMessage({
          message: responseJson.body.message,
          type: "success",
        });

        return navigation.navigate('Profile', { token });
      }

      showMessage({
        message: responseJson?.body?.message || "Ocorreu um erro ao deletar o item",
        type: "danger",
      });
    }

    function renderButton() {
      if (itemDetails?.createdBy?.login === undefined || profile?.login === undefined) return undefined;

      return itemDetails?.createdBy?.login === profile?.login ? 
            
            <View style={{flex: 1, justifyContent: 'center', flexDirection: 'row'}}>
              <View style={{paddingHorizontal: 5, marginLeft: 80}}>
                  <Button
                  title='Editar'
                  icon='pencil'
                  // onPress={() => handleReplyItemInterest(interest.id, ItemInterestStatus.ACCEPTED)}
                  /> 
              </View>
              <View style={{paddingHorizontal: 5, marginRight: 80}}>
                  <Button
                      title='Deletar'
                      icon='trash'
                      onPress={() => setModalVisibility(true)}
                  />
              </View>
           </View> :
            <Button
              title="Tenho interesse!"
              icon="basket"
              onPress={handleItemInterest}
            />
    }

    async function loadItemDetails() {
      setLoading(true);

      const response = await listItemDetails(token, itemId);

      const responseJson: ItemDetailsResponseAPI = await response.json();
      
      setItemDetails(responseJson.body);

      setLoading(false);
    }

    async function loadProfile() {
      const profile = await getUserProfile();
      
      setProfile(profile);
    }

      useEffect(() => {
        loadProfile();
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
                <Text style={styles.textValue}>{itemDetails?.createdAt ? new Date(itemDetails?.createdAt).toLocaleString() : undefined}</Text>
                <Text style={styles.subtitle}>Expira em:</Text>
                <Text style={styles.textValue}>{itemDetails?.expirationDate ? new Date(itemDetails?.expirationDate).toLocaleString() : undefined}</Text>
            </ScrollView>
            { renderButton() }
            <Modal style={[StyleSheet.absoluteFill, styles.modal]} visible={modalVisibility} animationType='slide' transparent={true}>
              <View style={styles.modalView}>
              <Text style={styles.modalText}>Tem certeza que deseja excluir?</Text> 
                <View style={{marginLeft: 60, flex: 1, justifyContent: 'center', flexDirection: 'row'}}>
                      <View style={{paddingHorizontal: 5, marginLeft: 80}}>
                          <Button
                          title='Sim'
                          icon='check'
                          onPress={() => handleDeleteItem()}
                          /> 
                      </View>
                      <View style={{paddingHorizontal: 5, marginRight: 80}}>
                          <Button
                              title='Não'
                              icon='close'
                              onPress={() => setModalVisibility(!modalVisibility)}
                          />
                      </View>
                  </View>
                </View>
            </Modal>

            <Loading enabled={loading}/>

     </View>
    </View>
}