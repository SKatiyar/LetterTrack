'use strict';

import React, { Component } from 'react';
import {
  CheckBox,
  Modal,
  Text,
  TextInput,
  StyleSheet,
  View,
} from 'react-native';
import {
  Button,
  Container,
  Icon,
  Content,
  Toast,
} from 'native-base';
import Camera from 'react-native-camera';

import LetterModel from './models/Letter';

import { ModalHeader } from './Headers';
import ImageList from './Images';
import DatePicker from './DatePicker';

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
    this.removeImage = this.removeImage.bind(this);
    this.showCamera = this.showCamera.bind(this);
    this.takePicture = this.takePicture.bind(this);

    this.state = {
      letterId: (letter && letter.letterId) ? letter.letterId : '',
      serialNo: (letter && letter.serialNo) ? letter.serialNo : '',
      counterNo: (letter && letter.counterNo) ? letter.counterNo : '',
      sentTo: (letter && letter.sentTo) ? letter.sentTo : '',
      sentOn: (letter && letter.sentOn) ? letter.sentOn : Date.now(),
      subject: (letter && letter.subject) ? letter.subject : '',
      images: (letter && letter.images) ? letter.images : '',
      replyBy: (letter && letter.replyBy) ? letter.replyBy : Date.now(),
      important: (letter && letter.important) ? true : false,
      state: (letter && letter.state) ? letter.state : 'pending',
      modalVisible: false,
    };
  };

  goBack() {
    this.props.navigation.goBack();
  };

  showCamera(visible) {
    this.setState({modalVisible: visible});
  };

  takePicture() {
    this.camera.capture({}).then(function(data) {
      this.showCamera(false);
      let images = this.state.images ? this.state.images.split(',') : [];
      images.push(data.path);
      this.state.images = images.join(',');
      this.setState(this.state);
    }.bind(this)).catch(function(err) {
      Toast.show({
        text: 'Error happened!',
        position: 'bottom',
        buttonText: 'Dismiss'
      });
      console.log(err);
    });
  };

  removeImage(img) {
    let images = this.state.images ? this.state.images.split(',') : [];
    let idx = images.indexOf(img)
    if (idx > -1) {
      images.splice(idx, 1)
    }
    this.state.images = images.join(',');
    this.setState(this.state);
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

    data.images = this.state.images ? this.state.images : '';
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
                underlineColorAndroid='transparent'
                value={this.state.serialNo}
                style={styles.textInput}
                placeholder='eg: 123-ACD-201'
                onChangeText={(text) => this.setState({serialNo: text})}/>
            </View>
            <View style={styles.spacer} />
            <View>
              <Text style={styles.label}>
                Counter No.
              </Text>
              <TextInput
                underlineColorAndroid='transparent'
                value={this.state.counterNo}
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
                underlineColorAndroid='transparent'
                value={this.state.sentTo}
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
                style={styles.dateLabel}
                date={new Date(this.state.sentOn)}
                onDateChange={(d) => this.setState({sentOn: d.getTime()})}/>
            </View>
            <View style={styles.spacer} />
            <View style={styles.dateView}>
              <Text style={styles.label}>Reply By</Text>
              <DatePicker
                style={styles.dateLabel}
                date={new Date(this.state.replyBy)}
                onDateChange={(d) => this.setState({replyBy: d.getTime()})}/>
            </View>
            <View style={styles.spacer} />
            <View>
              <Text style={styles.label}>Subject</Text>
              <TextInput
                underlineColorAndroid='transparent'
                value={this.state.subject}
                multiline={true}
                style={styles.multiTextInput}
                placeholder='eg: Report for sales office'
                onChangeText={(text) => this.setState({subject: text})}/>
            </View>
            <View style={styles.spacer} />
            <View>
              <Text style={styles.label}>Add Image</Text>
              <View style={styles.spacer} />
              <ImageList images={this.state.images} showCamera={this.showCamera} removeImage={this.removeImage}/>
            </View>
            <View style={styles.spacer} />
            <View style={styles.inputImp}>
              <CheckBox
                style={styles.checkBox}
                value={this.state.important}
                onValueChange={() => this.setState({important: !this.state.important})}/>
              <Text style={styles.checkBoxLabel}
                onPress={() => this.setState({important: !this.state.important})}>Important</Text>
            </View>
            <View style={styles.inputImp}>
              <CheckBox
                style={styles.checkBox}
                value={(this.state.state === 'closed')}
                onValueChange={() => this.setState({
                  state: (this.state.state === 'closed') ? 'pending' : 'closed'
                })}/>
              <Text style={styles.checkBoxLabel}
                onPress={() => this.setState({state: (this.state.state === 'closed') ? 'pending' : 'closed'})}>
                Closed
              </Text>
            </View>
          </View>
          <View style={styles.spacer} />
          <View style={styles.spacer} />
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
          <View style={styles.spacer} />
          <View style={styles.spacer} />
        </Content>
        <Modal animationType={'fade'}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {this.showCamera(false)}}>
          <Camera
            ref={(cam) => {
              this.camera = cam;
            }}
            captureMode={Camera.constants.CaptureMode.still}
            style={styles.imagePreview}
            captureTarget={Camera.constants.CaptureTarget.disk}
            aspect={Camera.constants.Aspect.fill}>
            <Icon name='md-aperture' style={styles.captureImage} onPress={this.takePicture} />
          </Camera>
        </Modal>
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
    color: '#000000',
    fontSize: 20,
    marginTop: 20,
  },
  textInput: {
    fontSize: 18,
    paddingTop: 10,
    marginTop: 5,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#00000011',
  },
  multiTextInput: {
    fontSize: 18,
    paddingTop: 10,
    height: 70,
    borderBottomWidth: 1,
    borderBottomColor: '#00000011',
  },
  checkBox: {
    marginRight: 5,
  },
  checkBoxLabel: {
    fontSize: 20,
    color: '#000000',
  },
  inputImp: {
    flex: 1,
    flexDirection:'row',
    alignItems: 'flex-start',
    marginTop: 20,
  },
  spacer: {
    height: 20,
    flexShrink: 0,
    flexGrow: 2,
  },
  dateView: {
    borderBottomWidth: 1,
    borderBottomColor: '#00000011',
  },
  imagePreview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  captureImage: {
    fontSize: 50,
    paddingBottom: 20,
    color: '#FFFFFF'
  },
  dateLabel: {
    flex: 1,
    width: '100%',
    height: 40,
    color: '#000000',
    fontSize: 18,
    paddingTop: 10,
    marginTop: 5,
  },
});
