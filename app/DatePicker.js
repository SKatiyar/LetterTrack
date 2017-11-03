'use strict';

// Fill for squeljs error
import 'core-js';

import React, { Component } from 'react';
import {
  DatePickerAndroid,
  DatePickerIOS,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  Button,
  Toast
} from 'native-base';

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
      ios: () => <IOSDatePicker style={this.props.style} date={this.state.date} onDateChange={this.props.onDateChange} dateToStr={this.dateToStr} />,
      android: () => <AndroidDatePicker style={this.props.style} date={this.state.date} onDateChange={this.props.onDateChange} dateToStr={this.dateToStr}/>,
    })();
  };
};

class IOSDatePicker extends Component {
  constructor(props) {
    super(props);

    this.openPicker = this.openPicker.bind(this);

    this.initialDate = props.date;

    this.state = {
      date: props.date,
      modalVisible: false,
    };
  };

  openPicker(visible, update) {
    this.setState({
      modalVisible: visible,
      date: update ? this.state.date : this.initialDate,
    });
    if (update) {
      this.props.onDateChange(this.state.date);
    }
  };

  render() {
    return (
      <View>
        <Text onPress={() => this.openPicker(true)} style={this.props.style}>
          {this.props.dateToStr(this.state.date)}
        </Text>
        <Modal animationType={'fade'}
          transparent={true}
          visible={this.state.modalVisible}
          presentationStyle={'overFullScreen'}
          onRequestClose={() => {this.openPicker(false)}}>
          <TouchableWithoutFeedback onPress={() => this.openPicker(false)}>
            <View style={styles.modal}>
              <View style={styles.buttonContainer}>
                <Button transparent style={{flex: 1}} onPress={() => this.openPicker(false)}>
                  <Text style={{color: '#E74C3C', paddingLeft: 10, paddingRight: 10, fontSize: 18}}>Cancel</Text>
                </Button>
                <Button transparent
                  style={{flex: 1, justifyContent: 'flex-end'}}
                  onPress={() => this.openPicker(false, true)}>
                  <Text style={{color: '#27AE60', paddingLeft: 10, paddingRight: 10, fontSize: 18}}>Select</Text>
                </Button>
              </View>
              <DatePickerIOS
                date={this.state.date}
                mode={'date'}
                style={{backgroundColor: '#FFFFFF'}}
                onDateChange={(d) => this.setState({date: d})}/>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
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
      <Text onPress={this.openPicker} style={this.props.style}>
        {this.props.dateToStr(this.state.date)}
      </Text>
    );
  };
};

const styles = StyleSheet.create({
  modal: {
    height: '100%',
    justifyContent: 'flex-end',
    backgroundColor: '#00000044',
  },
  buttonContainer: {
    height: 45,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});
