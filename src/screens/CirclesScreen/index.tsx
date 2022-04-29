import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';

import { ScrollView, Text, View } from "react-native";
import { Circle, CircleData } from '../../components/Circle';
import { styles } from './styles';

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
    const [circles, setCircles] = useState([] as ResponseAPICircles[])
    const route = useRoute();

    const { token } = route.params as Params;

    console.log("TOKEN TELA CIRCLES: ", token);

    async function loadCircles() {
        const options = {
          method: "GET",
          headers: {
            Authorization: token,
            "Content-Type": "application/json;charset=UTF-8",
          }
        };

        console.log("PASSEI AQUIII ");
    
        const response = await fetch(`https://us-central1-compartilha-ufsc.cloudfunctions.net/api/circle`, options);

        console.log("RESPONSE CIRCLES: ", response);
    
        const circles: ResponseAPICircles[] = await response.json();
        console.log("Response do endpoint: ", circles);

        setCircles(circles);
      }

      useEffect(() => {
        loadCircles();
      }, [])

      console.log("CIRCLES: ", JSON.stringify(circles));

    const circleComponents = circles
    .map((circle) => 
    <Circle name={circle.name} createdBy={circle.createdBy} visibility={circle.visibility} id={circle.id} password={circle.password}></Circle>)
    
   return <View style={styles.container}>
     <View style={styles.content}>
       <Text style={styles.title}>Círculos</Text>
            <ScrollView>
                {circleComponents}
            </ScrollView>
     </View>
    </View>
}