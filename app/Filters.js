'use strict';

import React, { Component } from 'react';
import {
  CheckBox,
  Text,
  TextInput,
  StyleSheet,
  View,
} from 'react-native';
import {
  Button,
  Container,
  Content,
  Toast,
} from 'native-base';
import {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel
} from 'react-native-simple-radio-button';

import { ModalHeader } from './Headers';

import DatePicker from './DatePicker';

export default class Filters extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.defs = {
      word: { token: '', selected: [] },
      date: { start: Date.now() - 86400000, end: Date.now(), selected: [] },
      sort: { by: 'updatedAt', asc: false }
    };

    this.apply = this.apply.bind(this);
    this.goBack = this.goBack.bind(this);
    this.defaults = this.defaults.bind(this);
    this.wordboxClick = this.wordboxClick.bind(this);

    this.state = {
      word: {
        token: props.screenProps.filters.word.token,
        selected: props.screenProps.filters.word.selected
      },
      date: {
        start: props.screenProps.filters.date.start,
        end: props.screenProps.filters.date.end,
        selected: props.screenProps.filters.date.selected,
      },
      sort: {
        by: props.screenProps.filters.sort.by,
        asc: props.screenProps.filters.sort.asc
      }
    };
  };

  goBack() {
    this.props.navigation.goBack();
  };

  apply() {
    this.props.screenProps.actions.onFiltersChanged(this.state).then(function() {
      Toast.show({
        text: 'Filters applied!',
        position: 'bottom',
        duration: 2000,
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

  defaults() {
    this.props.screenProps.actions.onFiltersChanged(this.defs).then(function() {
      Toast.show({
        text: 'Default filters applied!',
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

  wordboxClick(button) {
    let _selected = this.state.word.selected;
    if (_selected.indexOf(button) !== -1) {
      _selected.splice(_selected.indexOf(button), 1);
    } else {
      _selected = _selected.concat(button);
    }
    this.setState({word: {token: this.state.word.token, selected: _selected}});
  };

  dateBoxClick(button) {
    let _selected = this.state.date.selected;
    if (_selected.indexOf(button) !== -1) {
      _selected.splice(_selected.indexOf(button), 1);
    } else {
      _selected = _selected.concat(button);
    }
    this.setState({date: {start: this.state.date.start, end: this.state.date.end, selected: _selected}});
  };

  sortButtonClick(button) {
    this.setState({sort: {by: button, asc: this.state.sort.asc}});
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      word: {
        token: nextProps.screenProps.filters.word.token,
        selected: nextProps.screenProps.filters.word.selected
      },
      date: {
        start: nextProps.screenProps.filters.date.start,
        end: nextProps.screenProps.filters.date.end,
        selected: nextProps.screenProps.filters.date.selected,
      },
      sort: {
        by: nextProps.screenProps.filters.sort.by,
        asc: nextProps.screenProps.filters.sort.asc
      }
    });
  };

  render() {
    return (
      <Container>
        <ModalHeader title={'Filters'} back={this.goBack}/>
        <Content style={{padding: 10, marginBottom: 10}}>
          <View style={styles.findWord}>
            <Text style={styles.label}>Find Word</Text>
            <TextInput
              underlineColorAndroid='transparent'
              style={styles.textInput}
              value={this.state.word.token}
              onChangeText={(text) => this.setState({word: {token: text, selected: this.state.word.selected}})}
              placeholder='eg: Office'/>
            <View style={styles.checkboxList}>
              <View style={styles.checkboxListItem}>
                <View style={styles.inputImp}>
                  <CheckBox
                    value={(this.state.word.selected.indexOf('serialNo') !== -1)}
                    onValueChange={() => this.wordboxClick('serialNo')}/>
                  <Text
                    onPress={() => this.wordboxClick('serialNo')}
                    style={styles.checkboxLabel}>
                    Serial No.
                  </Text>
                </View>
                <View style={styles.inputImp}>
                  <CheckBox
                    value={(this.state.word.selected.indexOf('counterNo') !== -1)}
                    onValueChange={() => this.wordboxClick('counterNo')}/>
                  <Text
                    onPress={() => this.wordboxClick('counterNo')}
                    style={styles.checkboxLabel}>
                    Counter No.
                  </Text>
                </View>
              </View>
              <View style={styles.checkboxListItem}>
                <View style={styles.inputImp}>
                  <CheckBox
                    value={(this.state.word.selected.indexOf('subject') !== -1)}
                    onValueChange={() => this.wordboxClick('subject')}/>
                  <Text
                    onPress={() => this.wordboxClick('subject')}
                    style={styles.checkboxLabel}>
                    Subject
                  </Text>
                </View>
                <View style={styles.inputImp}>
                  <CheckBox
                    value={(this.state.word.selected.indexOf('sentTo') !== -1)}
                    onValueChange={() => this.wordboxClick('sentTo')}/>
                  <Text
                    onPress={() => this.wordboxClick('sentTo')}
                    style={styles.checkboxLabel}>
                    Sent To.
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.spacer} />
          <View style={styles.findDate}>
            <Text style={styles.label}>By Date</Text>
            <View style={styles.findDatePickerContainer}>
              <View style={styles.datePicker}>
                <DatePicker
                  style={styles.dateLabel}
                  date={new Date((this.state.date.start ? this.state.date.start : Date.now()))}
                  onDateChange={(d) => this.setState({
                    date: {
                      start: d.getTime(),
                      end: this.state.date.end,
                      selected: this.state.date.selected
                    }
                  })}/>
              </View>
              <Text style={styles.datePickerDevider}> - To - </Text>
              <View style={styles.datePicker}>
                <DatePicker
                  style={styles.dateLabel}
                  date={new Date((this.state.date.end ? this.state.date.end : Date.now()))}
                  onDateChange={(d) => this.setState({
                    date: {
                      start: this.state.date.start,
                      end: d.getTime(),
                      selected: this.state.date.selected
                    }
                  })}/>
              </View>
            </View>
            <View style={styles.checkboxList}>
              <View style={styles.checkboxListItem}>
                <View style={styles.inputImp}>
                  <CheckBox
                    value={(this.state.date.selected.indexOf('sentOn') !== -1)}
                    onValueChange={() => this.dateBoxClick('sentOn')}/>
                  <Text
                    onPress={() => this.dateBoxClick('sentOn')}
                    style={styles.checkboxLabel}>
                    Sent On
                  </Text>
                </View>
                <View style={styles.inputImp}>
                  <CheckBox
                    value={(this.state.date.selected.indexOf('replyBy') !== -1)}
                    onValueChange={() => this.dateBoxClick('replyBy')}/>
                  <Text
                    onPress={() => this.dateBoxClick('replyBy')}
                    style={styles.checkboxLabel}>
                    Reply By
                  </Text>
                </View>
              </View>
              <View style={styles.checkboxListItem}>
                <View style={styles.inputImp}>
                  <CheckBox
                    value={(this.state.date.selected.indexOf('updatedAt') !== -1)}
                    onValueChange={() => this.dateBoxClick('updatedAt')}/>
                  <Text
                    onPress={() => this.dateBoxClick('updatedAt')}
                    style={styles.checkboxLabel}>
                    Updated At
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.spacer} />
          <View style={styles.sortBy}>
            <Text style={styles.label}>Sort By</Text>
            <View style={styles.radioButtonList}>
              <View style={styles.radioButtonListItem}>
                <RadioButton labelHorizontal={true}>
                  <RadioButtonInput
                    isSelected={this.state.sort.by === 'sentOn'}
                    obj={{label: 'Sent On'}}
                    onPress={() => this.sortButtonClick('sentOn')}
                    buttonStyle={styles.radioButton}
                    buttonInnerColor={'#000'}
                    borderWidth={2}
                    buttonSize={10}
                    buttonOuterSize={20}/>
                  <RadioButtonLabel
                    obj={{label: 'Sent On'}}
                    labelHorizontal={true}
                    labelStyle={styles.radioButtonLabel}
                    onPress={() => this.sortButtonClick('sentOn')}/>
                </RadioButton>
                <RadioButton labelHorizontal={true}>
                  <RadioButtonInput
                    obj={{label: 'Reply By'}}
                    isSelected={this.state.sort.by === 'replyBy'}
                    onPress={() => this.sortButtonClick('replyBy')}
                    buttonStyle={styles.radioButton}
                    buttonInnerColor={'#000'}
                    borderWidth={2}
                    buttonSize={10}
                    buttonOuterSize={20}/>
                  <RadioButtonLabel
                    obj={{label: 'Reply By'}}
                    labelHorizontal={true}
                    labelStyle={styles.radioButtonLabel}
                    onPress={() => this.sortButtonClick('replyBy')}/>
                </RadioButton>
              </View>
              <View style={styles.radioButtonListItem}>
                <RadioButton labelHorizontal={true}>
                  <RadioButtonInput
                    obj={{label: 'Updated At'}}
                    isSelected={this.state.sort.by === 'updatedAt'}
                    onPress={() => this.sortButtonClick('updatedAt')}
                    buttonStyle={styles.radioButton}
                    buttonInnerColor={'#000'}
                    borderWidth={2}
                    buttonSize={10}
                    buttonOuterSize={20}/>
                  <RadioButtonLabel
                    obj={{label: 'Updated At'}}
                    labelHorizontal={true}
                    labelStyle={styles.radioButtonLabel}
                    onPress={() => this.sortButtonClick('updatedAt')}/>
                </RadioButton>
              </View>
            </View>
          </View>
          <View style={styles.spacer} />
          <View style={styles.sortOrder}>
            <Text style={styles.label}>Sort Order</Text>
            <View style={styles.sortOrderButton}>
              <CheckBox
                style={styles.ascCheckBox}
                value={this.state.sort.asc}
                onValueChange={() => this.setState({sort: {by: this.state.sort.by, asc: !this.state.sort.asc}})}/>
              <Text
                onPress={() => this.setState({sort: {by: this.state.sort.by, asc: !this.state.sort.asc}})}
                style={styles.checkboxLabel}>
                Ascending
              </Text>
            </View>
          </View>
          <View style={styles.spacer} />
          <View style={styles.spacer} />
          <View style={{flexDirection: 'row', justifyContent: 'space-around', padding: 5}}>
            <Button style={styles.defaultsButton}
              onPress={this.defaults}>
              <Text style={styles.defaultsLabel}>Defaults</Text>
            </Button>
            <Button style={styles.applyButton}
              onPress={this.apply}>
              <Text style={styles.applyLabel}>Apply</Text>
            </Button>
          </View>
          <View style={styles.spacer} />
        </Content>
      </Container>
    );
  };
};

const styles = StyleSheet.create({
  defaultsButton: {
    backgroundColor: '#95A5A6',
    flex: 1,
    marginRight: 5,
    marginLeft: 5,
    justifyContent: 'center'
  },
  defaultsLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  applyButton: {
    backgroundColor: '#27AE60',
    flex: 2,
    marginRight: 5,
    marginLeft: 5,
  },
  applyLabel: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    color: '#FFFFFF'
  },
  textInput: {
    fontSize: 18,
    paddingTop: 10,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#00000011',
  },
  label: {
    fontSize: 20,
    color: '#000000',
    padding: 5,
    marginBottom: 10,
  },
  checkboxLabel: {
    fontSize: 18,
    marginLeft: 7,
    marginTop: 3,
  },
  inputImp: {
    flexDirection:'row',
    flexGrow: 1,
    marginBottom: 15,
  },
  spacer: {
    height: 20,
    flexShrink: 0,
    flexGrow: 2,
  },
  findWord: {
    height: 190,
    backgroundColor: '#FFFFFF',
    padding: 5,
  },
  checkboxList: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  checkboxListItem: {
    flex: 1,
    height: 60,
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  radioButtonList: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 15,
  },
  radioButtonListItem: {
    flex: 1,
    height: 60,
    marginLeft: 4,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  radioButtonLabel: {
    fontSize: 18,
  },
  radioButton: {
    borderColor: '#000',
  },
  findDate: {
    height: 210,
    backgroundColor: '#FFFFFF',
    padding: 5,
  },
  sortBy: {
    height: 140,
    backgroundColor: '#FFFFFF',
    padding: 5,
  },
  applyButtonContainer: {
    marginTop: 50,
    marginBottom: 10,
    height: 40,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sortOrderButton: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 15,
  },
  sortOrder: {
    height: 110,
    backgroundColor: '#FFFFFF',
    padding: 5,
  },
  findDatePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  datePicker: {
    flex: 2,
    padding: 10,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#00000055',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  datePickerDevider: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00000055',
    textAlign: 'center',
  },
  dateTouchBody: {
    padding: 0,
    height: 22,
  },
  ascCheckBox: {
    marginLeft: 2
  },
  dateLabel: {
    color: '#000000',
    fontSize: 18,
  },
});
