'use strict';

import React, { Component } from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  View,
} from 'react-native';
import {
  Button,
  Container,
  Content,
  Icon,
  Toast
} from 'native-base';
import DatePicker from 'react-native-datepicker';
import CheckBox from 'react-native-check-box';

import { ModalHeader } from './Headers';

export default class AddLetter extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.goBack = this.goBack.bind(this);
    this.save = this.save.bind(this);

    this.state = {
      serialNo: '',
      counterNo: '',
      sentTo: '',
      sentOn: Date.now(),
      subject: '',
      replyBy: Date.now(),
      important: false,
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
      const iDate = new Date(val);
      return '' + iDate.getDate() + ' / ' + (iDate.getMonth() + 1) + ' / ' + iDate.getFullYear();
    } else {
      return Date.now();
    }
  };

  save() {
    let data = {};

    this.state.serialNo && (data.serialNo = this.state.serialNo);
    this.state.counterNo && (data.counterNo = this.state.counterNo);
    this.state.sentTo && (data.sentTo = this.state.sentTo);
    this.state.sentOn && (data.sentOn = this.state.sentOn);
    this.state.subject && (data.subject = this.state.subject);
    this.state.replyBy && (data.replyBy = this.state.replyBy);

    data.important = this.state.important ? 1 : 0;

    this.props.screenProps.actions.onLetterSaved(data).then(function() {
      Toast.show({
        text: 'Letter Saved!',
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
        <ModalHeader title={'Add Letter'} back={this.goBack}/>
        <Content style={{padding: 10, marginBottom: 10}}>
          <View>
            <Text style={styles.label}>
              Serial No.
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder='eg: 123-ACD-201'
              onChangeText={(text) => this.setState({serialNo: text})}
              autoFocus/>
          </View>
          <View style={styles.spacer} />
          <View>
            <Text style={styles.label}>
              Counter No.
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder='eg: AC-D201705'
              onChangeText={(text) => this.setState({counterNo: text})}/>
          </View>
          <View style={styles.spacer} />
          <View>
            <Text style={styles.label}>
              Sent To
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder='eg: Sales report office'
              onChangeText={(text) => this.setState({sentTo: text})}/>
          </View>
          <View style={styles.spacer} />
          <View style={styles.dateView}>
            <Text style={styles.label}>
              Sent On
            </Text>
            <DatePicker
              style={styles.datePicker}
              date={this.date(this.state.sentOn)}
              customStyles={{
                dateTouchBody: { height: 22, marginTop: 10, padding: 0 },
                dateText: { fontSize: 18 },
                dateInput: { height: 22, alignItems: 'flex-start', borderWidth: 0 }
              }}
              mode='date'
              format='DD / MM / YYYY'
              confirmBtnText='Confirm'
              cancelBtnText='Cancel'
              showIcon={false}
              onDateChange={(d) => this.setState({sentOn: this.date(d)})}/>
          </View>
          <View style={styles.spacer} />
          <View style={styles.dateView}>
            <Text style={styles.label}>Reply By</Text>
            <DatePicker
              style={styles.datePicker}
              date={this.date(this.state.replyBy)}
              customStyles={{
                dateTouchBody: { height: 22, marginTop: 10, padding: 0 },
                dateText: { fontSize: 18 },
                dateInput: { height: 22, alignItems: 'flex-start', borderWidth: 0 }
              }}
              mode='date'
              format='DD / MM / YYYY'
              confirmBtnText='Confirm'
              cancelBtnText='Cancel'
              showIcon={false}
              onDateChange={(d) => this.setState({replyBy: this.date(d)})}/>
          </View>
          <View style={styles.spacer} />
          <View>
            <Text style={styles.label}>Subject</Text>
            <TextInput
              multiline={true}
              style={styles.multiTextInput}
              placeholder='eg: Report for sales office'
              onChangeText={(text) => this.setState({subject: text})}/>
          </View>
          <View style={styles.spacer} />
          <View style={styles.inputImp}>
            <CheckBox
              style={styles.checkBox}
              isChecked={this.state.important}
              onClick={() => this.setState({important: !this.state.important})}/>
            <Text style={styles.checkBoxLabel}>Important</Text>
          </View>
          <View style={styles.spacer} />
          <View style={{flexDirection: 'row', justifyContent: 'space-around', padding: 5, marginTop: 20}}>
            <Button style={styles.saveButton}
              onPress={this.save}>
              <Text style={styles.saveLabel}>Save</Text>
            </Button>
          </View>
          <View style={styles.spacer} />
        </Content>
      </Container>
    );
  };
};

const styles = StyleSheet.create({
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
    marginTop: 10,
    height: 65,
    borderBottomWidth: 1,
    borderBottomColor: '#00000011',
  },
  spacer: {
    height: 10,
    flexShrink: 0,
    flexGrow: 2,
  },
  checkBox: {
    marginRight: 5,
  },
  checkBoxLabel: {
    fontSize: 18,
  },
  inputImp: {
    flex: 1,
    alignItems: 'flex-start',
    flexDirection:'row',
    marginTop: 20
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
