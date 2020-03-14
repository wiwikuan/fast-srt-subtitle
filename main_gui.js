// Library
const electron = require('electron')

const {
	app,
	BrowserWindow
} = require('electron')

function createWindow () {
	let win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntergration: true
		}
	})
	win.loadFile('index.html')
}

// app.whenReady().then(createWindow)

function start() {
	console.log("[main_gui.js] Gui mode start");
	app.whenReady().then(createWindow);
}

module.export = {
	start: start()
}
