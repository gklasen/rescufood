"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var remoteMain = require("@electron/remote/main");
remoteMain.initialize();
//handle setupevents as quickly as possible
var setupEvents = require('./installers/setupEvents');
if (setupEvents.handleSquirrelEvent()) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    // @ts-ignore
    return;
}
var win = null;
var args = process.argv.slice(1), serve = args.some(function (val) { return val === '--serve'; });
function createWindow() {
    var electronScreen = electron_1.screen;
    var size = electronScreen.getPrimaryDisplay().workAreaSize;
    // Create the browser window.
    win = new electron_1.BrowserWindow({
        x: 0,
        y: 0,
        width: size.width,
        height: size.height,
        icon: __dirname + '\\src\\assets\\img\\brand\\rescufood-logo.png',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            allowRunningInsecureContent: false,
            webSecurity: false,
            spellcheck: false
        }
    });
    if (serve) {
        require('devtron').install();
        require('electron-reload')(__dirname, {
            electron: require("".concat(__dirname, "/node_modules/electron"))
        });
        win.loadURL('http://localhost:4200');
    }
    else {
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'dist/index.html'),
            protocol: 'file:',
            slashes: true
        }));
    }
    electron_1.globalShortcut.register('CommandOrControl+Shift+Alt+O', function () {
        win.webContents.openDevTools();
    });
    remoteMain.enable(win.webContents);
    if (process.platform === "win32") {
        electron_1.app.setAppUserModelId("Rescufood");
        electron_1.app.setLoginItemSettings({
            openAtLogin: true
        });
    }
    // Emitted when the window is closed.
    win.on('closed', function () {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
    return win;
}
try {
    electron_1.app.commandLine.appendSwitch('ignore-certificate-errors');
    electron_1.app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');
    electron_1.app.commandLine.appendSwitch('allow-insecure-localhost', 'true');
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
    electron_1.app.on('ready', function () { return setTimeout(createWindow, 400); });
    // Quit when all windows are closed.
    electron_1.app.on('window-all-closed', function () {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
        }
    });
    electron_1.app.on('activate', function () {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (win === null) {
            createWindow();
        }
    });
}
catch (e) {
    // Catch Error
    // throw e;
}
