const {
  app,
  BrowserWindow,
  webContents,
  Menu,
  ipcMain,
  nativeTheme,
  Notification,
  nativeImage,
  ipcRenderer,
  screen
} = require('electron');
const { autoUpdater } = require('electron-updater');
const url = require('url');
const path = require('path');
const ejse = require('ejs-electron');
const {
  v4: uuidv4
} = require('uuid');
const https = require('https');
const fs = require('fs');
const mkdirp = require("mkdirp");
const WindowStateManager = require('electron-window-state-manager');

var jsoncog = require(path.join(__dirname, 'package.json'));

const dateTime = require('node-datetime');

// RUTAS
var file_fecha_ruta = path.join(__dirname, 'ServerGitHub', 'data', 'fechaUpdate.text');
const userconfig = path.join(app.getPath('userData'), 'cogUser.json');
ejse.data('file_cog', userconfig);

// VARIABLES
let mainWindow
let loading
let installfiles

// FECHA
// FECHA
const dt = dateTime.create();

var days = dt.format('d');
var years = dt.format('Y');

var mes = dt.format('m');

if (mes == '01') {
  var vermes = 'Enero';
} else if (mes == '02') {
  var vermes = 'Febrero';
} else if (mes == '03') {
  var vermes = 'Marzo';
} else if (mes == '04') {
  var vermes = 'Abril';
} else if (mes == '05') {
  var vermes = 'Mayo';
} else if (mes == '06') {
  var vermes = 'Junio';
} else if (mes == '07') {
  var vermes = 'Julio';
} else if (mes == '08') {
  var vermes = 'Agosto';
} else if (mes == '09') {
  var vermes = 'Septiembre';
} else if (mes == '10') {
  var vermes = 'Octubre';
} else if (mes == '11') {
  var vermes = 'Noviembre';
} else if (mes == '12') {
  var vermes = 'Diciembre';
}
// $('#getfecha').val(fecha_spanish);
// $('#getid').val(uuidv4());
var fecha_spanish = days + '/' + vermes + '/' + years;

// FILE EXISTE
// CREAR FILES
fs.readFile(file_fecha_ruta, 'utf-8', (err, data) => {
  if (err) {
    fs.writeFileSync(file_fecha_ruta, '', 'utf-8');
  } else {}
});

fs.readFile(userconfig, 'utf-8', (err, data) => {
  if (err) {
    const defaultUs = {
      enlaces: {
        tiempoUpdate: '0',
        update: 'https://lokuedo5000.github.io/filesDtoLKD/update.zip',
        fechaUpdate: ''
      },
      user: 'no',
      updateApld: ''
    }
    fs.writeFileSync(userconfig, JSON.stringify(defaultUs, null, 2), 'utf-8');
  } else {}
});
// GET DATA COG
var datacog = require(userconfig);
ejse.data('link_update', datacog.enlaces.update);
ejse.data('timeUpdate', datacog.enlaces.tiempoUpdate);

// READY
app.on('ready', () => {
  loading = new BrowserWindow({
    icon: path.join(__dirname, 'assets/icons/win/icv02.ico'),
    width: 300,
    height: 300,
    'minHeight': 300,
    'minWidth': 300,
    titleBarStyle: 'customButtonsOnHover',
    transparent: true,
    maximizable: false,
    resizable: false,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preloader/loading.js'),
      nodeIntegration: true
      // contextIsolation: false
    }
  });

  // CARGAR ARCHIVO LOCAL
  loading.loadURL(url.format({
    pathname: path.join(__dirname, 'ServerGitHub/page/loading/index.ejs'),
    protocol: 'file',
    slashes: true
  }))

  loading.on('close', () => {
    /*app.quit();*/
  })


})


function winall() {
  //DEFAULT TAMAÑO VENTANA MAINWINDOW
  const mainWindowState = new WindowStateManager('mainWindow', {
    defaultWidth: 500,
    defaultHeight: 500
  });
  mainWindow = new BrowserWindow({
    icon: path.join(__dirname, 'assets/icons/win/icv02.ico'),
    width: mainWindowState.width,
    height: mainWindowState.height,
    'minHeight': 500,
    'minWidth': 500,
    x: mainWindowState.x,
    y: mainWindowState.y,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
      // nodeIntegration: true
      // contextIsolation: false
    }
  });


  //AGREGAR MENU A MAINWINDOW
  const menuMainWindow = Menu.buildFromTemplate(templateMenu);
  mainWindow.setMenu(menuMainWindow);
  mainWindow.setMenuBarVisibility(false);

  // SI LA APLICACION SE CERRO EN MAXIMIZE
  if (mainWindowState.maximized) {
    mainWindow.maximize();
  }

  // CARGAR ARCHIVO LOCAL
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'aplication/index.ejs'),
    protocol: 'file',
    slashes: true
  }))

  mainWindow.on('close', () => {
    mainWindowState.saveState(mainWindow);
    app.quit();
  })

  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
}

