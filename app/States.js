'use strict';

import LetterModel from './models/Letter';

const typeList = ['Pending', 'Important', 'Closed'];

export default class States {
  defaultProps() {
    return {
      typeList: typeList,
      items: { list: [], error: false },
      selected: { name: typeList[0], text: 'Loading...' },
      filters: {
        word: { token: '', selected: [] },
        date: { start: Date.now() - 86400000, end: Date.now(), selected: [] },
        sort: { by: 'updatedAt', asc: false }
      }
    };
  };

  setState() {
    this.that.setState.apply(this.that, arguments);
  };

  constructor(tht) {
    this.that = tht;

    this.state = JSON.parse(JSON.stringify(this.defaultProps()));
    this.state.actions = {
      onListChanged: this.onListChanged.bind(this),
      onLetterSaved: this.onLetterSaved.bind(this),
      onLetterUpdate: this.onLetterUpdate.bind(this),
      onLetterDelete: this.onLetterDelete.bind(this),
      onLetterDone: this.onLetterDone.bind(this),
      onFiltersChanged: this.onFiltersChanged.bind(this)
    };

    this._parseFilters = this._parseFilters.bind(this);

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

    return this.state;
  };

  _parseFilters(overrides) {
    let query = LetterModel.expr();
    let cFils = this.state.filters;
    let cState = this.state.selected.name.toLowerCase();
    if (overrides && overrides.filters) {
      this.state.filters = overrides.filters;
      cFils = overrides.filters;
    }
    if (overrides && overrides.selected) {
      this.state.selected.name = overrides.selected;
      cState = overrides.selected.toLowerCase();
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

  onLetterUpdate(id, vals) {
    return LetterModel.updateById(id, vals).then(function() {
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
      where: this._parseFilters({selected: typeList[idx]}),
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
};
