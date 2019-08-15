console.log('hello world from sidebar!!');

const toSubmit = document.querySelector('.to-submit');

console.log('TO SUBMIT ->', toSubmit);

const apiURL = 'http://localhost:3000'

chrome.storage.sync.get(['userData'], function(result) {
  console.log('userdata ->', result.userData);
  if (!result.userData) {
    toSubmit.innerHTML = `


      <div style="display: flex; flex-direction: column; align-items: center;">
        <div>
          you need to login first to make any anotations
        </div>
        <div>
          <a
            href="${apiURL}/#/login"
            target="_blank"
            style="color: #fff;"
            class="btn btn-primary"
          >
            login
          </a>
          <a
            href="${apiURL}/#/register"
            target="_blank"
            style="color: #fff;"
            class="btn btn-primary"
          >
            sign up
          </a>
        </div>
      </div>
    `
  }

  else {
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

    console.log('form ->', form);
    console.log('TO SUBMIT ->', toSubmit);

    form.onsubmit = e => {

      console.log('\n\nsubmitting the form!! -> ');

      e.preventDefault();

      const selectedText = document.querySelector('.text');
      console.log('selectedText -> ', selectedText);

      if (selectedText.value) {
        console.log(selectedText.value);
        const { value } = selectedText;

        const data = {
          to: 'background',
          content: value,
        };

        toSubmit.innerHTML = `
          <div class="loader-wrapper">
            <div class="spinner-border" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        `

        chrome.runtime.sendMessage(data, response => {
          console.log(response);
        });
      }
    };

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      console.log('getting message from api call ->', request);
      if (request.to === 'sidebar-submit') {
        sendResponse({ message: 'we got the message!!' });
        console.log('API CALL MADE');

        toSubmit.innerHTML = `
          <div class="">
            <p>Anotation saved</p>
            <p class="text-saved">${request.content.textCreated.content}</p>
            <button class="btn btn-primary"><a style="color: #fff;" href="http://localhost:3000/profile/anotations" target="_blank">see all</a></button>
            <button class="btn btn-secondary new-anotation">new anotation</button>
          </div>
        `

        let newAnotation = document.querySelector('.new-anotation');

        newAnotation.onclick = () => {
          console.log('reloading...');
          window.location.reload();
          // console.log('\n\nnew anotation.. injecting');
          // toSubmit.innerHTML = `
          //   <h4 class="text-center mb-2">Ethics Eth - Annotate the web</h4>
          //   <form id="form">
          //     <div class="form-group">
          //       <label for="selected-text">Text selected</label>
          //       <textarea
          //         class="text form-control"
          //         id="selected-text"
          //         rows="5"
          //       ></textarea>
          //     </div>
          //     <button class="btn btn-info">Save</button>
          //   </form>
          // `
        }
      }
    });
  }
})

// const getInfo = document.querySelector('.getInfo');
// getInfo.onclick = () => {
//   console.log('from the sidebar');
//   chrome.storage.sync.get(['userData'], function(result) {
//     console.log('Value currently is ->', result);
//   });
// }

// toSubmit.innerHTML = `
//   <h4 class="text-center mb-2">Ethics Eth - Annotate the web</h4>
//   <form id="form">
//     <div class="form-group">
//       <label for="selected-text">Text selected</label>
//       <textarea
//         class="text form-control"
//         id="selected-text"
//         rows="5"
//       ></textarea>
//     </div>
//     <button class="btn btn-info">Save</button>
//   </form>
// `

// const btnTest = document.querySelector('.btn-test');
// btnTest.onclick = () => {
//   toSubmit.innerHTML = `
//     <div class="spinner-border" role="status">
//       <span class="sr-only">Loading...</span>
//     </div>
//   `
// }





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
