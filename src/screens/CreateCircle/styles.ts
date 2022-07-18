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
  modal: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    backgroundColor: theme.colors.background,
    margin: 45,
    justifyContent: 'center',
    borderRadius: 20.0,
    padding: 35,
    top: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10.0,
    elevation: 5,
  },
  modalText: {
    color: '#000000',
    fontFamily: theme.fonts.medium,
    fontSize: 20,
    padding: 20,
    backgroundColor: 'white',
    margin: 5,
    paddingVertical: 3
  },
  button: {
    backgroundColor: theme.colors.secondary,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 5,
    paddingHorizontal: 5,
    left: 90
  },
  subtitle: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    fontSize: 20,
    paddingBottom: 10
  },
  description: {
    color: '#000000',
    fontFamily: theme.fonts.medium,
    fontSize: 20,
    padding: 20,
    backgroundColor: 'white',
    margin: 5,
    paddingVertical: 3,
    height: 100,
  },
  textValue: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.secondary,
    fontSize: 12,
    paddingBottom: 10
  },
  buttons: {
    flex: 1,
    justifyContent: 'space-around',
    paddingBottom: getBottomSpace() + 20,
    paddingHorizontal: 44,
    margin: 10
  },
});