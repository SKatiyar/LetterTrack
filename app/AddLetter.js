'use strict';

import React, { Component } from 'react';
import {
  Modal,
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
import CheckBox from 'react-native-check-box';
import Camera from 'react-native-camera';

import { ModalHeader } from './Headers';
import ImageList from './Images';
import DatePicker from './DatePicker';

export default class AddLetter extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.goBack = this.goBack.bind(this);
    this.save = this.save.bind(this);
    this.removeImage = this.removeImage.bind(this);
    this.showCamera = this.showCamera.bind(this);
    this.takePicture = this.takePicture.bind(this);

    this.state = {
      serialNo: '',
      counterNo: '',
      sentTo: '',
      sentOn: Date.now(),
      subject: '',
      replyBy: Date.now(),
      important: false,
      images: '',
      modalVisible: false,
    };
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

  goBack() {
    this.props.navigation.goBack();
  };

  save() {
    let data = {};

    this.state.serialNo && (data.serialNo = this.state.serialNo);
    this.state.counterNo && (data.counterNo = this.state.counterNo);
    this.state.sentTo && (data.sentTo = this.state.sentTo);
    this.state.sentOn && (data.sentOn = this.state.sentOn);
    this.state.subject && (data.subject = this.state.subject);
    this.state.replyBy && (data.replyBy = this.state.replyBy);
    this.state.images && (data.images = this.state.images);

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
        <Content style={{padding: 10}}>
          <View>
            <Text style={styles.label}>
              Serial No.
            </Text>
            <TextInput
              underlineColorAndroid='transparent'
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
              underlineColorAndroid='transparent'
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
              date={new Date(this.state.sentOn)}
              onDateChange={(d) => this.setState({sentOn: d.getTime()})}/>
          </View>
          <View style={styles.spacer} />
          <View style={styles.dateView}>
            <Text style={styles.label}>Reply By</Text>
            <DatePicker
              style={styles.datePicker}
              date={new Date(this.state.replyBy)}
              onDateChange={(d) => this.setState({replyBy: d.getTime()})}/>
          </View>
          <View style={styles.spacer} />
          <View>
            <Text style={styles.label}>Subject</Text>
            <TextInput
              underlineColorAndroid='transparent'
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
              isChecked={this.state.important}
              onClick={() => this.setState({important: !this.state.important})}/>
            <Text style={styles.checkBoxLabel}
              onPress={() => this.setState({important: !this.state.important})}>Important</Text>
          </View>
          <View style={styles.spacer} />
          <View style={{flexDirection: 'row', justifyContent: 'space-around', padding: 5}}>
            <Button style={styles.saveButton}
              onPress={this.save}>
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
  spacer: {
    height: 20,
    flexShrink: 0,
    flexGrow: 2,
  },
  checkBox: {
    marginRight: 5,
    marginTop: 3,
  },
  checkBoxLabel: {
    fontSize: 20,
    color: '#000000',
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
});
