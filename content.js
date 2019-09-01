const authURL = 'http://extension.lupuselit.me/#/';

window.onload = () => {
  // const elementToInsert = document.createElement('div');
  //
  // elementToInsert.innerHTML = `
  //   <div id="capture" style="padding: 10px; background: #f5da55">
  //     <h4 style="color: #000; ">Hello world!</h4>
  //   </div>
  // `
  //
  // document.body.appendChild(elementToInsert)

  // //
  // injects the toolbar
  const toolbarWrapper = document.createElement('div');
  const toolbar = document.createElement('div');

  toolbar.innerHTML = `
    <div id="cal1">&nbsp;</div>
    <div id="cal2">&nbsp;</div>
    <button id="tooltip" class="lp-btn">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M64 368v80h80l235.727-235.729-79.999-79.998L64 368zm377.602-217.602c8.531-8.531 8.531-21.334 0-29.865l-50.135-50.135c-8.531-8.531-21.334-8.531-29.865 0l-39.468 39.469 79.999 79.998 39.469-39.467z"/>
      </svg>
    </button>
  `;

  toolbarWrapper.appendChild(toolbar);
  document.body.appendChild(toolbarWrapper);

  // //
  // shows the tooltip on text select
  var ele = document.getElementById('tooltip');
  var sel = window.getSelection();
  var rel1 = document.createRange();
  rel1.selectNode(document.getElementById('cal1'));
  var rel2 = document.createRange();
  rel2.selectNode(document.getElementById('cal2'));
  window.addEventListener('mouseup', function() {
    if (!sel.isCollapsed) {
      // debugger;
      var r = sel.getRangeAt(0).getBoundingClientRect();
      var rb1 = rel1.getBoundingClientRect();
      var rb2 = rel2.getBoundingClientRect();

      ele.style.top = ((r.bottom - rb2.top) * 100) / (rb1.top - rb2.top) + 'px'; //this will place ele below the selection
      ele.style.left =
        ((r.left - rb2.left) * 100) / (rb1.left - rb2.left) + 'px'; //this will align the right edges together

      //code to set content
      ele.style.display = 'block';
    }
  });

  window.addEventListener('mousedown', function() {
    console.log('down');
    // this is to allow the button to be clicked
    setTimeout(() => {
      ele.style.display = 'none';
    }, 500);

    const sidebar = document.querySelector('#ethics-net-extension-root');

    if (sidebar.style.display === 'block') {
      sidebar.classList += ' fade-left';
      setTimeout(() => {
        sidebar.style.display = 'none';
        sidebar.removeAttribute('class');

        chrome.runtime.sendMessage(
          { to: 'new-text', content: 'void' },
          response => {
            console.log('response from innerHTML -> ', response);
          }
        );
      }, 400);
    }
  });

  // //
  // injecting the sidebar
  const div = document.createElement('div');
  const styles = document.createElement('style');
  div.setAttribute('id', 'ethics-net-extension-root');
  styles.innerHTML = `
    @keyframes slidein-left {
      0% {
        transform: translateX(500px);
      }
      100% {
        transform: translateX(0);
      }
    }

    @keyframes slideout-right {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(500px);
      }
    }

    .come-right {
      animation: slidein-left .5s;
    }

    .fade-left {
      animation: slideout-right .5s;
    }

    #ethics-net-extension-root {
      display: none;
      width: 400px;
      height: 100%;
      position: fixed;
      top: 0px;
      right: 0px;
      z-index: 2147483647;
      background-color: white;
      box-shadow: 0px 0px 15px #0000009e;
    }

    #ethics-net-extension-root iframe {
      width: 100%;
      height: 100%;
      border: none;
    }

    #tooltip {
      position:absolute;
      display:none;
      background-color: yellow;
      padding: 2px;
      border-radius: 5px;
      border: 2px solid #aaa;
    }

    #tooltip svg {
      height: 30px;
      width: 30px;
    }

    #cal1{
      position:absolute;
      height:0px;
      width:0px;
      top:100px;
      left:100px;
      overflow:none;
      z-index:-100;
    }

    #cal2{
      position:absolute;
      height:0px;
      width:0px;
      top:0px;
      left:0px;
      overflow:none;
      z-index:-100;
    }
  `;
  const iframe = document.createElement('iframe');
  iframe.setAttribute('src', chrome.runtime.getURL('sidebar/sidebar.html'));
  div.appendChild(iframe);
  document.body.appendChild(styles);
  document.body.appendChild(div);

  const tooltip = document.querySelector('#tooltip');

  tooltip.onclick = () => {
    const sidebar = document.querySelector('#ethics-net-extension-root');

    sidebar.classList += ' come-right';

    setTimeout(() => {
      sidebar.style.display = 'block';
    }, 20);

    const data = {
      to: 'sidebar',
      content: window.getSelection().toString(),
      font: window.location.href,
    };

    chrome.runtime.sendMessage(data, function(response) {
      console.log(response);
    });
  };

  // LOGIN RELATED!!!
  // if the users go to the /profile route on the app
  // it will set the storage
  console.log('LOGIN RELATED!');
  console.log(document.URL);
  console.log(authURL);

  // this wont work!
  // if (document.URL.includes('http://extension.lupuselit.me') || document.URL.includes('http://localhost:3000')) {}

  if (
    document.URL === authURL ||
    document.URL === 'http://localhost:3000/#/' ||
    document.URL === 'http://extension.lupuselit.me' ||
    document.URL === 'http://extension.lupuselit.me/'
  ) {
    console.log('SAVED USER INFO ON CHROME EXTENSION');

    // can be any other thing that you have used to authenticate the user
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const isLogged = localStorage.getItem('isLogged');
    const userName = localStorage.getItem('userName');

    console.log('local storage -> \n', userId, '\n', token, '\n', isLogged);

    const userData = {
      userName,
      userId,
      token,
    };

    console.log('user data from content -> ', userData);

    chrome.storage.sync.set({ userData }, function() {
      console.log('Value is set to ', userData);
    });
  }

  if (document.URL === 'http://localhost:3000/login') {
    chrome.storage.sync.get(['userData'], function(result) {
      console.log('Value currently is ->', result);
    });
  }

  chrome.storage.sync.get(['userData'], function(result) {
    console.log('user currently is ->', result);
  });

  // this works only on reload because it doesnt
  // detect the url changes
  if (
    document.URL === 'http://localhost:3000/#/logged-out' ||
    document.URL === 'http://extension.lupuselit.me/#/logged-out'
  ) {
    console.log('log out from the content!');
    chrome.storage.sync.remove('userData', function() {
      console.log('you are logged out!!');
    });
  }

  // END OF WINDOW.ONLOAD
};

