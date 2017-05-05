/*
 * Get tasks view
 *
 * return string (html)
 */
function getNoteView(dataObj) {
  Logger.log('getNoteView()');
  dataObj = dataObj || {};
  var rowID = dataObj.rowID || '';
  Logger.log(dataObj);

  /*
  Algorithm:
  if rowID, look up by rowID
  if page URL, look up by URL
  */
  var NotesCollection = new DB_Collection_Notes(appProperties().table.Note);
  var NotesModel = null;

  if(rowID) {
    Logger.log('lookup rowid');
    NotesCollection.read({
      'columnData' : [
        'RowID', 'NoteName', 'Link', 'Tags', 'Data', 'DateTimeAdded', 'LastUpdated'
      ],
      'conditions' : {
        'rowid': rowID
      }
    });
    NotesModel = NotesCollection.formatAsObjectModel();
  }

  if((!NotesModel || NotesModel.length == 0) && dataObj.pageUrl) {
    Logger.log('lookup url');
     NotesCollection.read({
       'columnData' : [
        'RowID', 'NoteName', 'Link', 'Tags', 'Data', 'DateTimeAdded', 'LastUpdated'
      ],
      'conditions' : {
        'Link': dataObj.pageUrl
      }
    });
    NotesModel = NotesCollection.formatAsObjectModel();
  }

  Logger.log(NotesModel);
  var t = HtmlService.createTemplateFromFile('noteView');
  t.NoteModel = {};
 // Logger.log("Setting NoteModel: " + NotesModel.length);
  if(NotesModel && Object.keys(NotesModel).length > 0) {
    Logger.log('Loading found note');

    t.NoteModel = NotesModel[Object.keys(NotesModel)[0]];

    t.options = generateTagOptionsArray(t.NoteModel.TagList);
    t.optionsSelected = t.NoteModel.Tags.split('|').filter(function(n){return n; });

  } else {
    Logger.log('Loading new note');
    // Render new-note view
    t.options = generateTagOptionsArray([]);
    t.optionsSelected = [];
    Logger.log(dataObj.pageTitle);
    t.NoteModel.NoteName = dataObj.pageTitle || '';
    t.NoteModel.Link = dataObj.pageUrl || '';
  }
  Logger.log(t.NoteModel);
  var noteData = {};
  noteData.options = t.options;
  noteData.optionsSelected = t.optionsSelected;

  var response = {};
  response.html = t.evaluate().getContent();
  response.data = noteData;
//  Logger.log(response);
  return response;




/*  // Set default rowID
  if(rowID == null) {
    rowID = '';
  }
  */
  Logger.log("Getting view for NoteID: " + rowID);
  var t = HtmlService.createTemplateFromFile('noteView');

  t.NoteModel = {};
  if(rowID) {
    // Render edit-note view
    var NotesModel = getNotesModel([generateWhereClauseRowID(rowID)]);
    if(NotesModel) {
      t.NoteModel = NotesModel[Object.keys(NotesModel)[0]];
    }
    t.options = generateTagOptionsArray(t.NoteModel.TagList);
  //  t.optionsSelected = t.NoteModel.Tags.split(",");
    t.optionsSelected = t.NoteModel.Tags.split('|').filter(function(n){return n; });

  } else {
    // Render new-note view
    t.options = generateTagOptionsArray([]);
    t.optionsSelected = [];
  }

  Logger.log(t.NoteModel);

  var noteData = {};
  noteData.options = t.options;
  noteData.optionsSelected = t.optionsSelected;

  var response = {};
  response.html = t.evaluate().getContent();
  response.data = noteData;
  Logger.log(response);
  return response;

}

function saveNote(NoteModel) {
  Logger.log('Saving note.');
  Logger.log(NoteModel);

  var tagList = processTags(NoteModel.Tags);
  var tagsVal = '|' + tagList.join('|') + '|';
  log("taglist: ", tagsVal);
  var sql = "";
  if(NoteModel.RowID) {
    // Update existing record
    sql = "UPDATE " + appProperties().table.Note
    + " SET NoteName = '" + NoteModel.NoteName
    + "', Link = '" + NoteModel.Link
    + "', Tags = '" + tagsVal
    + "', Tags_OLD_FORMAT = '" + tagList
    + "', Data = '" + NoteModel.Data
    + "', LastUpdated = '" + getTimestamp()
    + "' WHERE RowID = '" + NoteModel.RowID + "';";
  } else {
   // Insert new record
    sql = "INSERT INTO " + appProperties().table.Note
    + " (UserEmail, NoteName, Link, Tags, Tags_OLD_FORMAT, Data, DateTimeAdded, LastUpdated, Active) VALUES ("
    + "'" + appProperties().User.Email
    + "', '" + NoteModel.NoteName
    + "', '" + NoteModel.Link
    + "', '" + tagsVal
    + "', '" + tagList
    + "', '" + NoteModel.Data
    + "', '" + getTimestamp()
    + "', '" + getTimestamp()
    + "', '1"
    + "')";
  }

  Logger.log(sql);
  var result = FusionTables.Query.sql(sql, {
    hdrs: false
  });
  Logger.log(result);

  var response = {};
  var rows = 0;
  if(result.error) {
    response.success = false;
    response.message = result.error.errors[0].message;
    response.rowID = null;
  } else {
    response.success = true;
    response.rowID = NoteModel.RowID ? NoteModel.RowID : result.rows[0][0];
    response.message = "NoteID " + response.rowID + " saved";
  }
  Logger.log(response);
  return JSON.stringify(response);
}

function testDeleteNote() {
  var NoteModel = {};
  NoteModel.RowID = 19;
  var response = deleteNote(NoteModel, false);
  Logger.log("Success: " + response.success);
}

function deleteNote(NoteModel, encodeResponse) {
  Logger.log('Deleting note.');

  // Set default encodeResponse
  if(encodeResponse == null) {
    encodeResponse = true;
  }

  Logger.log(NoteModel);

  var sql = "";
  if(NoteModel.RowID) {
    sql = "DELETE FROM " + appProperties().table.Note + " WHERE RowID = " + NoteModel.RowID;
    Logger.log(sql);
    var result = FusionTables.Query.sql(sql, {
      hdrs: false
    });
    Logger.log(result);
  }

  var response = {};
  var rows = 0;
  if(result.error) {
    response.success = false;
    response.message = result.error.errors[0].message;
    response.rowID = null;
  } else {
    response.success = true;
    response.rowID = NoteModel.RowID ? NoteModel.RowID : '';
    response.message = "NoteID " + response.rowID + " deleted";
  }
  Logger.log(response);
  return encodeResponse ? JSON.stringify(response) : response;
}
