// Runs in an isolated context with access to Node APIs, bridged safely into
// the renderer via contextBridge. Add IPC-exposed APIs here as needed —
// never disable contextIsolation to take a shortcut around this file.
const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  platform: process.platform,
});
