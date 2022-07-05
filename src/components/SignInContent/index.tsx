import React from 'react';
import { View, Text } from 'react-native';

import { styles } from './styles';
import IllustrationSvg from '../../assets/illustration.svg';

export function SignInContent() {
  return (
    <View style={styles.container}>
      <IllustrationSvg height={300} />

      <View style={styles.content}>
        <Text style={styles.title}>
          Partiu?
        </Text>

        <Text style={styles.subtitle}>
          Entre com sua conta idUFSC para ser começar a 
          difundir a cultura do compartilhamento na universidade!
        </Text>

        <Text style={styles.description}>
          O Compartilha UFSC surgiu com o intuito de diminuir o desperdício de materiais e insumos, contribuindo 
          para a preservação do nosso planeta!
        </Text>
      </View>
    </View>
  );
}