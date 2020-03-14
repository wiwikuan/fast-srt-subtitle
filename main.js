const http = require('http');
const fs = require("fs");
const express = require('express')
const app = express();
const router = express.Router();

const hostname = '127.0.0.1';
const port = 3000;
var html;

fs.readFile('./index.html', function (err, data) {
	if (err) throw err;
	html = data.toString();
})

router.get('/', function (req, res) {
	res.write(html);
	res.end();
})

app.use(express.static('public'));

app.use('/', router)

app.listen(port)