// const apiURL = 'http://localhost';
const apiURL = 'http://167.71.163.123';

console.log('background');

chrome.storage.sync.get(['userData'], function(result) {
  console.log('Value currently is ->', result);
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.to === 'background') {
    sendResponse({ text: 'got it thanks from background' });

    console.log('text to submit -> ', request);

    chrome.storage.sync.get(['userData'], function(result) {
      console.log('Value currently is -> ', result);

      const { content, category, font } = request;
      const { token, userId } = result.userData;

      console.log('request from sidebar -> ', request);
      const data = {
        category,
        content,
        font,
        authorId: userId,
      };

      console.log('data -> ', data);

      const postData = async () => {
        console.log('API URL ->', apiURL);
        try {
          const response = await fetch(`${apiURL}/api/post-text`, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            redirect: 'follow',
            referrer: 'no-referrer',
            body: JSON.stringify(data),
          });

          const responseData = await response.json();
          console.log('response from api call -> ', responseData);

          const info = {
            to: 'sidebar-submit',
            content: responseData,
          };

          chrome.runtime.sendMessage(info, response => {
            console.log('sending message!', data);
            console.log('response ->', response);
          });
        } catch (error) {
          console.log('error -> ', error);
        }
      };

      postData();
    });
  }
});

const contextMenuItem = {
  id: 'ethicsNet',
  title: 'Select Area',
  contexts: ['page'],
};

chrome.contextMenus.create(contextMenuItem);

chrome.contextMenus.onClicked.addListener(function(clickedData) {
  if (clickedData.menuItemId === 'ethicsNet') {
    console.log('it is your menu that was clicked!!!');

    const data = {
      to: 'select-area',
      content: 'select area option was clicked!',
    };

    // needs to specify with tab to send the message to!
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, data, function(response) {
        console.log(response);
      });
    });
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.to === 'cache-image') {
    console.log(request);
    sendResponse('got it, thanks!');

    chrome.storage.sync.get(['userData'], function(result) {
      console.log('Value currently is -> ', result);

      const { content } = request;
      const { token, userId } = result.userData;

      const data = {
        cachedImg: request.content,
      };

      const postData = async () => {
        try {
          const response = await fetch(`${apiURL}/api/user/image/${userId}`, {
            method: 'PUT',
            mode: 'cors',
            cache: 'no-cache',
            creadentials: 'same-origin',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            redirect: 'follow',
            referrer: 'no-referrer',
            body: JSON.stringify(data),
          });

          const responseData = await response.json();
          console.log(responseData);
        } catch (e) {}
      };

      postData();
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
