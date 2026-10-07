'use strict';
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('desktop', {
  init: () => ipcRenderer.invoke('shell:init'),
  save: value => ipcRenderer.invoke('shell:save', value),
  action: value => ipcRenderer.invoke('shell:action', value),
  studio: value => ipcRenderer.invoke('shell:studio', value),
  player: value => ipcRenderer.invoke('shell:player', value),
  profile: value => ipcRenderer.invoke('shell:profile', value),
  settings: open => ipcRenderer.invoke('shell:settings', open === true),
  cache: action => ipcRenderer.invoke('shell:cache', action),
  onState: callback => { const listener = (_, value) => callback(value); ipcRenderer.on('desktop:state', listener); return () => ipcRenderer.removeListener('desktop:state', listener); },
  onPanel: callback => { const listener = (_, value) => callback(value); ipcRenderer.on('desktop:panel', listener); return () => ipcRenderer.removeListener('desktop:panel', listener); }
});
