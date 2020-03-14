const http = require('http');
const fs = require("fs");

const hostname = '127.0.0.1';
const port = 3000;
var html;

fs.readFile('./index.html', function (err, data) {
	if (err) throw err;
	html = data;
})

const server = http.createServer((req, res) => {
        res.statusCode = 200;
	res.setHeader('Content-Type', 'text/html');
	res.write(html);
	res.end();
});

function start() {
	server.listen(port, hostname, () => {
		console.log(`Server running at http://${hostname}:${port}/`);
	});
}

module.export = {
        start: start()
}
