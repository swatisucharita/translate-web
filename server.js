const express = require('express');
const path = require('path');

const App = require('./server/app');
require('dotenv').load();

const port = process.env.PORT || 8080;
const app = express();
// this assumes that all your app files
// `dist` directory relative to where your server.js is
app.use(express.static(__dirname + '/dist'));

const regApp = new App(app);

regApp.registerTranslateApis();

app.get('*', (request, response) => {
    response.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.listen(port);
console.log("Server started on port " + port);