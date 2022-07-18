import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, Text, View } from "react-native";

import { styles } from './styles';
import { replyItemInterest } from '../../requests';
import { Button } from '../../components/Button';
import { ItemInterest } from '../UserItemListing';
import { showMessage } from 'react-native-flash-message';
import { Loading } from '../../components/Loading';

enum ItemInterestStatus {
    ACCEPTED = "accepted",
    REFUSED = "refused"
  }

type ReplyItemInterestResponseAPI = {
    body: {
        success: boolean;
        message: string;
    }
}

type Params = {
    token: string;
    itemInterests: ItemInterest[]
    itemId: string
  }

export function ItemInterestedListing() {
    const navigation = useNavigation();
    
    const route = useRoute();

    const { token, itemInterests, itemId } = route.params as Params;

    const [loading, setLoading] = useState(false);

    async function handleReplyItemInterest(itemInterestId: string, answer: string) {
      setLoading(true);

      const response = await replyItemInterest(token, itemInterestId, answer, itemId);

      const responseJson: ReplyItemInterestResponseAPI = await response.json();

      if (response.ok) {
        showMessage({
            message: responseJson.body.message,
            type: "success",
        });

        setLoading(false);

        return navigation.navigate('Profile', { token });
      }

      showMessage({
        message: "Ocorreu um erro ao responder a solicitação de interesse",
        type: "danger",
      });

      setLoading(false);
    }
    
   return <View style={styles.container}> 
     <View style={styles.content}>
       <Text style={styles.title}>Interessados</Text>
            <FlatList
              style={styles.container}
              data={itemInterests}
              keyExtractor={ interest => String(interest.id)}
              renderItem={ ({ item: interest }) => 
              <View style={styles.item}>
                <Text style={styles.subtitle}>Informações de contato:</Text>
                <Text style={styles.textValue}>{interest.interested.name}</Text>
                <Text style={styles.textValue}>{interest.interested.email}</Text>
                <Text style={styles.textValue}>{interest.interested.institutionalEmail}</Text>
                <View style={{flex: 1, justifyContent: 'center', flexDirection: 'row'}}>
                    <View style={{paddingHorizontal: 5, marginLeft: 80}}>
                        <Button
                        title='Aceitar'
                        icon='check'
                        onPress={() => handleReplyItemInterest(interest.id, ItemInterestStatus.ACCEPTED)}
                        /> 
                    </View>
                    <View style={{paddingHorizontal: 5, marginRight: 80}}>
                        <Button
                            title='Recusar'
                            icon='close'
                            onPress={() => handleReplyItemInterest(interest.id, ItemInterestStatus.REFUSED)}
                        />
                    </View>
                </View>
              </View>
              }
            />

      <Loading enabled={loading}/>
     </View>
    </View>
}