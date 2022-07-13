import { StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const styles = StyleSheet.create({
  circle: {
    backgroundColor: theme.colors.secondary,
    padding: 12,
    borderRadius: 5.0,
    marginBottom: 10,
    marginTop: 10,
   },
  circleName: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    fontSize: 20,
  },
  circleAuthor: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
    fontSize: 20,
    marginTop: 0,
  },
  circleVisibility: {
    fontFamily: theme.fonts.medium,
    color: theme.colors.background,
    fontSize: 20,
    marginTop: 0
  },
});