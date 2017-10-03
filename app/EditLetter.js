'use strict';

import React, { Component } from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  View
} from 'react-native';
import {
  Button,
  Container,
  Icon,
  Content,
  Toast,
} from 'native-base';
import DatePicker from 'react-native-datepicker';
import CheckBox from 'react-native-check-box';

import { ModalHeader } from './Headers';

import LetterModel from './models/Letter';

export default class EditLetter extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    const letterId = props.navigation.state.params.id;
    const letterList = props.screenProps.items.list;
    const letter = letterList.find(function(ele) {
      return ele.letterId === letterId;
    });

    this.goBack = this.goBack.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);

    this.state = {
      letterId: (letter && letter.letterId) ? letter.letterId : '',
      serialNo: (letter && letter.serialNo) ? letter.serialNo : '',
      counterNo: (letter && letter.counterNo) ? letter.counterNo : '',
      sentTo: (letter && letter.sentTo) ? letter.sentTo : '',
      sentOn: (letter && letter.sentOn) ? letter.sentOn : Date.now(),
      subject: (letter && letter.subject) ? letter.subject : '',
      replyBy: (letter && letter.replyBy) ? letter.replyBy : Date.now(),
      important: (letter && letter.important) ? true : false,
      state: (letter && letter.state) ? letter.state : 'pending',
    };
  };

  goBack() {
    this.props.navigation.goBack();
  };

  date(val) {
    if (typeof val === 'string') {
      const date = val.split('/').map(function(i) { return i.trim() });
      return (new Date(parseInt(date[2]), parseInt(date[1] - 1), parseInt(date[0]))).getTime();
    } else if (typeof val === 'number') {
      const nd = new Date(val);
      return '' + nd.getDate() + ' / ' + (nd.getMonth() + 1) + ' / ' + nd.getFullYear();
    } else {
      return Date.now();
    }
  };

  remove() {
    this.props.screenProps.actions.onLetterDelete(this.state.letterId).then(function() {
      Toast.show({
        text: 'Letter deleted!',
        position: 'bottom',
        duration: 3000,
        buttonText: 'Ok'
      });
      this.props.navigation.goBack();
    }.bind(this)).catch(function(err) {
      Toast.show({
        text: 'Error happened!',
        position: 'bottom',
        buttonText: 'Dismiss'
      });
      console.log(err);
    }.bind(this));
  };

  update() {
    let data = {};

    this.state.serialNo && (data.serialNo = this.state.serialNo);
    this.state.counterNo && (data.counterNo = this.state.counterNo);
    this.state.sentTo && (data.sentTo = this.state.sentTo);
    this.state.sentOn && (data.sentOn = this.state.sentOn);
    this.state.subject && (data.subject = this.state.subject);
    this.state.replyBy && (data.replyBy = this.state.replyBy);
    this.state.state && (data.state = this.state.state);

    data.important = this.state.important ? 1 : 0;

    this.props.screenProps.actions.onLetterUpdate(this.state.letterId, data).then(function() {
      Toast.show({
        text: 'Letter updated!',
        position: 'bottom',
        duration: 3000,
        buttonText: 'Ok'
      });
      this.props.navigation.goBack();
    }.bind(this)).catch(function(err) {
      Toast.show({
        text: 'Error happened!',
        position: 'bottom',
        buttonText: 'Dismiss'
      });
      console.log(err);
    }.bind(this));
  };

  render() {
    return (
      <Container>
        <ModalHeader title={'Edit Letter'} back={this.goBack}/>
        <Content>
          <View style={{paddingLeft: 10, paddingRight: 10}}>
            <View>
              <Text style={styles.label}>
                Serial No.
              </Text>
              <TextInput
                value={this.state.serialNo}
                style={styles.textInput}
                placeholder='eg: 123-ACD-201'
                onChangeText={(text) => this.setState({serialNo: text})}/>
            </View>
            <View>
              <Text style={styles.label}>
                Counter No.
              </Text>
              <TextInput
                value={this.state.counterNo}
                style={styles.textInput}
                placeholder='eg: AC-D201705'
                onChangeText={(text) => this.setState({counterNo: text})}/>
            </View>
            <View>
              <Text style={styles.label}>
                Sent To
              </Text>
              <TextInput
                value={this.state.sentTo}
                style={styles.textInput}
                placeholder='eg: Sales report office'
                onChangeText={(text) => this.setState({sentTo: text})}/>
            </View>
            <View style={styles.dateView}>
              <Text style={styles.label}>
                Sent On
              </Text>
              <DatePicker
                style={styles.datePicker}
                date={this.date(this.state.sentOn)}
                customStyles={{
                  dateTouchBody: { height: 30, marginTop: 10, padding: 0 },
                  dateText: { fontSize: 18 },
                  dateInput: { height: 30, alignItems: 'flex-start', borderWidth: 0 }
                }}
                mode='date'
                format='DD / MM / YYYY'
                confirmBtnText='Confirm'
                cancelBtnText='Cancel'
                showIcon={false}
                onDateChange={(d) => this.setState({sentOn: this.date(d)})}/>
            </View>
            <View style={styles.dateView}>
              <Text style={styles.label}>Reply By</Text>
              <DatePicker
                style={styles.datePicker}
                date={this.date(this.state.replyBy)}
                customStyles={{
                  dateTouchBody: { height: 30, marginTop: 10, padding: 0 },
                  dateText: { fontSize: 18 },
                  dateInput: { height: 30, alignItems: 'flex-start', borderWidth: 0 }
                }}
                mode='date'
                format='DD / MM / YYYY'
                confirmBtnText='Confirm'
                cancelBtnText='Cancel'
                showIcon={false}
                onDateChange={(d) => this.setState({replyBy: this.date(d)})}/>
            </View>
            <View>
              <Text style={styles.label}>Subject</Text>
              <TextInput
                value={this.state.subject}
                multiline={true}
                style={styles.multiTextInput}
                placeholder='eg: Report for sales office'
                onChangeText={(text) => this.setState({subject: text})}/>
            </View>
            <View style={styles.inputImp}>
              <CheckBox
                style={styles.checkBox}
                isChecked={this.state.important}
                onClick={() => this.setState({important: !this.state.important})}/>
              <Text style={styles.checkBoxlabel}
                onPress={() => this.setState({important: !this.state.important})}>Important</Text>
            </View>
            <View style={styles.inputImp}>
              <CheckBox
                style={styles.checkBox}
                isChecked={(this.state.state === 'closed')}
                onClick={() => this.setState({state: (this.state.state === 'closed') ? 'pending' : 'closed'})}/>
              <Text style={styles.checkBoxlabel}
                onPress={() => this.setState({state: (this.state.state === 'closed') ? 'pending' : 'closed'})}>
                Closed
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-around', padding: 5, marginTop: 20}}>
            <Button style={styles.deleteButton}
              onPress={this.remove}>
              <Icon name="md-trash" style={styles.deleteLabel}/>
            </Button>
            <Button style={styles.saveButton}
              onPress={this.update}>
              <Text style={styles.saveLabel}>Save</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  };
};

