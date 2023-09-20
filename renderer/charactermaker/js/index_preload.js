const { contextBridge, ipcRenderer } = require('electron');

const API = {
    newStory: (name) => ipcRenderer.send("create/story", name),
    getStoryList: () => ipcRenderer.sendSync("get/story"),
    getCharList: (story) => ipcRenderer.invoke("get/char", story),
    getImg: (name) => ipcRenderer.sendSync("get/charImg", name),
    createImg: (name) => ipcRenderer.send("create/charImg", name)
}

contextBridge.exposeInMainWorld('api', API);