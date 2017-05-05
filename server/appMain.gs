/*
 * Render UI HTML
 * This is the special function Google Apps Script calls to initiate the app UI
 */
function doGet(e) {
  Logger.log('Start app');

  // Load Note (Bookmark) from URL
  var action = 'notes';
  var parameters = {};
  if(e.parameter && e.parameter.action) {
    action = e.parameter.action;
    parameters = e.parameter;
  }

  // Load User
  var UserControl = new UserController();
  var UserModel = UserControl.loadUserModel(Session.getActiveUser().getEmail());
  Logger.log(UserModel.getProperties());

  // Render view
  var t = HtmlService.createTemplateFromFile('mainView');
  t.UserModel = UserModel;
  t.action = action;
  t.parameters = parameters;
  return t.evaluate().addMetaTag("viewport", "width=device-width, initial-scale=1").setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getMessage(data) {
  return 'Hello, ' + data + '!';
}
