// NOTCHBOX desktop: janela transparente, sem moldura, sempre no topo, centrada no topo do ecrã.
const { app, BrowserWindow, Tray, Menu, globalShortcut, ipcMain, screen, nativeImage, session, shell } = require('electron');
const path = require('path');
const fs = require('fs');
let win, tray;
const W = 900, H = 480;

if (!app.requestSingleInstanceLock()) app.quit();

function readConfig() {
  try { return JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8')); } catch (e) { return {}; }
}
function place() {
  if (!win) return;
  const b = screen.getPrimaryDisplay().bounds;
  win.setBounds({ x: Math.round(b.x + (b.width - W) / 2), y: b.y, width: W, height: H });
}
function createWindow() {
  win = new BrowserWindow({
    width: W, height: H, frame: false, transparent: true, backgroundColor: '#00000000',
    resizable: false, movable: false, hasShadow: false, alwaysOnTop: true, skipTaskbar: true,
    fullscreenable: false, show: false,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true,
      nodeIntegration: false, sandbox: true, backgroundThrottling: false }
  });
  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  place();
  win.setIgnoreMouseEvents(true, { forward: true }); // clica através da zona transparente
  const url = readConfig().url;
  win.webContents.on('did-fail-load', () => win.loadFile(path.join(__dirname, 'index.html')));
  if (url && /^https:\/\//.test(url)) win.loadURL(url); else win.loadFile(path.join(__dirname, 'index.html'));
  win.once('ready-to-show', () => win.show());
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
}
function toggleNotch() { if (!win) return; win.show(); win.focus(); win.webContents.send('toggle'); }

app.whenReady().then(() => {
  if (process.platform === 'darwin' && app.dock) app.dock.hide();
  session.defaultSession.setPermissionRequestHandler((wc, perm, cb) =>
    cb(['media', 'notifications', 'clipboard-sanitized-write'].includes(perm)));
  createWindow();
  screen.on('display-metrics-changed', place);
  screen.on('display-added', place);
  screen.on('display-removed', place);
  const icon = nativeImage.createFromPath(path.join(__dirname, 'build', 'icon.png')).resize({ width: 18, height: 18 });
  tray = new Tray(icon);
  tray.setToolTip('NOTCHBOX');
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Abrir/fechar a barra', click: toggleNotch },
    { label: 'Iniciar com o sistema', type: 'checkbox', checked: app.getLoginItemSettings().openAtLogin,
      click: (i) => app.setLoginItemSettings({ openAtLogin: i.checked }) },
    { type: 'separator' },
    { label: 'Sair do NOTCHBOX', click: () => app.quit() }
  ]));
  globalShortcut.register('CommandOrControl+Alt+Space', toggleNotch);
});
ipcMain.on('ignore', (e, b) => { if (win) win.setIgnoreMouseEvents(b, { forward: true }); });
ipcMain.on('quit', () => app.quit());
app.on('second-instance', toggleNotch);
app.on('will-quit', () => globalShortcut.unregisterAll());
app.on('window-all-closed', () => {});