function convertCanvasToImage(canvas) {
  var image = new Image();
  image.src = canvas.toDataURL('image/png');
  return image;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('request for the button click!', request.to);
  if (request.to === 'select-area') {
    sendResponse('got it from the background!');
    // write your code here...
    document.body.style.cursor = 'crosshair';


    // Canvas -- >
    html2canvas(
      document.querySelector('body'),
      {
        useCORS: true,
        allowTaint: true,
        taintTest: false,
        pagesplit: false,
        optimized: false
      })
      .then(canvas => {
      console.log('canvas -> ', canvas);
      // you may save this as an image to your backend
      const img = convertCanvasToImage(canvas);

      // console.log('img ->', img);
      // console.log('img src ->', img.src);

      chrome.runtime.sendMessage(
        { to: 'cache-image', content: img.src },
        function(response) {
          console.log(response);
        }
      );

      // document.body.appendChild(img);
      // document.body.appendChild(canvas);
    });
    // END OF CANVAS <--
    
  }
});

// Reset the cursor to its default state
window.onmouseup = () => {
  console.log('mouse up');
  document.body.style.cursor = 'default';
};

// window.onmousemove = () => {
//   // console.log('moving');
//   // var x = event.clientX;     // Get the horizontal coordinate
//   // var y = event.clientY;     // Get the vertical coordinate
//   // var coor = "X coords: " + x + ", Y coords: " + y;
//   // console.log(coor);
// }
//
// window.onload = () => {
//   const btn = document.querySelector('.screenshot');
//
//   btn.onclick = () => {
//     setTimeout(() => {
//       let canvas = document.querySelector('.ethics-net-canvas');
//       let context = canvas.getContext("2d");
//       let height = canvas.height = window.innerHeight;
//       let width = canvas.width = window.innerWidth;
//
//       let mouseClicked = false, mouseReleased = true;
//
//       document.addEventListener('click', onMouseClick, false);
//       document.addEventListener('mousemove', onMouseMove, false);
//
//       function onMouseClick(e) {
//         mouseClicked = !mouseClicked;
//       }
//
//       function onMouseMove(e) {
//         if (mouseClicked) {
//           context.beginPath();
//           context.arc(e.clientX, e.clientY, 2, 1, Math.PI * 2, true);
//           context.lineWidth = 5;
//           context.strokeStyle = '#000';
//           context.stroke();
//         }
//       }
//     }, 2000)
//   }
// }

//
