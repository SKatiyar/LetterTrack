'use strict';

import SQLite from 'react-native-sqlite-storage';

const dbName = 'LetterTrack.db';
const dbVersion = '1.0';
const dbDisplayName = 'Letters Database';
const dbSize = 200000; // max 5000000;

const lettersTbl = 'Letters';

const createLetterTable = 'CREATE TABLE IF NOT EXISTS ' + lettersTbl + ' ('
  + 'letterId TEXT PRIMARY KEY NOT NULL, '
  + 'serialNo TEXT, '
  + 'counterNo TEXT, '
  + 'sentTo TEXT, '
  + 'sentOn INTEGER, '
  + 'images TEXT, '
  + 'subject TEXT, '
  + 'replyBy INTEGER, '
  + 'important INTEGER NOT NULL, '
  + 'state TEXT NOT NULL, '
  + 'createdAt INTEGER NOT NULL, '
  + 'updatedAt INTEGER NOT NULL'
  + ')';

let gDb;
let gError;
let init = true;

SQLite.openDatabase(dbName, dbVersion, dbDisplayName, dbSize, function(db) {
  gDb = db;
}, function(err) {
  gError = err;
});

class Model {
  static tillReady() {
    return new Promise(function(resolve, reject) {
      let intetrval = setInterval(function() {
        if (gError) {
          clearInterval(intetrval);
          return reject(gError);
        } else if (gDb){
          clearInterval(intetrval);
          return resolve(gDb);
        }
      }, 5);
    }).then(function(db) {
      if (init) {
        init = false;
        return new Promise(function(resolve, reject) {
          db.executeSql(createLetterTable, [], function(result) {
            resolve(db);
          }, function(err) {
            reject(err);
          });
        });
      }

      return Promise.resolve(db);
    });
  };

  static run(stm) {
    return this.tillReady().then(function(db) {
      return new Promise(function(resolve, reject) {
        db.executeSql(stm, [], function(result) {
          resolve(result);
        }, function(err) {
          reject(err);
        });
      });
    });
  };

  static createTables() {
    return this.tillReady().then(function(db) {
      return new Promise(function(resolve, reject) {
        db.executeSql(stm, [], function(result) {
          resolve(result);
        }, function(err) {
          reject(err);
        });
      });
    });
  };
};

export const Tables = {
  Letters: lettersTbl
};

export default Model;
