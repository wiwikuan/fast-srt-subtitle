// main.js
// This file checks cli argumen to see which mode to run.

const guiMain = require("./main_gui.js");
const browserMain = require("./main_browser.js");

process.argv.forEach( function (val, index, array) {
	if (val == "gui") guiMain.start();
	else if (val == "browser") browserMain.start();
});
