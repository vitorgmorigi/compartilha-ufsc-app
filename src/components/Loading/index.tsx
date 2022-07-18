import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

type LoadingProps = {
    enabled: boolean
}

export function Loading(props: LoadingProps) {
    return (
        <View style={[StyleSheet.absoluteFill, { flex: 1, alignItems: 'center', justifyContent: 'center'}]}>
            { props.enabled ? <ActivityIndicator size="large"/> : undefined}
        </View>
    )
  }