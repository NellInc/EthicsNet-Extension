console.log('homepage!');

const apiURL = 'http://localhost';
const newApi = 'http://localhost/api2';
const frontend = 'http://localhost:3000/#/';

// const apiURL = 'http://167.71.163.123';
// const newApi = 'http://167.71.163.123/api2';
// const frontend = 'http://extension.lupuselit.me/#/'

// fetch('http://localhost/')

chrome.storage.sync.get(['userData'], function(result) {
  console.log('Value currently is ->', result);
  localStorage.token = result.userData.token;
});

if (true) {
  async function getUserData() {
    console.log('get user data function');

    try {
      const response = await fetch(`${newApi}/user/`, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.token}`,
        },
        redirect: 'follow',
        referrer: 'no-referrer',
      })

      const data = await response.json();

      const { firstName } = data.user;

      localStorage.firstName = firstName;

      document.querySelector('.name').innerHTML = firstName;

      console.log('data -> ', data);
    } catch (e) {
      console.log('error -> ', e);
    } finally {

    }
  }

  getUserData();
} else {
  document.querySelector('.name').innerHTML = localStorage.firstName;
}





























//
