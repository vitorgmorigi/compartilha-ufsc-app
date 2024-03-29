import { StyleSheet } from 'react-native';
import { getBottomSpace, getStatusBarHeight } from 'react-native-iphone-x-helper';
import { theme } from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    width: '100%',
    paddingTop: getStatusBarHeight() + 28,
    paddingHorizontal: 4,
    paddingBottom: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'space-around',
    paddingBottom: getBottomSpace() + 20,
    paddingHorizontal: 44,
  },
  title: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    fontSize: 32,
    paddingBottom: 20
  },
  notInterestedLabel: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    fontSize: 18,
    paddingBottom: 20
  },
  item: {
    marginBottom: 30,
    borderColor: theme.colors.secondary,
    paddingHorizontal: 20
  },
  subtitle: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    fontSize: 20,
    paddingBottom: 10
  },
  textValue: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.secondary,
    fontSize: 12,
    paddingBottom: 10
  }
});