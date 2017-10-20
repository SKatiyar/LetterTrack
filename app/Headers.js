'use strict';

import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback
} from 'react-native';
import {
  Button,
  ActionSheet,
  Header,
  Left,
  Body,
  Right,
  Icon,
  Text,
} from 'native-base';

export class HomeHeader extends Component {
  constructor(props) {
    super(props)

    this.state = {
      list: props.list.concat('Cancel'),
      onSelect: props.onSelect,
      onFilterSelect: props.onFilterSelect,
      selected: props.selected
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selected: nextProps.selected
    });
  }

  render() {
    return (
      <Header style={styles.header} backgroundColor='#FFFFFF'>
        <Left>
          <TouchableWithoutFeedback
            onPress={() =>
              ActionSheet.show({
                options: this.state.list,
                cancelButtonIndex: this.state.list.length - 1,
                title: 'Select Letter Types'
              }, this.state.onSelect)}>
            <View style={styles.optionsList}>
                <View style={{
                    height: 25,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                }}>
                  <Text style={{fontSize: 20, textAlign: 'left'}}>{this.state.selected.name}</Text>
                  <Icon name="md-arrow-dropdown" style={{fontSize:24, paddingLeft: 5}} />
                </View>
                <View style={{padding: 0, margin: 0}}>
                  <Text style={{fontSize: 18}}>{this.state.selected.text}</Text>
                </View>
              </View>
          </TouchableWithoutFeedback>
        </Left>
        <Body />
        <Right>
          <Button transparent dark
            onPress={this.props.onFilterSelect}>
            <Icon name="md-options"/>
          </Button>
        </Right>
      </Header>
    );
  };
};

export class ModalHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: props.title
    };
  };

  render() {
    return (
      <Header style={styles.header} backgroundColor='#FFFFFF'>
        <Left>
          <Text style={{fontSize: 24, width: 150}}>{this.state.title}</Text>
        </Left>
        <Body />
        <Right>
          <Button transparent dark
            onPress={this.props.back}>
            <Icon name='md-close' />
          </Button>
        </Right>
      </Header>
    );
  };
};

const styles = StyleSheet.create({
  header: {
    height: 80,
    margin: 0
  }
});
