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

    this.editLetterOpened = false;
    this.filtersOpened = false;
    this.addLetterOpened = false;

    this.openEditLetter = this.openEditLetter.bind(this);
    this.openFilters = this.openFilters.bind(this);
    this.openAddLetter = this.openAddLetter.bind(this);

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
    if (!this.editLetterOpened) {
      this.props.navigation.navigate('EditLetter', {id: id});
      this.editLetterOpened = true;
      setTimeout(function() {
        this.editLetterOpened = false;
      }.bind(this), 1000);
    }
  };

  openFilters() {
    if (!this.filtersOpened) {
      this.props.navigation.navigate('Filters');
      this.filtersOpened = true;
      setTimeout(function() {
        this.filtersOpened = false;
      }.bind(this), 1000);
    }
  };

  openAddLetter() {
    if (!this.addLetterOpened) {
      this.props.navigation.navigate('AddLetter');
      this.addLetterOpened = true;
      setTimeout(function() {
        this.addLetterOpened = false;
      }.bind(this), 1000);
    }
  };

  render() {
    return (
      <Container>
        <HomeHeader
          onSelect={this.state.onListChanged}
          onFilterSelect={() => this.openFilters()}
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
          onPress={() => this.openAddLetter()}>
          <Icon name="md-add" />
        </Fab>
      </Container>
    )
  };
};
