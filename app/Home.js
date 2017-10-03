'use strict';

import React, { Component } from 'react';
import {
  Container,
  Content,
  Fab,
  Icon,
  List
} from 'native-base';

import { HomeHeader } from './Headers';
import { LetterCard } from './Letter';

export default class HomeScreen extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.openEditLetter = this.openEditLetter.bind(this);

    this.state = {
      typeList: props.screenProps.typeList,
      items: props.screenProps.items.list,
      selected: props.screenProps.selected,
      onListChanged: props.screenProps.actions.onListChanged
    };
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      items: nextProps.screenProps.items.list,
      selected: nextProps.screenProps.selected
    });
  }

  openEditLetter(id) {
    this.props.navigation.navigate('EditLetter', {id: id});
  };

  render() {
    return (
      <Container>
        <HomeHeader
          onSelect={this.state.onListChanged}
          onFilterSelect={() => this.props.navigation.navigate('Filters')}
          selected={this.state.selected}
          list={this.state.typeList}
        />
        <Content>
          <List
            dataArray={this.state.items}
            renderRow={(item) => <LetterCard item={item} editItem={this.openEditLetter}/>}/>
        </Content>
        <Fab
          active={false}
          direction="up"
          style={{backgroundColor: '#2C3E50'}}
          position="bottomRight"
          onPress={() => this.props.navigation.navigate('AddLetter')}>
          <Icon name="md-add" />
        </Fab>
      </Container>
    )
  };
};
