const express = require('express');
const port = process.env.PORT || 3000;
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

const publicPath = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);

app.use(express.static(publicPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});
