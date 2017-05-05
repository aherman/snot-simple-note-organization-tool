/*
 * Get tasks view
 *
 * return string (html)
 */
function getTagsView(dataObj) {
  var response = {};
  response.html = HtmlService.createTemplateFromFile('tagsView').evaluate().getContent();
  response.data = getTagsList();
  return response;
}

function getTagsList() {
  var sql = 'SELECT RowID as \'View\/Edit\', TagName as \'Name\', Color, DateTimeAdded, LastUpdated FROM ' + appProperties().table.Tag + " WHERE UserEmail = \'" + appProperties().User.Email + "\'";
  Logger.log(sql);
  var result = FusionTables.Query.sqlGet(sql, {
    hdrs: false
  });
  var response = {};
  response.rows = result.rows;

  // Put column headers in format for data tables
  response.columns = [];
  for(var i = 0; i < result.columns.length; i++) {
    response.columns.push({ title: result.columns[i] });
  }

  return response;
}


/*
 * Get list of tags
 *
 * return object|null
 */
function getTagsModel(whereClauseArray) {
//  Logger.log(whereClauseArray);
  // Set default whereClauseArray
  if(whereClauseArray == null) {
    whereClauseArray = [];
  }
  var tagSql = 'SELECT RowID, TagName, Color, DateTimeAdded, LastUpdated FROM ' + appProperties().table.Tag + " WHERE UserEmail = \'" + appProperties().User.Email + "\'";
  var whereClause = trim(whereClauseArray.join(' '));
  if(whereClause) {
    tagSql += ' AND ';
    tagSql += whereClause;
  }

//  var TagsModel = runQuery(tagSql);

  return runQuery(tagSql);
}

function testProcessTags() {
  var tagList = [13,14,'test11'];

  Logger.log("Processed Tags:" + tagList.join(',') + " -> " + processTags(tagList).join(','));
}

function processTags(tagList) {
  var returnTagsList = [];

  for(var i = 0; i < tagList.length; i++) {
    // TODO: This check for an existing tag will not work if a new, digit-only tag is selected
    // Should really check against saved list of tag ids
 //   if(Number.isInteger(tagList[i])) {
    if(!isNaN(tagList[i])) {
      // Existing tag
      returnTagsList.push(tagList[i]);
    } else {
      // New tag
      var TagModel = {};
      TagModel.TagName = tagList[i];
      TagModel.Color = '';
      log("TagModel 1", TagModel);
      var response = saveTag(TagModel, false);
      Logger.log(response);
      if(response.success) {
        returnTagsList.push(response.rowID);
      }
    }
  }

  return returnTagsList;
}
