/*
 * Get tasks view
 *
 * return string (html)
 */
function getTagView(rowID) {
  // Set default rowID
  if(rowID == null) {
    rowID = '';
  }
  Logger.log("Getting view for TagID: " + rowID);
  var t = HtmlService.createTemplateFromFile('tagView');

  var tagData = {};
  t.TagModel = {};
  if(rowID) {
    // Render edit-note view
    var TagsModel = getTagsModel([generateWhereClauseRowID(rowID)]);
    if(TagsModel) {
      t.TagModel = TagsModel[Object.keys(TagsModel)[0]];
      tagData.TagModel = t.TagModel;
    }
    t.numberNotes = getNumberNotesWithTag(rowID);
  }
  t.colorOptions = getColorOptions();

  Logger.log(t.TagModel);

  var response = {};
  response.html = t.evaluate().getContent();
  response.data = tagData;
  return response;

}

function saveTag(TagModel, encodeResponse) {
    // Set default encodeResponse
  if(encodeResponse == null) {
    encodeResponse = true;
  }

  Logger.log(TagModel);

  var sql = "";
  if(TagModel.RowID) {
    // Update existing record
    sql = "UPDATE " + appProperties().table.Tag
    + " SET TagName = '" + TagModel.TagName
    + "', Color = '" + TagModel.Color
    + "', LastUpdated = '" + getTimestamp()
    + "' WHERE RowID = '" + TagModel.RowID + "';";
  } else {
   // Insert new record
    sql = "INSERT INTO " + appProperties().table.Tag
    + " (UserEmail, TagName, Color, DateTimeAdded, LastUpdated) VALUES ("
    + "'" + appProperties().User.Email
    + "', '" + TagModel.TagName
    + "', '" + TagModel.Color
    + "', '" + getTimestamp()
    + "', '" + getTimestamp()
    + "')";
  }

  Logger.log(sql);
  var result = FusionTables.Query.sql(sql, {
    hdrs: false
  });
  Logger.log(result);
  log("TagModel result", result);

  var response = {};
  var rows = 0;
  if(result.error) {
    response.success = false;
 //   response.message = "save failed.";
    response.message = result.error.errors[0].message;
    response.rowID = null;
  } else {
    response.success = true;
    response.rowID = TagModel.RowID ? TagModel.RowID : result.rows[0][0];
    response.message = "TagID " + response.rowID + " saved.";

    // Save the ID
 //   rowID = result.rows[0][0];
 //   NoteModel.NoteID = rowID;
 //   response = saveNote(NoteModel);
 //   Logger.log("RowID: " + rows);
  }
  Logger.log(response);
  return encodeResponse ? JSON.stringify(response) : response;
}

function testDeleteTag() {
  var TagModel = {};
  TagModel.RowID = 16;
  var numNotes = getNumberNotesWithTag(TagModel);

  Logger.log(deleteTag(TagModel))
};

function getNumberNotesWithTag(tagId) {
  var numRows = 0;
  if(tagId) {
  var sql = "SELECT COUNT() FROM " + appProperties().table.Note + " WHERE Tags CONTAINS '|" + tagId + "|'";
  Logger.log(sql);
  var result = FusionTables.Query.sqlGet(sql, {
    hdrs: false
  });
  if(result && result['rows']) {
    numRows = result['rows'][0][0];
  }
  }
  Logger.log(numRows);
  return numRows;
}


function deleteTag(TagModel, encodeResponse) {
  Logger.log('Deleting tag.');

  // Set default encodeResponse
  if(encodeResponse == null) {
    encodeResponse = true;
  }

  Logger.log(TagModel);

  var response = {success: false, rowID: null, message: ''};

  var sql = "";
  if(TagModel.RowID) {
    var numNotes = getNumberNotesWithTag(TagModel.RowID);
    if(numNotes > 0) {
      response.success = false;
      response.rowID = null;
      response.message = 'Cannot delete tag. It is tied to ' + numNotes + ' notes.';
    } else {
      sql = "DELETE FROM " + appProperties().table.Tag + " WHERE RowID = " + TagModel.RowID;
      Logger.log(sql);
      var result = FusionTables.Query.sql(sql, {
        hdrs: false
      });
      Logger.log(result);

      if(result.error) {
        response.success = false;
        response.rowID = null;
        response.message = result.error.errors[0].message;
      } else {
        response.success = true;
        response.rowID = TagModel.RowID ? TagModel.RowID : '';
        response.message = "TagID " + response.rowID + " deleted";
      }
    }
  }
  Logger.log(response);
  return encodeResponse ? JSON.stringify(response) : response;
}
