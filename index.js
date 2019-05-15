'use strict'

const config = require('config');
const fs = require('fs');
const pdf = require('pdf-parse');
const _ = require('lodash');

const constraint = require('./constraint');

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
        constraint.MONTHS.forEach((month) => {
            if (_.includes(line, month)) {
                const indexOfFirst = line.indexOf(month);
                if (indexOfFirst === 3) {
                    spendingList.push(line);
                }
            }
        });
    });

    console.log(spendingList);
});