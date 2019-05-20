'use strict'

const config = require('config');
const http = require('http');
const express = require('express');
const __ = require('lodash');
var multer = require('multer');

const requestHandler = require('./requestHandler');
const app = express();


const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './data');
    },
    filename: function (req, file, callback) {
        callback(null, `${file.fieldname}-${Date.now()}.pdf`);
    }
});
const upload = multer({
    storage: storage
}).single('pdf');

app.use(upload);

app.post('/v1/loadPDF', requestHandler.loadPDF);

let server = http.createServer(app)
server.listen(config.serverPort, () => {
    console.log(`Starting the server on  ${config.serverPort}`);
});
