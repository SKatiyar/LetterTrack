'use strict';

import React, { Component } from 'react'
import {
  Text,
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
  Icon
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
      <Header>
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
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <View style={{width: 100, height: 22}}>
                  <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                  }}>
                    <View style={{height: 40, flexGrow: 0, paddingRight: 5}}>
                      <Text style={{fontSize: 18}}>{this.state.selected.name}</Text>
                    </View>
                    <View style={{width: 20, height: 20, flexGrow: 0, flexShrink: 0}}>
                      <Icon name="arrow-down" style={{fontSize:22, paddingTop: 2}}/>
                    </View>
                  </View>
                </View>
                <View style={{width: 100, height: 20}}>
                  <Text>{this.state.selected.text}</Text>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Left>
        <Body />
        <Right>
          <TouchableWithoutFeedback
            onPress={this.props.onFilterSelect}>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center'
            }}>
              <View style={{width: 50, height: 20}}>
                <Text style={{fontSize: 18}}>Filters</Text>
              </View>
              <View style={{width: 20, height: 20}}>
                <Icon name="md-options" style={{fontSize: 19, paddingLeft: 3, paddingTop: 1}}/>
              </View>
            </View>
          </TouchableWithoutFeedback>
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
      <Header>
        <Left>
          <Text style={{fontSize: 18}}>{this.state.title}</Text>
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
}

const styles = StyleSheet.create({
  header: {
    marginTop: 0
  },
  optionsList: {
    position: 'absolute',
    width: 100,
    top: -20
  }
})
