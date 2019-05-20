'use strict'
'use strict'

const config = require('config');

const pdf = require('pdf-parse');
const _ = require('lodash');
const Record = require('./Record');

const bank = config.get('bank');
const constraint = require('./constraint')[bank];
var multer  =   require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './data');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now());
    }
});
var upload = multer({
    storage: storage
}).single('osman');

function loadPDF(req, res) {


    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.", err);
        }
        sendResponse(res, 200);
    });
    

    /*
    let dataBuffer = req.files.pdf;
    pdf(dataBuffer).then((data) => {

        let lines = _.split(data.text, '\n');
        let spendingList = [];
        lines.forEach((line) => {
            line = _.toLower(line);
            constraint.MONTH_ARR.forEach((month) => {
                if (_.includes(line, month)) {
                    const indexOfFirst = line.indexOf(month);
                    if (indexOfFirst === 3) {
                        spendingList.push(_.trim(line));
                    }
                }
            });
        });
    
    
        let recordList =[];
        spendingList.forEach((line) => {
            let splitLine = _.split(line, ' ');
            let date = createDate(splitLine);
            let company = createCompanyName(line, splitLine);
            let payment = createPayment(line, splitLine);
    
            let record = new Record(date, company, payment.price, payment.bonus);
            console.log(record);
            recordList.push(record);
        });
    });*/
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