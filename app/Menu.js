'use strict';

import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Text,
  Easing,
  TouchableOpacity,
  Dimensions
} from 'react-native';

const screen = Dimensions.get("window");

class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      animatedStyle : new Animated.Value(0),
      animatedContent : new Animated.Value(0),
      color : this.props.color,
      size : this.props.size,
      position : this.props.position
    }
  }

  componentWillReceiveProps(nextState) {
    const {show, size} = nextState;

    let currentSize = (size) ? size : 20;

    Animated.timing(this.state.animatedStyle, {
      toValue : show ? currentSize : 0,
      delay : show ? 250 : 0,
      useNativeDriver : true,
      easing: Easing.inOut(Easing.ease)
    }).start();

    Animated.timing(this.state.animatedContent, {
      toValue : show ? 1 : 0,
      delay : show ? 350 : 0,
      useNativeDriver : true,
      easing: Easing.inOut(Easing.ease)
    }).start();
  }

  render() {
    const { animatedStyle, animatedContent, color, position } = this.state;
    const {show, items, closeBtn} = this.props;
  }
}
