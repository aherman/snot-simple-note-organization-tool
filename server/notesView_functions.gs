/*
 * Get tasks view
 *
 * return string (html)
 */
function getNotesView(dataObj) {
  // Set default tagFilterArray
  if(dataObj == null) {
    dataObj = {};
  }
  Logger.log(dataObj);

  var searchParam = '';
  if(dataObj && dataObj['tagID']) {
    var TagsModel = getTagsModel([generateWhereClauseRowID(dataObj['tagID'])]);
    if(TagsModel) {
      searchParam = TagsModel[Object.keys(TagsModel)[0]].TagName; 
    }
  }

  var response = {};
  response.html = HtmlService.createTemplateFromFile('notesView').evaluate().getContent();
  response.data = getNotesList();
  response.data.searchParam = searchParam;

  return response;
}

function generateTagOptionsArray(selectedTagsArray) {
  var TagsModel = getTagsModel();
  var optionsArray =  [];
  if(TagsModel) {
    var TagsModelKeys = Object.keys(TagsModel);
    for(var i = 0; i < TagsModelKeys.length; i++) {
      optionsArray.push({id: TagsModel[TagsModelKeys[i]].RowID, text: TagsModel[TagsModelKeys[i]].TagName, RowID: TagsModel[TagsModelKeys[i]].RowID, selected: (selectedTagsArray.indexOf(TagsModel[TagsModelKeys[i]].RowID) >= 0)});
    }
  }
  return optionsArray;
}

function generateWhereClauseTagFilter(tagFilterArray) {
  // Set default tagFilterArray
  if(tagFilterArray == null) {
    tagFilterArray = [];
  }
  var sql = '';

  for(var i = 0; i < tagFilterArray.length; i++) {
      sql += ' Tags Contains ' + tagFilterArray[i];
    };
  return sql;
}

function generateWhereClauseRowID(rowID) {
  var sql = '';
 // Logger.log(rowID);
  // Set default rowID
  if(rowID) {
 //   rowID = '';
    sql += ' RowID = ' + rowID;
  }
  return sql;
}

function getNotesList() {
  Logger.log('function::getNotesList()');

//  var sql = 'SELECT RowID as \'View\/Edit\', NoteName as \'Name\', Tags, DateTimeAdded, LastUpdated FROM ' + appProperties().table.Note + ' WHERE Active = 1';
  var sql = "SELECT RowID as \'View\/Edit\', NoteName as \'Name\', Tags, DateTimeAdded, LastUpdated FROM " + appProperties().table.Note + " WHERE UserEmail = \'" + appProperties().User.Email + "\'";

  Logger.log(sql);
  var result = FusionTables.Query.sqlGet(sql, {
    hdrs: false
  });
  var response = {};
  response.rows = result.rows;

  // Put column headers in format for data tables
  response.columns = [];

  if(result && result.rows) {
    for(var i = 0; i < result.columns.length; i++) {
      response.columns.push({ title: result.columns[i] });
    }

    // Fill-in tag names
    var TagsModel = getTagsModel();
    // Look up index of 'Tag' column in case order of columns in query is changed
    var tagIndex = result.columns.indexOf('Tags');
    for(var i = 0; i < result.rows.length; i++) {
   //   var tagsIdArr = result.rows[i][tagIndex].split(',');
      var tagsIdArr = result.rows[i][tagIndex].split('|').filter(function(n){return n; });
   //   Logger.log(tagsIdArr);
        var tagsNameArr = [];
        for(var j = 0; j < tagsIdArr.length; j++) {
          if(tagsIdArr[j]) {
            tagsNameArr.push(TagsModel[tagsIdArr[j]]);
          }
        }
        response.rows[i][tagIndex] = tagsNameArr;
    }
  }
//  Logger.log(response);
  return response;
}

String.prototype.hashCode = function(){
 var hash = 0;
if (this.length == 0) return hash;
 for (i = 0; i < this.length; i++) {
    char = this.charCodeAt(i);
    hash = ((hash<<5)-hash)+char;
    hash = hash & hash; // Convert to 32bit integer
 }
  return hash;
}


/*
 * Get list of notes
 *
 * return object|null
 */
function getNotesModel(whereClauseArray) {
  // Set default whereClauseArray
  if(whereClauseArray == null) {
    whereClauseArray = [];
  }
  var noteSql = 'SELECT RowID, NoteName, Link, Tags, Data, DateTimeAdded, LastUpdated FROM ' + appProperties().table.Note;
//  noteSql += ' WHERE RowID > "-1"';
  var whereClause = trim(whereClauseArray.join(' '));
//  Logger.log("Where: " + whereClause);
  if(whereClause) {
    noteSql += ' WHERE ';
    noteSql += whereClause;
 //   noteSql += ' Active = 1';
//    Logger.log("Length: " + whereClauseArray.length);
  }
  noteSql += ' ORDER BY DateTimeAdded ASC';

  var NotesModel = runQuery(noteSql);
//  log('NotesModel initial: ', NotesModel);
  if(NotesModel != null) {
    var TagsModel = getTagsModel();

    var notesModelKeys = Object.keys(NotesModel);
    for(var i = 0; i < notesModelKeys.length; i++) {
      // NotesModel[notesModelKeys[i]]: row
  //    var tagsArr = NotesModel[notesModelKeys[i]].Tags.split(',');
      var tagsArr = NotesModel[notesModelKeys[i]].Tags.split('|').filter(function(n){return n; });
      NotesModel[notesModelKeys[i]].TagList = [];
      for(var j = 0; j < tagsArr.length; j++) {

        if(tagsArr[j]) {
        //  log(notesModelKeys[i] + ": " + typeof tagsArr[j], TagsModel[tagsArr[j]]);
          NotesModel[notesModelKeys[i]].TagList.push(TagsModel[tagsArr[j]]);
        }
      }
}
    return NotesModel;
  } else {
    return [];
  }
}

function getNotesCount() {
   var sql = "SELECT NoteName, Tags FROM " + appProperties().table.Note + " WHERE Tags CONTAINS '|13|' AND UserEmail = \'" + appProperties().User.Email + "\'";
  Logger.log(sql);
  var result = FusionTables.Query.sqlGet(sql, {
    hdrs: false
  });
  var response = {};
  response.rows = result.rows;
  Logger.log(result.rows);
}
