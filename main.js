const express = require('express')
const app = express()

var root = __dirname + "/public"

app.get("/", (req, res) => {
	res.sendFile(root + "/index.html")
});

app.get(/^.*\.(html|css|js|png|jpg|jpeg|svg|ico|mp3)/, (req, res) => {
	res.sendFile(root + req.url.split("?")[0]);
});

app.listen(3000, () => {
	console.log(`Example app listening on port 3000`)
});
