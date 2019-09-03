const apiURL = 'http://localhost';
// const apiURL = 'http://167.71.163.123';

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
  title: 'Select area',
  contexts: ['page'],
};

chrome.contextMenus.create(contextMenuItem);

chrome.contextMenus.onClicked.addListener(function(clickedData) {
  if (clickedData.menuItemId === 'ethicsNet') {
    console.log('it is your menu that was clicked!!!');

    let url;

    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
      url = tabs[0].url;
      console.log('URL ->', url);
    });

    chrome.tabs.captureVisibleTab(null, function(img) {
      chrome.storage.sync.get(['userData'], function(result) {
        console.log('Value currently is -> ', result);
        const { token, userId } = result.userData;

        const data = {
          cachedImg: img,
          imageFont: url
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
    });

    setTimeout(() => {
      var win = window.open('http://localhost:3000/#/image/new', '_blank');
      win.focus();
    }, 200);

    // setTimeout(() => {
    //   var win = window.open('http://extension.lupuselit.me/#/image/new', '_blank');
    //   win.focus();
    // }, 2000);
  }
});

