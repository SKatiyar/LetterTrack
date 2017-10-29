'use strict';

// Fill for squeljs error
import 'core-js';

import React, { Component } from 'react';
import {
  DatePickerAndroid,
  DatePickerIOS,
  Platform,
  Text,
  Toast,
  StyleSheet,
  View,
} from 'react-native';

export default class DatePicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: props.date,
    }
  };

  dateToStr(iDate) {
    return '' + iDate.getDate() + ' / ' + (iDate.getMonth() + 1) + ' / ' + iDate.getFullYear();
  };

  render() {
    return Platform.select({
      ios: () => <IOSDatePicker date={this.state.date} onDateChange={this.props.onDateChange} dateToStr={this.dateToStr} />,
      android: () => <AndroidDatePicker date={this.state.date} onDateChange={this.props.onDateChange} dateToStr={this.dateToStr}/>,
    })();
  };
};

class IOSDatePicker extends Component {
  render() {
    return (
      <DatePickerIOS
        date={new Date()}
        mode={'date'}
      />
    );
  };
};

class AndroidDatePicker extends Component {
  constructor(props) {
    super(props);

    this.openPicker = this.openPicker.bind(this);

    this.state = {
      date: props.date
    };
  };

  openPicker() {
    DatePickerAndroid.open({
      date: this.state.date
    }).then(function(res) {
      if (res.action !== DatePickerAndroid.dismissedAction) {
        const date = new Date(res.year, res.month, res.day);
        this.setState({date: date});
        this.props.onDateChange(date);
      }
    }.bind(this)).catch(function(err) {
      Toast.show({
        text: 'Error happened! Unable to open Date picker.',
        position: 'bottom',
        buttonText: 'Dismiss'
      });
      console.log(err);
    }.bind(this));
  };

  render() {
    return (
      <Text onPress={this.openPicker} style={{flex: 1, width: '100%'}}>
        {this.props.dateToStr(this.state.date)}
      </Text>
    );
  };
};
