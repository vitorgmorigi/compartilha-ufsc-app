import React from 'react';

import { Text, TouchableOpacity, View } from "react-native";
import { styles } from './styles';

import { Feather } from '@expo/vector-icons';

export type CircleData = {
    id: string;
    name: string;
    visibility: string;
    isGrantedAccess: boolean
}

export function Circle(props: CircleData) {
    return <View style={styles.circle}>
        <Text style={styles.circleName}> { props.name } </Text>
        <Feather
            name={props.isGrantedAccess ? 'unlock' : 'lock'}
            size={34}
            color={props.isGrantedAccess ? '#008000' : '#FF0000'}
        />
        <Text style={styles.circleVisibility}> { props.visibility } </Text>
    </View>
}