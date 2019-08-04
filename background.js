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

    console.log('text to submit -> ', request);

    chrome.storage.sync.get(['userData'], function(result) {
      console.log('Value currently is ->', result);

      const { content } = request;
      const { token, userId } = result.userData;



      const postData = async () => {
        try {
          const response = await fetch('http://localhost:5000/auth/authenticate', {
           method: 'POST', // *GET, POST, PUT, DELETE, etc.
           mode: 'cors', // no-cors, cors, *same-origin
           cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
           credentials: 'same-origin', // include, *same-origin, omit
           headers: {
             'Content-Type': 'application/json',
             // Authorization: `Bearer ${token}`,
             // 'Content-Type': 'application/x-www-form-urlencoded',
           },
           redirect: 'follow', // manual, *follow, error
           referrer: 'no-referrer', // no-referrer, *client
           body: JSON.stringify(data), // body data type must match "Content-Type" header
         });

        } catch(error) {
          console.log('error -> ', error);
        }
      }
      postData()
    });


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
