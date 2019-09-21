console.log('I rannnn ... im popup :DD');

chrome.storage.sync.get(['userData'], function(result) {
  console.log('userdata ->', result.userData);

  if (result.userData) {
    const notLogged = document.querySelector('.not-logged');
    notLogged.style.display = 'none';
    const userInfo = document.querySelector('.user-info');
    userInfo.style.display = 'block';

    let { userName } = result.userData;
    userName = userName.charAt(0).toUpperCase() + userName.slice(1);

    const welcome = document.querySelector('.welcome');
    welcome.innerHTML = `Welcome to EthicsNet ${userName}`;
  } else {
  }

  console.log('Value currently is ->', result);
});

const logout = document.querySelector('.logout');

function addMask(input) {
  input.onkeyup = () => {
    input.value = input.value.replace(/(\d{2})(\d{2})/, '$1:$2');
  };
}

addMask(document.querySelector('#videoStart'));
addMask(document.querySelector('#videoEnd'));

chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
  url = tabs[0].url;
  console.log('URL ->', url);

  document.querySelector('#videoUrl').value = url;
});

function handleSubmit(e) {
  const videoUrl = document.querySelector('#videoUrl').value;

  const videoStart = document.querySelector('#videoStart').value;
  const videoEnd = document.querySelector('#videoEnd').value;

  console.log('Info -> ', videoUrl, videoStart, videoEnd);

  if (videoUrl === '' || videoStart === '' || videoEnd === '') {
    alert('fill all the fields before submitting!')
    return;
  }

  const data = {
    to: 'video-annotation',
    videoUrl,
    videoStart,
    videoEnd,
  }

  chrome.runtime.sendMessage(data, function(response) {
    console.log(response);
  });

  // send a message to the background with the data to be saved
}

// Assign an ID to the link (<a onClick=hellYeah("xxx")> becomes <a id="link">), and use addEventListener to bind the event. Put the following in your popup.js file:

document.addEventListener('DOMContentLoaded', function() {
  var link = document.getElementById('submit-video');
  // onClick's logic below:
  link.addEventListener('click', function() {
    handleSubmit('xxx');
  });
});
