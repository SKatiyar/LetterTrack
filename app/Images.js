'use strict';

import React, { Component } from 'react';
import {
  Modal,
  Image,
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Button,
  Icon,
  Toast,
} from 'native-base';

export default class ImageList extends Component {
  constructor(props) {
    super(props);

    this.showModal = this.showModal.bind(this);
    this.removeImage = this.removeImage.bind(this);

    this.state = {
      images: props.images ? props.images.split(',') : [],
      modalVisible: false,
      previewImage: '',
    };
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      images: nextProps.images ? nextProps.images.split(',') : []
    });
  };

  showModal(img) {
    if (img) {
      this.setState({
        modalVisible: true,
        previewImage: img,
      });
    } else {
      this.setState({
        modalVisible: false,
        previewImage: '',
      });
    }
  };

  removeImage() {
    this.props.removeImage(this.state.previewImage);
    this.showModal();
  };

  render() {
    let imagesEles = this.state.images.map(function(ele) {
      return (
        <TouchableWithoutFeedback onPress={() => {this.showModal(ele)}} key={ele}>
          <Image source={{uri: ele}} style={styles.imagePreview} />
        </TouchableWithoutFeedback>
      );
    }.bind(this));

    return (
      <View>
        <View style={styles.imagesContainer}>
          {imagesEles}
          <TouchableWithoutFeedback onPress={() => {this.props.showCamera(true)}}>
            <View style={styles.addLetterImage}>
              <Text>Add Image</Text>
              <Icon name='md-camera' />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <Modal animationType={'fade'}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {this.showModal()}}>
          <Image source={{uri: this.state.previewImage}} style={styles.modalPreview}/>
          <Button style={styles.deleteButton}
            onPress={this.removeImage}>
            <Icon name="md-trash" style={styles.deleteLabel}/>
          </Button>
        </Modal>
      </View>
    );
  };
};

const styles = StyleSheet.create({
  addLetterImage: {
    height: 150,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DDD',
  },
  imagePreview: {
    height: 150,
    width: 100,
    marginRight: 5,
    borderWidth: 1,
    borderColor: '#00000011',
  },
  imagesContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  deleteButton: {
    position: 'absolute',
    bottom: 5,
    width: 100,
    backgroundColor: '#E74C3C',
    marginRight: 5,
    marginLeft: 5,
    justifyContent: 'center'
  },
  modalPreview: {
    flex: 1,
    resizeMode: 'contain',
  },
  deleteLabel: {
    color: '#FFFFFF'
  },
});
