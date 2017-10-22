'use strict';

import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Icon,
  Toast
} from 'native-base';

export default class ImageList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      images: props.images ? props.images.split(',') : []
    };
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      images: nextProps.images ? nextProps.images.split(',') : []
    });
  };

  render() {
    let imagesEles = this.state.images.map(function(ele) {
      return <Image key={ele} source={{uri: ele}} style={styles.imagePreview}/>
    });

    console.log(this.state.images, imagesEles)
    return (
      <View>
        {imagesEles}
        <TouchableWithoutFeedback onPress={() => {this.props.showCamera(true)}}>
          <View style={styles.addLetterImage}>
            <Text>Add Image</Text>
            <Icon name='md-camera' />
          </View>
        </TouchableWithoutFeedback>
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
  }
});
