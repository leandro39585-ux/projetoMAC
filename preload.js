const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('nb', {
  desktop: true,
  setIgnore: (b) => ipcRenderer.send('ignore', !!b),
  onToggle: (cb) => ipcRenderer.on('toggle', () => cb()),
  quit: () => ipcRenderer.send('quit')
});
