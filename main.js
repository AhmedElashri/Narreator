const { app, BrowserWindow, ipcMain, nativeImage, dialog } = require('electron')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')
const os = require('os')

//directories
const pth = path.join(os.homedir(), "./Documents/Narreator")
fs.promises.mkdir(pth).catch(console.error)
var story_pth = ""

const isMac = process.platform === 'darwin'
const isDev = process.env.NODE_ENV !== 'production'


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

ipcMain.on("create/story", (event, storyName) => {
  story_pth = path.join(pth, storyName)
  fs.promises.mkdir(story_pth).catch(console.error);
  fs.promises.mkdir(path.join(story_pth, "Characters")).catch(console.error)
  fs.promises.mkdir(path.join(story_pth, "Data")).catch(console.error)
  fs.promises.mkdir(path.join(story_pth, "Story")).catch(console.error)
  fs.writeFile(path.join(story_pth, "Data", "skills.json"), "{}", () => {})
})

ipcMain.on("get/story", (event) => {
  event.returnValue = fs.readdirSync(pth)
})

ipcMain.on("get/charImg", (event, imgName) => {
  let img = nativeImage.createFromPath(path.join(story_pth,"Data/images", imgName + ".png"))
  event.returnValue = img.toDataURL()
})

ipcMain.handle("get/char", (event, story) => {
  story_pth = path.join(pth, story)
  return fs.promises.readdir(path.join(story_pth, "Characters"))
})

ipcMain.on("create/charImg", (event, charName) => {
  dialog.showOpenDialog({
    title: "Load Character Image",
    properties: ['openFile'],
    filters: [
      { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'tiff', 'svg'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  }).then((result) => {
    if (!result.canceled) {
      let saveDir = path.join(story_pth, "Data/images", charName + ".png")

      const imagePath = result.filePaths[0];
      sharp(imagePath)
        .resize({height:128, width:128, fit: 'fill'})
        .png()
        .toFile(saveDir, (err, info) => {
          if (err) {
            console.error('Error processing the image:', err);
          } else {
            console.log('Image processed successfully. Output:', info);
          }
        });
    }
  })
  
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