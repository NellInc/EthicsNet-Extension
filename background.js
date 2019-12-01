const apiURL = 'http://localhost';
const newApi = 'http://localhost/api2';
const frontend = 'http://localhost:3000/#/';

// const apiURL = 'http://167.71.163.123';
// const newApi = 'http://167.71.163.123/api2';
// const frontend = 'http://extension.lupuselit.me/#/'

chrome.runtime.onInstalled.addListener(function() {
  chrome.tabs.create({
    url: 'http://extension.lupuselit.me/#/eula',
    active: true,
  });
  return false;
});

chrome.storage.sync.get(['userData'], function(result) {
  console.log('Value currently is ->', result);
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.to === 'background') {
    sendResponse({ text: 'got it thanks from background' });
    chrome.storage.sync.get(['userData'], function(result) {
      const { content, categoryRangeContentAction, categoryRangeToneForm, font } = request;
      const { token, userId } = result.userData;
      const data = {
        categoryRangeContentAction,
        categoryRangeToneForm,
        content,
        font,
        authorId: userId,
      };

      const postData = async () => {
        try {
          const response = await fetch(`${newApi}/text`, {
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
    let url;

    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(
      tabs
    ) {
      url = tabs[0].url;
      console.log('URL ->', url);
    });

    chrome.tabs.captureVisibleTab(null, function(img) {
      chrome.storage.sync.get(['userData'], function(result) {
        const { token, userId } = result.userData;
        const data = {
          cachedImg: img,
          imageFont: url,
        };
        const postData = async () => {
          try {
            const response = await fetch(`${newApi}/user/image/${userId}`, {
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
          } catch (error) {
            console.log(error);
          }
        };
        postData();
      });
    });
    setTimeout(() => {
      var win = window.open(frontend + 'image/new', '_blank');
      win.focus();
    }, 200);
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.to === 'video-annotation') {
    sendResponse({ text: 'video annotation on background' });
    chrome.storage.sync.get(['userData'], function(result) {
      const { token, userId } = result.userData;
      const { videoUrl } = request;
      const data = {
        cachedVideo: videoUrl,
      };

      const postData = async () => {
        try {
          const response = await fetch(`${newApi}/user/video/${userId}`, {
            method: 'PUT',
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
          console.log(responseData);
        } catch (error) {
          console.log(error);
        }
      };
      postData();
    });

    setTimeout(() => {
      var win = window.open(frontend + 'video/save', '_blank');
      win.focus();
    }, 200);
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.to == 'select-person') {
    chrome.tabs.captureVisibleTab(null, function(img) {
      chrome.storage.sync.get(['userData'], function(result) {
        const { token, userId } = result.userData;
        const data = {
          to: 'select-person-screenshot',
          img,
        };
        chrome.tabs.query({ active: true, currentWindow: true }, function(
          tabs
        ) {
          chrome.tabs.sendMessage(tabs[0].id, data, function(response) {
            console.log('response to select-person-screenshot ->', response);
          });
        });
      });
    });

    sendResponse({ msg: 'select person got the message!' });
  }
});