const styles = StyleSheet.create({
  deleteButton: {
    backgroundColor: '#E74C3C',
    flex: 1,
    marginRight: 5,
    marginLeft: 5,
    justifyContent: 'center'
  },
  deleteLabel: {
    color: '#FFFFFF'
  },
  saveButton: {
    backgroundColor: '#27AE60',
    flex: 2,
    marginRight: 5,
    marginLeft: 5,
  },
  saveLabel: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    color: '#FFFFFF'
  },
  label: {
    fontSize: 20,
    marginTop: 20,
  },
  textInput: {
    fontSize: 18,
    marginTop: 10,
    height: 35,
    borderBottomWidth: 1,
    borderBottomColor: '#00000011',
  },
  multiTextInput: {
    fontSize: 18,
    marginTop: 5,
    height: 64,
    borderBottomWidth: 1,
    borderBottomColor: '#00000011',
  },
  checkBox: {
    marginRight: 5,
  },
  checkBoxlabel: {
    fontSize: 18,
  },
  inputImp: {
    flex: 1,
    flexDirection:'row',
    alignItems: 'flex-start',
    marginTop: 20,
  },
  datePicker: {
    flex: 1,
    borderBottomWidth: 0,
  },
  dateView: {
    borderBottomWidth: 1,
    borderBottomColor: '#00000011',
  }
});
