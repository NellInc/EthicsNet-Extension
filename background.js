console.log('background');

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(
    sender.tab
      ? 'from a content script:' + sender.tab.url
      : 'from the extension'
  );

  console.log(request);

  if (request.to === 'background') {
    sendResponse({ text: 'got it thanks from background' });
  }
});

// // Called when the user clicks on the browser action.
// chrome.browserAction.onClicked.addListener(function(tab) {
//   // Send a message to the active tab
//   chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//     let activeTab = tabs[0];
//     chrome.tabs.sendMessage(activeTab.id, {
//       message: 'hello worldddd!',
//     });
//   });
// });
