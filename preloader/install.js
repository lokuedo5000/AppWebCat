const {
  app,
  ipcRenderer
} = require('electron');
const url = require('url');
const path = require('path');
window.addEventListener('DOMContentLoaded', () => {

  window.addEventListener('load', calculos, false);

  function calculos() {
    var settime = setInterval(function(){
      clearInterval(settime);
      findownload();
    }, 4000);
  }

  function findownload() {
    // EXTRAER ARCHIVOS
    var file_descargada = path.join(__dirname, '../ServerGitHub', 'download', 'update.zip');
    var folder_installl = path.join(__dirname, '../');
    var extract = require('extract-zip');
    var update_file = path.resolve(file_descargada);
    var install_update = path.resolve(folder_installl);

    extract(update_file, {
      dir: install_update
    }, function(err) {
      if (err) {
        console.log(err);
      } else {
        ipcRenderer.send('app--update', 'close');
      }
    })
  }
})
