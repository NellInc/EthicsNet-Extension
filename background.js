const apiURL = 'http://localhost';
const frontend = 'http://localhost:3000/#/';

// const apiURL = 'http://167.71.163.123';
// const frontend = 'http://extension.lupuselit.me/#/'

chrome.runtime.onInstalled.addListener(function() {
  chrome.tabs.create({
    url: 'http://extension.lupuselit.me/#/eula',
    active: true
  });

  return false;
});

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

    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(
      tabs
    ) {
      url = tabs[0].url;
      console.log('URL ->', url);
    });

    chrome.tabs.captureVisibleTab(null, function(img) {
      chrome.storage.sync.get(['userData'], function(result) {
        console.log('Value currently is -> ', result);
        const { token, userId } = result.userData;

        const data = {
          cachedImg: img,
          imageFont: url,
        };

        console.log('====================================');
        console.log(data.cachedImg);
        console.log('====================================');

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

    // setTimeout(() => {
    //   var win = window.open('http://extension.lupuselit.me/#/image/new', '_blank');
    //   win.focus();
    // }, 2000);
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.to === 'video-annotation') {
    console.log('Video Annotation -> ', request);
    sendResponse({ text: 'video annotation on background' });
    chrome.storage.sync.get(['userData'], function(result) {
      console.log('Value currently is -> ', result);
      const { token, userId } = result.userData;
      const { videoUrl } = request;

      const data = {
        cachedVideo: videoUrl,
      };

      const postData = async () => {
        try {
          const response = await fetch(`${apiURL}/api/user/video/${userId}`, {
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
  console.log(
    sender.tab
      ? 'from a content script:' + sender.tab.url
      : 'from the extension'
  );
  if (request.to == 'select-person') {
    console.log('message from the select person button! -> ', request);

    chrome.tabs.captureVisibleTab(null, function(img) {
      chrome.storage.sync.get(['userData'], function(result) {
        console.log('Value currently is -> ', result);
        const { token, userId } = result.userData;

        const data = {
          to: 'select-person-screenshot',
          img,
        };

        console.log('====================================');
        console.log('screenshot from select person -> ', img);
        console.log('====================================');

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, data, function(response) {
            console.log('response to select-person-screenshot ->', response);
          });
        });

        // const postData = async () => {
        //   try {
        //     const response = await fetch(`${apiURL}/api/user/image/${userId}`, {
        //       method: 'PUT',
        //       mode: 'cors',
        //       cache: 'no-cache',
        //       creadentials: 'same-origin',
        //       headers: {
        //         'Content-Type': 'application/json',
        //         Authorization: `Bearer ${token}`,
        //       },
        //       redirect: 'follow',
        //       referrer: 'no-referrer',
        //       body: JSON.stringify(data),
        //     });

        //     const responseData = await response.json();
        //     console.log(responseData);
        //   } catch (error) {
        //     console.log(error);
        //   }
        // };

        // postData();
      });
    });

    sendResponse({ msg: 'select person got the message!' });
  }
});
