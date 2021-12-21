// main.js

// Modules to control application life and create native browser window
//const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const {app, BrowserWindow, Menu, ipcMain, globalShortcut} = require('electron')

const path = require('path')
const Music = require('./music.js')

function isWindows() { return process.platform == 'win32' }
function isMac() { return process.platform == 'darwin' }

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    useContentSize: true,
    //show: true,
    frame: false,
    x: 0,
    y: 0,
    autoHideMenuBar: true,
    //'always-on-top': false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.setResizable(true)

  if ( isMac() ) mainWindow.setFullScreen(true)

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  return mainWindow
}

const music = new Music()

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  const win = createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  globalShortcut.register('Ctrl+Q', function() {
    const windowState = win.getBounds()
    console.log(windowState)

    if ( isWindows() ) app.quit()
  })

  globalShortcut.register('Ctrl+B', function() {
    // 2x 1920x1080 
    win.setSize(3840, 1080)
  })

  globalShortcut.register('Ctrl+H', function() {
    // 1x 1920x1080 
    win.setSize(1920, 1080)
  })
})

app.on('before-quit', function (e) {
  //if ( ! isMac() ) app.quit()
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if ( ! isMac() ) app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
