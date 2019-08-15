const apiURL = 'http://localhost';

console.log('background');

chrome.storage.sync.get(['userData'], function(result) {
  console.log('Value currently is ->', result);
})

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

      const data = {
        content,
        authorId: userId
      }

      console.log('data -> ', data);

      const postData = async () => {
        try {
          const response = await fetch(`${apiURL}/api/post-text`, {
           method: 'POST',
           mode: 'cors',
           cache: 'no-cache',
           credentials: 'same-origin',
           headers: {
             'Content-Type': 'application/json',
             'Authorization': `Bearer ${token}`,
           },
           redirect: 'follow',
           referrer: 'no-referrer',
           body: JSON.stringify(data),
         });

         const responseData = await response.json();
         console.log('response from api call -> ', responseData);

         const info = {
           to: 'sidebar-submit',
           content: responseData
         }

         chrome.runtime.sendMessage(info, response => {
           console.log('sending message!', data);
           console.log('response ->', response);
         })

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
