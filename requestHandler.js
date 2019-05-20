'use strict'

const config = require('config');
const _ = require('lodash');
const pdfParser = require('./pdfParser');

function loadPDF(req, res) {

    const filePath = _.get(req, 'file.path');
    console.log(`#loadPDF - filePath: ${filePath}`);

    pdfParser(filePath, (error, recordList) => {
        sendResponse(res, 200, {recordList});
    });
    
}

function sendResponse(res, statusCode, body) {
    try {
        res.status(statusCode).json(body);
    } catch (err) {
        logger.error({
            res,
            err
        });
    }
};



module.exports = {
    loadPDF
};