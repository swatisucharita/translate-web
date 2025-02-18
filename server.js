const express = require('express');
const path = require('path');
const fs = require('fs');

const App = require('./server/app');
require('dotenv').load();

const port = process.env.PORT || 8080;
const app = express();

let options = {
    key: fs.readFileSync((process.env.HOME || process.env.USERPROFILE) + '/.ssh/privkey.pem'),
    cert: fs.readFileSync((process.env.HOME || process.env.USERPROFILE) + '/.ssh/fullchain.pem')
};
let https = require('https').createServer(options, app);
// this assumes that all your app files
// `dist` directory relative to where your server.js is
app.use(express.static(__dirname + '/dist'));

const regApp = new App(app);

regApp.registerTranslateApis();

app.get('*', (request, response) => {
    response.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

https.listen(port, () => console.log('Server running on port ' + port));