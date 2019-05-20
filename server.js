'use strict'

const config = require('config');
const http = require('http');
const express = require('express');
const __ = require('lodash');

const requestHandler = require('./requestHandler');
const app = express();

app.post('/v1/loadPDF', requestHandler.loadPDF);

let server = http.createServer(app)
server.listen(config.serverPort, () => {
    console.log(`Starting the server on  ${config.serverPort}`);
});
