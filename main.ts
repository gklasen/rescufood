import { app, BrowserWindow, screen, globalShortcut } from 'electron';
import * as path from 'path';
import * as url from 'url'; 

import * as remoteMain from '@electron/remote/main'; 
remoteMain.initialize();

//handle setupevents as quickly as possible

const setupEvents = require('./installers/setupEvents')
if (setupEvents.handleSquirrelEvent()) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
	// @ts-ignore
    return;
}

let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');
  
function createWindow(): BrowserWindow {

	const electronScreen = screen;
	const size = electronScreen.getPrimaryDisplay().workAreaSize;

	// Create the browser window.
	win = new BrowserWindow({
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
		},
	});

	if (serve) {

		require('devtron').install(); 

		require('electron-reload')(__dirname, {
			electron: require(`${__dirname}/node_modules/electron`)
		});
		win.loadURL('http://localhost:4200');

	} else { 
		win.loadURL(url.format({
			pathname: path.join(__dirname, 'dist/index.html'),
			protocol: 'file:',
			slashes: true
		}));
	}
	
	globalShortcut.register('CommandOrControl+Shift+Alt+O', () => {
		win.webContents.openDevTools();
	});  
	
	remoteMain.enable(win.webContents);
	
	if(process.platform === "win32") {  
		app.setAppUserModelId("Rescufood");  
		app.setLoginItemSettings({
			openAtLogin: true    
		})
	} 

	// Emitted when the window is closed.
	win.on('closed', () => {
		// Dereference the window object, usually you would store window
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		win = null; 
	});

	return win;
}

try {
	
  app.commandLine.appendSwitch('ignore-certificate-errors');
  app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');
  app.commandLine.appendSwitch('allow-insecure-localhost', 'true');

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(createWindow, 400));

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
} 