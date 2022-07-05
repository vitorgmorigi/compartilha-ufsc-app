import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import { Profile } from '../screens/Profile';
import { SignIn } from '../screens/SignIn';
import { CircleListing } from '../screens/CircleListing';
import { CircleItemListing } from '../screens/CircleItemListing';
import { ItemDetails } from '../screens/ItemDetails';

const { Navigator, Screen } = createStackNavigator();

export function Routes() {
  return (
    <NavigationContainer>
      <Navigator headerMode="none">
        <Screen
          name="SignIn"
          component={SignIn}
        />
        <Screen
          name="Profile"
          component={Profile}
        />
        <Screen
          name="CircleListing"
          component={CircleListing}
        />
        <Screen
          name="CircleItemListing"
          component={CircleItemListing}
        />
        <Screen
          name="ItemDetails"
          component={ItemDetails}
        />
      </Navigator>
    </NavigationContainer>
  )
}