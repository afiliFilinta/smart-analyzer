'use strict'

const config = require('config');
const fs = require('fs');
const pdf = require('pdf-parse');
const _ = require('lodash');
const Record = require('./Record');

const bank = config.get('bank');
const constraint = require('./constraint')[bank];

const filePath = config.get('path');
let dataBuffer = fs.readFileSync(filePath);

pdf(dataBuffer).then((data) => {

    // number of pages
    // console.log(data.numpages);
    // number of rendered pages
    // console.log(data.numrender);
    // PDF info
    // console.log(data.info);
    // PDF metadata
    // console.log(data.metadata); 
    // PDF.js version
    // check https://mozilla.github.io/pdf.js/getting_started/
    // console.log(data.version);
    // PDF text

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
});

function createDate(splitLine) {
    const strDate = splitLine[0] + ' ' + constraint.MONTHS[_.upperCase(splitLine[1])].ENG + ' ' + _.words(splitLine[2])[0].substring(0, 4);
    return new Date(strDate);
}

function createCompanyName(line, splitLine) {

    let end = splitLine.length - 1;
    if (line.indexOf(constraint.TAKSIT) > -1) {
        end = splitLine.length - 2;
    }

    let strCompany = splitLine[2].substring(4);
    for (var i = 3; i < end; i++) {
        strCompany = strCompany + ' ' + splitLine[i];
    }
    return _.lowerCase(strCompany);
}

function createPayment(line, splitLine) {

    let priceSndBonusStr = splitLine[splitLine.length - 1];
    let index = priceSndBonusStr.indexOf(constraint.TAKSIT);

    if (index > -1) {
        priceSndBonusStr = priceSndBonusStr.substring(index + constraint.TAKSIT.length);
    }

    let count = (priceSndBonusStr.match(/,/g) || []).length;
    priceSndBonusStr = _.replace(priceSndBonusStr, ',', '.');

    let bonus = 0;
    let price = 0;
    if (count === 1) {
        price = Number(priceSndBonusStr);
    } else if (count === 2) {
        priceSndBonusStr = _.replace(priceSndBonusStr, ',', '.');
        bonus = Number(priceSndBonusStr.substring(0, 4));
        price = Number(priceSndBonusStr.substring(4, priceSndBonusStr.length));
    }

    return {
        bonus,
        price
    };
}
