'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';
import {
  View,
  Icon,
  Button
} from 'native-base';

export class LetterCard extends Component {
  constructor(props) {
    super(props);

    this.editItem = props.editItem.bind(this);
  };

  editItem(idx) {
    alert(idx);
  };

  render() {
    let {letterId, serialNo, counterNo, sentTo, sentOn, subject, replyBy, important, updatedAt} = this.props.item;

    return (
      <TouchableOpacity onPress={() => this.editItem(letterId)}>
        <View>
          <Text>{serialNo}</Text>
          <Text>{counterNo}</Text>
          <Text>{sentTo}</Text>
          <Text>{sentOn}</Text>
          <Text>{subject}</Text>
          <Text>{important}</Text>
          <Text>{(new Date(updatedAt)).toString()}</Text>
        </View>
      </TouchableOpacity>
    );
  };
};
