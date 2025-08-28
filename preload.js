const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  sendEmail: (data) => ipcRenderer.invoke("send-email", data),
  openConfig: () => ipcRenderer.invoke("open-config"),
  closeApp: () => ipcRenderer.invoke("close-app"),
  saveConfig: (data) => ipcRenderer.invoke("save-config", data),
  getConfig: () => ipcRenderer.invoke("get-config"),
  getPCInfo: () => ipcRenderer.invoke("get-pcinfo")  // 🔹 nueva función
});