function installfilesApp() {
  const displays = screen.getAllDisplays()
  var pos_w = displays[0].workArea.width;
  var pos_h = displays[0].workArea.height;
  installfiles = new BrowserWindow({
    icon: path.join(__dirname, 'assets/icons/win/icv02.ico'),
    width: 300,
    height: 200,
    'minHeight': 200,
    'minWidth': 300,
    x: pos_w-300,
    y: pos_h-200,
    titleBarStyle: 'customButtonsOnHover',
    transparent: true,
    maximizable: false,
    resizable: false,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preloader/install.js'),
      // nodeIntegration: true
      // contextIsolation: false
    }
  });

  // AGREGAR MENU A MAINWINDOW
  const menuMainWindow = Menu.buildFromTemplate(templateMenu);
  installfiles.setMenu(menuMainWindow);
  installfiles.setMenuBarVisibility(false);

  // CARGAR ARCHIVO LOCAL
  installfiles.loadURL(url.format({
    pathname: path.join(__dirname, 'ServerGitHub/page/install/ins.ejs'),
    protocol: 'file',
    slashes: true
  }))

  installfiles.on('close', () => {
    /*app.quit();*/
  })
}

// SET UPDATE
ipcMain.on('app--update', (e, data) => {
  var verificar_date = require(userconfig);
  if (data == 'true') {
    if (verificar_date.updateApld == fecha_spanish) {

    }else{
      verificar_date.updateApld = fecha_spanish;
      fs.writeFileSync(userconfig, JSON.stringify(verificar_date, null, 2), 'utf-8');
      installfilesApp();
    }
  }else if (data == 'close') {
    installfiles.close();
  }
})

// CLICK DOWNLOAD
function downloadfiles(enlace, tipo) {
  var file = fs.createWriteStream(path.join(__dirname, 'ServerGitHub', 'download', 'update.zip'));
  var len = 0;

  https.get(enlace, function(res) {
    res.on('data', function(chunk) {
      file.write(chunk);
      len += chunk.length;

      // percentage downloaded is as follows
      var percent = (len / res.headers['content-length']) * 100;
      if (tipo == 'loading') {
        loading.webContents.send('app--progrees', percent);
      } else if (tipo == 'app') {
        mainWindow.webContents.send('app--progrees', percent);
      }

    });
    res.on('end', function() {
      file.close();
    });
    file.on('close', function() {
      // the file is done downloading
      // exec('update_setup.exe');
      // loading.webContents.send('app--fin', 'close');
      if (tipo == 'loading') {
        loading.webContents.send('app--fin', 'close');
      } else if (tipo == 'app') {

      }
    });
  });
}

