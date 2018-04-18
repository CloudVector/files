'use strict';

const Lab = require('lab');
const lab = exports.lab = Lab.script();
const path = require('path');
const expect = require('chai').expect;
const files = require('./index.js');

lab.experiment('files', () => {

    lab.test('folders', async () => {
        let sourcePath = path.join(__dirname, 'test');
        try {
            let folders = await files.folders(sourcePath);
            // Check expectations
            expect(folders).to.be.an('array');
            console.log(folders);
        } catch (err) {
            console.error(err);
        }
    });

    lab.test('all files', async () => {
        let sourcePath = path.join(__dirname, 'test', 'beta');
        try {
            let names = await files.names(sourcePath);
            expect(names).to.be.an('array');
            console.log(names);
        } catch (err) {
            console.error(err);
        }
    });

    lab.test('specific files', async () => {
        let sourcePath = path.join(__dirname, 'test', 'beta');
        try {
            let names = await files.names(sourcePath, '.json');
            expect(names).to.be.an('array');
            console.log(names);
        } catch (err) {
            console.error(err);
        }
    });

});