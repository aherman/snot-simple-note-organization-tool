function Timer () {
  this.startTime = '';
  this.endTime = '';
}
// Class
Timer.prototype = {

  constructor: Timer,

  start: function() {
//    Logger.log('start');
    this.startTime = Date.now();
  },

  getElapsedTime: function(inSeconds) {
    if(inSeconds == null) {
      inSeconds = false;
    }
    this.endTime = Date.now();
    var timeMs = this.endTime - this.startTime;

    return inSeconds? timeMs / 1000 : timeMs;
  }
}

/*
 * Include content of file
 *
 * param filename string - file to include
 *
 * return string (html)
 */
function includeFile(filename) {
//  return HtmlService.createHtmlOutputFromFile(filename).getContent();
  return HtmlService.createTemplateFromFile(filename).evaluate().getContent();
}

/*
 * Get object containing app properties
 *
 * return object
 */
function appProperties() {
  return {
    "table": {
      'User': "1kchyZkHrT9Rqv1KQhP0nWMSlFujLQaAIVTL0w6WD",
      "Tag": "1uU4zC9Fojih5SoHf3m8wYQAGUCg-yxjKKGDnmd9e",
      "Note": "1rgvR3hjz6dIAv80z9rU0LtKgHowNs_cOmO7H_KTz",
      "NoteTag": "1uxZ0N61kQWczHBKxFdkheV-0yM9lXkn0nxK6iem6"
    },
    "User": {
      "Email": Session.getActiveUser().getEmail()
   //   "Email": "legosim@gmail.com"
    }
  };
}

function trim(str) {
  return str.replace(/^\s*([\S\s]*)\b\s*$/, '$1');
}

function getTimestamp() {

  var d = new Date,
    dformat = [d.getFullYear(),
               d.getMonth()+1,
               d.getDate()].join('-')+' '+
              [d.getHours(),
               d.getMinutes(),
               d.getSeconds()].join(':');

  return dformat;
}

function getColorOptions() {
  return [ 'Tomato', 'Crimson', 'Fire Brick', 'Hot Pink', 'Orchid', 'Turquoise', 'Dodger Blue', 'Midnight Blue', 'Dark Sea Green', 'Olive Drab', 'Forest Green', 'Golden Rod', 'Burly Wood', 'Silver' ];
 }



/*
 * Run the specified query
 *
 * param sql string - query to run
 *
 * return list|null (list of row objects with columns as keys)
 */
function runQuery(sql) {
  Logger.log("Query ran: " + sql);
  var result = FusionTables.Query.sqlGet(sql, {
    hdrs: false
  });
  if (result.rows) {


    // Convert data to mapped-model model notation
    var resultObj = {};
    for(var i = 0; i < result.rows.length; i++) {
      var rowObj = {};
      for(var j = 0; j < result.rows[i].length; j++) {
        rowObj[result.columns[j]] = result.rows[i][j];
      }
      // Rename rowid to RowID
      rowObj.RowID = rowObj.rowid;
      delete rowObj.rowid;

      resultObj[rowObj.RowID] = rowObj;
    }

    return resultObj;
  } else {
    Logger.log('No rows returned.');
    return null;
  }
}

function log(label, data) {
  Logger.log(' ');
  Logger.log('### ' + label + ' ###');
  Logger.log(data);
  Logger.log('##########');
}

function extend(obj, props) {
  for (var key in props) obj[key] = props[key]
  return obj;
}
