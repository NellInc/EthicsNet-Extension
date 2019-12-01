// desistir é uma delicia
const toSubmit = document.querySelector('.to-submit');
let font = '';

// const apiURL = 'http://localhost:3000'
// const apiURL = 'http://167.71.163.123';
const apiURL = 'http://extension.lupuselit.me/#';

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('getting message from api call ->', request);
  if (request.to === 'new-text') {
    window.location.reload();
    sendResponse({ message: 'ok' });
  }
});

chrome.storage.sync.get(['userData'], function(result) {
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
    `;
  } else {
    chrome.runtime.onMessage.addListener(function(
      request,
      sender,
      sendResponse
    ) {
      if (request.to === 'sidebar') {
        sendResponse({ message: 'changed the sidebar!' });
        const text = document.querySelector('.text');
        text.innerHTML = request.content;
        text.classList += ' appear';
        font = request.font;
      }
    });

    const form = document.getElementById('form');
    form.onsubmit = e => {
      e.preventDefault();
      const selectedText = document.querySelector('.text');
      const options = {
        0: 'morally preferable',
        1: 'morally unpreferable',
        2: 'aesthetically preferable',
        3: 'aesthetically unpreferable',
        4: 'not unethical, but strange',
      };

      const category = document.querySelector('#category');
      const categoryRangeContentAction = document.querySelector('.content-action').value;
      const categoryRangeToneForm = document.querySelector('.tone-form').value

      if (selectedText.value) {
        console.log(selectedText.value);
        const { value } = selectedText;
        const data = {
          to: 'background',
          content: value,
          categoryRangeContentAction,
          categoryRangeToneForm,
          font: font,
        };
        toSubmit.innerHTML = `
          <div class="loader-wrapper">
            <div class="spinner-border" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        `;
        chrome.runtime.sendMessage(data, response => {
          console.log(response);
        });
      }
    };

    chrome.runtime.onMessage.addListener(function(
      request,
      sender,
      sendResponse
    ) {
      if (request.to === 'sidebar-submit') {
        sendResponse({ message: 'we got the message!!' });
        if (request.content.error) {
          toSubmit.innerHTML = `
          <div class="">
            <p>there was an error</p>
            <p>please log out and log in again ...</p>
             <a
              class="btn btn-primary"
              href="http://extension.lupuselit.me/#/logged-out"
              target="_blank"
            >
              LOGOUT
            </a>
          </div>
        `;
        } else {
          toSubmit.innerHTML = `
            <div class="">
              <p>Anotation saved</p>
              <p class="text-saved">${request.content.textCreated.content}</p>
              <button class="btn btn-primary"><a style="color: #fff;" href="${apiURL}/profile/anotations" target="_blank">see all</a></button>
              <button class="btn btn-secondary new-anotation">new anotation</button>
            </div>
          `;
          let newAnotation = document.querySelector('.new-anotation');
          newAnotation.onclick = () => {
            console.log('reloading...');
            window.location.reload();
          };
        }
      }
    });
  }
});
