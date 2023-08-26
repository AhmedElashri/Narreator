const { contextBridge, ipcRenderer } = require('electron');

const API = {
    newStory: (name) => ipcRenderer.send("create/story", name),
    getStoryList: () => ipcRenderer.sendSync("get/story"),
    getCharList: (story) => ipcRenderer.invoke("get/char", story)
}

contextBridge.exposeInMainWorld('api', API);