console.log('hello world from sidebar!!');

const getInfo = document.querySelector('.getInfo');

getInfo.onclick = () => {
  console.log('from the sidebar');
  chrome.storage.sync.get(['userData'], function(result) {
    console.log('Value currently is ->', result);
  });
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(
    sender.tab
      ? 'from a content script:' + sender.tab.url
      : 'from the extension'
  );
  console.log(request);
  if (request.to === 'sidebar') {
    sendResponse({ message: 'changed the sidebar!' });
    const text = document.querySelector('.text');
    text.innerHTML = request.content;
    text.classList += ' appear';
  }
});

const form = document.getElementById('form');

form.onsubmit = e => {
  e.preventDefault();
  const selectedText = document.querySelector('.text');
  if (selectedText.value) {
    console.log(selectedText.value);
    const { value } = selectedText;

    const data = {
      to: 'background',
      content: value,
    };

    chrome.runtime.sendMessage(data, response => {
      console.log(response);
    });
  }
};

/*

  some options to consider:
    to anotate text while on the web. this is the easiest part.
    what other fields would we want to get:
      1 - extract browser data/cookies etc - may not be accurate.
      directly ask the user at signup - in order to use the tool.
      fields would be:
        language
        user age
        country
        city
        ...

    and save this data in a organized way...

    next step would be to label the data...
    train machines - machine learning, artificial inteligente etc...

*/

/*

var info = {
  timeOpened: new Date(),
  timezone: new Date().getTimezoneOffset() / 60,

  pageon() {
    return window.location.pathname;
  },
  referrer() {
    return document.referrer;
  },
  previousSites() {
    return history.length;
  },

  browserName() {
    return navigator.appName;
  },
  browserEngine() {
    return navigator.product;
  },
  browserVersion1a() {
    return navigator.appVersion;
  },
  browserVersion1b() {
    return navigator.userAgent;
  },
  browserLanguage() {
    return navigator.language;
  },
  browserOnline() {
    return navigator.onLine;
  },
  browserPlatform() {
    return navigator.platform;
  },
  javaEnabled() {
    return navigator.javaEnabled();
  },
  dataCookiesEnabled() {
    return navigator.cookieEnabled;
  },
  dataCookies1() {
    return document.cookie;
  },
  dataCookies2() {
    return decodeURIComponent(document.cookie.split(';'));
  },
  dataStorage() {
    return localStorage;
  },

  sizeScreenW() {
    return screen.width;
  },
  sizeScreenH() {
    return screen.height;
  },
  sizeDocW() {
    return document.width;
  },
  sizeDocH() {
    return document.height;
  },
  sizeInW() {
    return innerWidth;
  },
  sizeInH() {
    return innerHeight;
  },
  sizeAvailW() {
    return screen.availWidth;
  },
  sizeAvailH() {
    return screen.availHeight;
  },
  scrColorDepth() {
    return screen.colorDepth;
  },
  scrPixelDepth() {
    return screen.pixelDepth;
  },

  latitude() {
    return position.coords.latitude;
  },
  longitude() {
    return position.coords.longitude;
  },
  accuracy() {
    return position.coords.accuracy;
  },
  altitude() {
    return position.coords.altitude;
  },
  altitudeAccuracy() {
    return position.coords.altitudeAccuracy;
  },
  heading() {
    return position.coords.heading;
  },
  speed() {
    return position.coords.speed;
  },
  timestamp() {
    return position.timestamp;
  },
};

console.log(navigator['systemLanguage'], navigator['userLanguage']);
*/
