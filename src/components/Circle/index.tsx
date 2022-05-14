import React from 'react';

import { Text, TouchableOpacity, View } from "react-native";
import { styles } from './styles';

export type CircleData = {
    id: string;
    createdBy: string;
    name: string;
    visibility: string;
    password: string;
}

export function Circle(props: CircleData) {
    return <View style={styles.circle}>
        <Text style={styles.circleName}> { props.name } </Text>
        <Text style={styles.circleAuthor}> { props.createdBy } </Text>
        <Text style={styles.circleVisibility}> { props.visibility } </Text>
    </View>
}