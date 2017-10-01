'use strict';

import V4 from 'uuid/v4';
import Squel from 'squel';

import Sql from './Sql';

const pending = 'pending';
const closed = 'closed';

class Letter {
  create(vals) {
    let query = Squel.insert().into('Letters')
      .set('letterId', V4())
      .set('state', pending)
      .set('createdAt', Date.now())
      .set('updatedAt', Date.now());

    vals && vals.serialNo && query.set('serialNo', vals.serialNo);
    vals && vals.counterNo && query.set('counterNo', vals.counterNo);
    vals && vals.sentTo && query.set('sentTo', vals.sentTo);
    vals && vals.sentOn && query.set('sentOn', vals.sentOn);
    vals && vals.subject && query.set('subject', vals.subject);
    vals && vals.replyBy && query.set('replyBy', vals.replyBy);

    if (vals && vals.important !== undefined && vals.important !== null) {
      query.set('important', vals.important);
    }

    console.log(query.toString());

    return Sql.run(query.toString());
  };

  updateById(id, vals) {
    let query = Squel.update().table('Letters')
      .set('updatedAt', Date.now());

    vals && vals.serialNo && query.set('serialNo', vals.serialNo);
    vals && vals.counterNo && query.set('counterNo', vals.counterNo);
    vals && vals.sentTo && query.set('sentTo', vals.sentTo);
    vals && vals.sentOn && query.set('sentOn', vals.sentOn);
    vals && vals.subject && query.set('subject', vals.subject);
    vals && vals.replyBy && query.set('replyBy', vals.replyBy);
    vals && vals.state && query.set('state', vals.state);

    if (vals && vals.important !== undefined && vals.important !== null) {
      query.set('important', vals.important);
    }

    query.where('letterId = ?', id);

    console.log(query.toString());

    return Sql.run(query.toString());
  };

  get(cond) {
    let query = Squel.select().from('Letters');

    if (cond.where) {
      query.where(cond.where);
    }
    if (cond.order) {
      query.order(cond.order.field, cond.order.asc);
    }

    console.log(query.toString());
    return Sql.run(query.toString()).then(function(items) {
      let lArr = [];

      for (let i = 0; i < items.rows.length; i++) {
        lArr = lArr.concat(items.rows.item(i));
      }

      return Promise.resolve(lArr);
    });
  };

  deleteById(id) {
    let query = Squel.delete().from('Letters').where('letterId = ?', id);

    console.log(query.toString());

    return Sql.run(query.toString());
  };

  expr() {
    return Squel.expr();
  };
};

export default new Letter();
