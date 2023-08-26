const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

//directories
const pth = path.join(os.homedir(), "./Documents/Narreator")
fs.promises.mkdir(pth).catch(console.error);
var story_pth = ""

const isMac = process.platform === 'darwin';
const isDev = process.env.NODE_ENV !== 'production';


function characterWindow () {
  const win = new BrowserWindow({
    title: "Narreator",
    width: isDev ? 1360 : 960,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, './renderer/charactermaker/js/index_preload.js')
    }
  });

  //open devtools in dev environment
  if (isDev) {
    win.webContents.openDevTools();
  }

  win.loadFile(path.join(__dirname, './renderer/charactermaker/index.html'));
}

ipcMain.on("create/story", (event, args) => {
  story_pth = path.join(pth, args)
  fs.promises.mkdir(story_pth).catch(console.error);
  fs.promises.mkdir(path.join(story_pth, "Characters")).catch(console.error)
  fs.promises.mkdir(path.join(story_pth, "Data")).catch(console.error)
  fs.promises.mkdir(path.join(story_pth, "Story")).catch(console.error)
  fs.writeFile(path.join(story_pth, "Data", "skills.json"), "{}", () => {})
})

ipcMain.on("get/story", (event) => {
  event.returnValue = fs.readdirSync(pth)
})

ipcMain.handle("get/char", (event, args) => {
  story_pth = path.join(pth, args)
  return fs.promises.readdir(path.join(story_pth, "Characters"))
})

app.whenReady().then(() => {
  characterWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      characterWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit();
  }
});