// CLICK DOWNLOAD
ipcMain.on('app--download', (e, data) => {
  var usercog = require(userconfig);
  var datosUp = ['1/7', '2/7', '1/30', '2/30', '1', '0', '1/All'];
  var tiempoDownload = usercog.enlaces.tiempoUpdate;
  var getDateSave = usercog.enlaces.fechaUpdate;
  var existeTime = datosUp.includes(tiempoDownload);

  if (existeTime == true) {
    // Here we run the update function
    if (tiempoDownload == '0') {
      winall();
      loading.close();
    } else if (tiempoDownload == '1') {
      // Verificar la Fecha
      if (fecha_spanish == getDateSave) {
        winall();
        loading.close();
      } else {
        usercog.enlaces.fechaUpdate = fecha_spanish;
        fs.writeFileSync(userconfig, JSON.stringify(usercog, null, 2), 'utf-8');
        downloadfiles(usercog.enlaces.update, data.tipo);
      }
      // End
    }
  } else {

  }
})
// END
// FIN DOWNLOAD
ipcMain.on('app--open-web', (e, data) => {
  if (data.run == 'loading') {
    winall();
    loading.close();
  }
})
// ipcMain.on('app--download', (e, data) => {
//   // FECHA
//   var moment = require('moment');
//   var date = moment();
//
//   // ARRAYS
//   var datosUp = ['1/7', '2/7', '1/30', '2/30', '1', '0', '1/All'];
//
//   var tiempoDownload = jsoncog.enlaces.tiempoUpdate;
//
//   var existeTime = datosUp.includes(tiempoDownload);
//   //ACTIVE DE DOWNLOAD
//   if (existeTime == true) {
//     // LOAD FECHAS
//     var carga_date = fs.readFileSync(file_fecha_ruta, 'utf-8');
//     var cargar_fecha = carga_date.replace(/\s+/g, '');
//     var day = date.day();
//     // FUNCTION
//     if (tiempoDownload == '1/7') {
//       var dwnAct = '';
//       if (day == '7') {
//         var dwnAct = true;
//       }
//       if (dwnAct == true) {
//         if (fecha_spanish == cargar_fecha) {
//           winall();
//           loading.close();
//         } else {
//           fs.writeFileSync(file_fecha_ruta, fecha_spanish, 'utf-8');
//           downloadfiles(jsoncog.enlaces.update);
//         }
//
//       } else {
//         winall();
//         loading.close();
//       }
//     } else if (tiempoDownload == '2/7') {
//       var dwnAct = '';
//       if (day == '4') {
//         var dwnAct = true;
//       }
//       if (dwnAct == true) {
//         if (fecha_spanish == cargar_fecha) {
//           winall();
//           loading.close();
//         } else {
//           fs.writeFileSync(file_fecha_ruta, fecha_spanish, 'utf-8');
//           downloadfiles(jsoncog.enlaces.update);
//         }
//
//       } else {
//         winall();
//         loading.close();
//       }
//     } else if (tiempoDownload == '1/30') {
//       const dt = dateTime.create();
//       var days = dt.format('d');
//       if (days == '01') {
//         if (fecha_spanish == cargar_fecha) {
//           winall();
//           loading.close();
//         } else {
//           fs.writeFileSync(file_fecha_ruta, fecha_spanish, 'utf-8');
//           downloadfiles(jsoncog.enlaces.update);
//         }
//       } else {
//         winall();
//         loading.close();
//       }
//     } else if (tiempoDownload == '2/30') {
//       const dt = dateTime.create();
//       var days = dt.format('d');
//       if (days == '15') {
//         if (fecha_spanish == cargar_fecha) {
//           winall();
//           loading.close();
//         } else {
//           fs.writeFileSync(file_fecha_ruta, fecha_spanish, 'utf-8');
//           downloadfiles(jsoncog.enlaces.update);
//         }
//       } else {
//         winall();
//         loading.close();
//       }
//     } else if (tiempoDownload == '1') {
//       if (fecha_spanish == cargar_fecha) {
//         winall();
//         loading.close();
//       }else {
//         fs.writeFileSync(file_fecha_ruta, fecha_spanish, 'utf-8');
//         downloadfiles(jsoncog.enlaces.update);
//       }
//     } else if (tiempoDownload == '0') {
//       winall();
//       loading.close();
//     } else if (tiempoDownload == '1/All') {
//       downloadfiles(jsoncog.enlaces.update);
//     }
//     // END
//
//
//   }
//
// })
//
// // FIN DE DESCARGA
// ipcMain.on('app--open-web', (e, data) => {
//   if (data.run == 'app') {
//
//     // EXTRAER ARCHIVOS
//     var file_descargada = path.join(__dirname, 'ServerGitHub', 'download', 'update.zip');
//     var folder_installl = path.join(__dirname, '/');
//     var extract = require('extract-zip');
//     var update_file = path.resolve(file_descargada);
//     var install_update = path.resolve(folder_installl);
//
//     extract(update_file, {
//       dir: install_update
//     }, function(err) {
//       if (err) {
//         console.log(err);
//       } else {
//         winall();
//         loading.close();
//       }
//     })
//
//   }
// })
//QUITAR MENU
Menu.setApplicationMenu(null);
// function lk() {
//   console.log('lokuedo5000');
// }
//
// app.setUserTasks([
//   {
//     program: process.execPath,
//     arguments: lk(),
//     iconPath: path.join(__dirname, 'assets/icons/win/web2.ico'),
//     iconIndex: 0,
//     title: 'lokuedo5000',
//     description: 'Create a new window'
//   }
// ]);
ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});
autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});
// Menu Template
var templateMenu = [{
  label: 'CoffeeWeb',
  submenu: [{
      label: 'Admin',
      accelerator: process.platform == 'darwin' ? 'command+Alt+A' : 'Ctrl+Alt+A',
      click() {
        // let db = new sqlite3.Database(path.join(__dirname, 'web/chinook.db'), (err) => {
        //   if (err) {
        //     console.error(err.message);
        //   }
        //   console.log('Connected to the chinook database.');
        // });
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Ayuda',
      click() {

      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Exit',
      accelerator: process.platform == 'darwin' ? 'command+Q' : 'Ctrl+Q',
      click() {
        app.quit();
      }
    }
  ]
}];

// Reload in Development for Browser Windows
var DevTools = process.env.APP_DEV ? (process.env.APP_DEV.trim() == "true") : true;

if (DevTools) {
  templateMenu.push({
    label: 'DevTools',
    submenu: [{
        label: 'Show/Hide Dev Tools',
        accelerator: process.platform == 'darwin' ? 'Comand+D' : 'Ctrl+D',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  })
};
