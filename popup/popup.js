console.log('I rannnn ... im popup :DD');

chrome.storage.sync.get(['userData'], function(result) {

  if (result.userData.userId) {

    const notLogged = document.querySelector('.not-logged');
    notLogged.style.display = 'none';
    const userInfo = document.querySelector('.user-info');
    userInfo.style.display = 'block';


    let { userName } = result.userData;
    userName = userName.charAt(0).toUpperCase() + userName.slice(1);

    const welcome = document.querySelector('.welcome');
    welcome.innerHTML = `Welcome to EthicsNet ${userName}`

  } else {}

  console.log('Value currently is ->', result);

});

const logout = document.querySelector('.logout');

logout.onclick = () => {
  chrome.storage.sync.remove('userData', function(){
    // alert('Item deleted!');
    logout.innerHTML = '<a href="http://localhost:3000/login" target="_blank" style="color: #fff;">login</a>';
    // logout.setAttribute('href', 'http://localhost:3000/login')
    // logout.setAttribute('target', '_blank')
    // localtion.reload()
});
}
