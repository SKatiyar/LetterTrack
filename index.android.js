'use strict';

// Fill for squeljs error
import 'core-js';

import React from 'react';
import { Root } from 'native-base';
import { AppRegistry } from 'react-native';
import { StackNavigator } from 'react-navigation';

import HomeScreen from './app/Home';
import AddLetterScreen from './app/AddLetter';
import EditLetterScreen from './app/EditLetter';
import FiltersScreen from './app/Filters';

import LetterModel from './app/models/Letter';

const typeList = ['Pending', 'Important', 'Closed'];

const Navigator = StackNavigator({
  Home: { screen: HomeScreen, path: '/' },
  AddLetter: { screen: AddLetterScreen, path: '/create-letter' },
  EditLetter: { screen: EditLetterScreen, path: '/edit-letter/:id' },
  Filters: { screen: FiltersScreen, path: '/filters' }
}, {
  initialRouteName: 'Home',
  mode: 'modal'
});

export default class LetterTrack extends React.Component {
  constructor(props) {
    super(props);

    this._parseFilters = this._parseFilters.bind(this);

    this.state = {
      typeList: typeList,
      items: {
        list: [],
        error: false
      },
      selected: {
        name: typeList[0],
        text: 'Loading...'
      },
      actions: {
        onListChanged: this.onListChanged.bind(this),
        onLetterSaved: this.onLetterSaved.bind(this),
        onLetterDelete: this.onLetterDelete.bind(this),
        onLetterDone: this.onLetterDone.bind(this),
        onFiltersChanged: this.onFiltersChanged.bind(this)
      },
      filters: {
        word: {
          token: '',
          selected: []
        },
        date: {
          start: Date.now() - 86400000,
          end: Date.now(),
          selected: []
        },
        sort: {
          by: 'updatedAt',
          asc: false
        }
      }
    };

    LetterModel.get({
      where: this._parseFilters(),
      order: {
        field: this.state.filters.sort.by,
        asc: this.state.filters.sort.asc
      }
    }).then(function(list) {
      this.setState({
        items: {
          list: list,
          error: false
        },
        selected: {
          name: this.state.selected.name,
          text: list.length + ' Letters'
        }
      });
    }.bind(this)).catch(function(err) {
      console.log(err);
      this.setState({
        items: {
          list: [],
          error: true
        },
        selected: {
          name: this.state.selected.name,
          text: 'Loading...'
        }
      });
    }.bind(this));
  };

  _parseFilters(overrides) {
    let query = LetterModel.expr();
    let cFils = this.state.filters;
    let cState = this.state.selected.name.toLowerCase();
    if (overrides && overrides.filters) {
      cFils = overrides.filters;
    }
    if (overrides && overrides.selected) {
      cState = overrides.selected;
    }
    if (cFils.word && cFils.word.token && cFils.word.selected.length) {
      let wordQuery = LetterModel.expr();
      for (let wi = 0; wi < cFils.word.selected.length; wi++) {
        wordQuery.or(cFils.word.selected[wi] + ' LIKE (?)', '%' + cFils.word.token + '%');
      }
      query.and(wordQuery);
    }
    if (cFils.date && cFils.date.selected.length) {
      let dateQuery = LetterModel.expr();
      for (let di = 0; di < cFils.date.selected.length; di++) {
        dateQuery.or(cFils.date.selected[di] + ' BETWEEN ? AND ?', cFils.date.start, cFils.date.end);
      }
      query.and(dateQuery);
    }
    if (cState === 'pending' || cState === 'closed') {
      query.and('state = ?', cState);
    }
    if (cState === 'important') {
      query.and('important = ?', 1);
    }

    return query.toString();
  };

  onLetterDone(id) {
    return LetterModel.updateById(id, {state: 'closed'}).then(function() {
      return LetterModel.get({
        where: this._parseFilters(),
        order: {
          field: this.state.filters.sort.by,
          asc: this.state.filters.sort.asc
        }
      });
    }.bind(this)).then(function(list) {
      this.setState({
        items: {
          list: list,
          error: false
        },
        selected: {
          name: this.state.selected.name,
          text: list.length + ' Letters'
        }
      });
    }.bind(this));
  };

  onLetterDelete(idx) {
    return LetterModel.deleteById(idx).then(function() {
      return LetterModel.get({
        where: this._parseFilters(),
        order: {
          field: this.state.filters.sort.by,
          asc: this.state.filters.sort.asc
        }
      });
    }.bind(this)).then(function(list) {
      this.setState({
        items: {
          list: list,
          error: false
        },
        selected: {
          name: this.state.selected.name,
          text: list.length + ' Letters'
        }
      });
    }.bind(this));
  };

  onLetterSaved(vals) {
    return LetterModel.create(vals).then(function() {
      return LetterModel.get({
        where: this._parseFilters(),
        order: {
          field: this.state.filters.sort.by,
          asc: this.state.filters.sort.asc
        }
      });
    }.bind(this)).then(function(list) {
      this.setState({
        items: {
          list: list,
          error: false
        },
        selected: {
          name: this.state.selected.name,
          text: list.length + ' Letters'
        }
      });
    }.bind(this));
  };

  onListChanged(idx) {
    if (idx > typeList.length - 1) {
      return;
    }

    LetterModel.get({
      where: this._parseFilters({selected: typeList[idx].toLowerCase()}),
      order: {
        field: this.state.filters.sort.by,
        asc: this.state.filters.sort.asc
      }
    }).then(function(list) {
      this.setState({
        items: {
          list: list,
          error: false
        },
        selected: {
          name: typeList[idx],
          text: list.length + ' Letters'
        }
      });
    }.bind(this)).catch(function(err) {
      console.log(err);
      this.setState({
        items: {
          list: [],
          error: true
        },
        selected: {
          name: typeList[idx],
          text: 'Loading...'
        }
      });
    }.bind(this));
  };

  onFiltersChanged(fils) {
    return LetterModel.get({
      where: this._parseFilters({filters: fils}),
      order: {
        field: fils.sort.by,
        asc: fils.sort.asc
      }
    }).then(function(list) {
      this.setState({
        items: {
          list: list,
          error: false
        },
        selected: {
          name: this.state.selected.name,
          text: list.length + ' Letters'
        },
        filters: fils
      });
    }.bind(this)).catch(function(err) {
      console.log(err);
      this.setState({
        items: {
          list: [],
          error: true
        },
        selected: {
          name: this.state.selected.name,
          text: 'Loading...'
        },
        filters: fils
      });
    }.bind(this));
  };

  render() {
    return (
      <Root>
        <Navigator screenProps={this.state}/>
      </Root>
    );
  };
};

AppRegistry.registerComponent('LetterTrack', () => LetterTrack);
