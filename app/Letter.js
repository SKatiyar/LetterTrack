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

  dateToStr(d, t) {
    let nd = new Date(d);
    if (t) {
      return '' + nd.getHours() + ' : ' + nd.getMinutes() + '  On  ' + nd.getDate() + ' / ' + (nd.getMonth() + 1) + ' / ' + nd.getFullYear();
    }
    return '' + nd.getDate() + ' / ' + (nd.getMonth() + 1) + ' / ' + nd.getFullYear();
  };

  render() {
    let { letterId,
      serialNo,
      counterNo,
      sentTo,
      sentOn,
      subject,
      replyBy,
      important,
      status,
      updatedAt } = this.props.item;

    let replyByStr = new Date()
    return (
      <TouchableOpacity
        onPress={() => this.editItem(letterId)}
        activeOpacity={0.7}
        style={styles.touchContainer}>
        <View style={[styles.content, {borderLeftColor: important ? '#E74C3C' : '#FFFFFF'}]}>
          <View style={{flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#00000011'}}>
            <View style={styles.label}>
              <Text style={styles.labelText}>Serial No.</Text>
            </View>
            <View style={styles.value}>
              <Text style={styles.labelValue}>{serialNo}</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#00000011'}}>
            <View style={styles.label}>
              <Text style={styles.labelText}>Counter No.</Text>
            </View>
            <View style={styles.value}>
              <Text style={styles.labelValue}>{counterNo}</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#00000011'}}>
            <View style={styles.label}>
              <Text style={styles.labelText}>Sent To</Text>
            </View>
            <View style={styles.value}>
              <Text style={styles.labelValue}>{sentTo}</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#00000011'}}>
            <View style={styles.label}>
              <Text style={styles.labelText}>Sent On</Text>
            </View>
            <View style={styles.value}>
              <Text style={styles.labelValue}>{this.dateToStr(sentOn)}</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#00000011'}}>
            <View style={styles.label}>
              <Text style={styles.labelText}>Reply By</Text>
            </View>
            <View style={styles.value}>
              <Text style={styles.labelValue}>{this.dateToStr(replyBy)}</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#00000011'}}>
            <View style={styles.label}>
              <Text style={styles.labelText}>Subject</Text>
            </View>
            <View style={styles.value}>
              <Text style={styles.labelValue}>{subject}</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.label}>
              <Text style={styles.labelText}>Updated At</Text>
            </View>
            <View style={styles.value}>
              <Text style={styles.labelValue}>{this.dateToStr(updatedAt, true)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
};

const styles = StyleSheet.create({
  touchContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#00000077',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderWidth: 5,
    borderColor: '#FFFFFF',
    padding: 5,
  },
  label: {
    width: 105,
    marginTop: 10,
    marginBottom: 10,
    borderRightWidth: 0.5,
    borderRightColor: '#00000011'
  },
  labelText: {
    fontSize: 18,
    color: '#000000',
  },
  value: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 10,
  },
  labelValue: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
  },
});
