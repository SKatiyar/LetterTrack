'use strict';

import React from 'react';
import { Root } from 'native-base';
import { AppRegistry } from 'react-native';
import { StackNavigator } from 'react-navigation';

import HomeScreen from './app/Home';
import AddLetterScreen from './app/AddLetter';
import EditLetterScreen from './app/EditLetter';
import FiltersScreen from './app/Filters';

import States from './app/States';

const Navigator = StackNavigator({
  Home: { screen: HomeScreen, path: '/' },
  AddLetter: { screen: AddLetterScreen, path: '/create-letter' },
  EditLetter: { screen: EditLetterScreen, path: '/edit-letter/:id' },
  Filters: { screen: FiltersScreen, path: '/filters' }
}, {
  initialRouteName: 'Home',
  mode: 'modal'
});

export default class LetterTrack extends React.Component {
  constructor(props) {
    super(props);

    this.state = new States(this);
  };

  render() {
    return (
      <Root>
        <Navigator screenProps={this.state}/>
      </Root>
    );
  };
};

AppRegistry.registerComponent('LetterTrack', () => LetterTrack);
