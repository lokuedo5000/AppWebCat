var {
  app,
  shell,
  BrowserWindow,
  ipcRenderer
} = require('electron');
const https = require('https');
const fs = require('fs');
const path = require('path');
const jsoncog = require(path.join(__dirname, '../package.json'));

window.addEventListener('DOMContentLoaded', () => {

  // GET VERSION
  document.querySelector('.version_app').innerHTML = 'v' + jsoncog.version;
  document.querySelector('.vcode').innerHTML = 'v' + jsoncog.vCode;


  const webapp = document.querySelector(".click_down");
  // Agregar listener
  webapp.addEventListener("click", function(evento) {
    var tipos = {
      tipo: 'loading'
    }
    ipcRenderer.send('app--download', tipos);
  });

  ipcRenderer.on('app--progrees', (e, data) => {
    document.querySelector('.progrees_bar').style.width = data + '%';
  })

  ipcRenderer.on('app--fin', (e, data) => {
    var tipos = {
      run: 'loading'
    }
    ipcRenderer.send('app--open-web', tipos);
  })



})
