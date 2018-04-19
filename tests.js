'use strict';

const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = require('code').expect;
const path = require('path');
const tools = require('./index.js');

const TEST_DIR = 'test';
const TEST_FILE = 'file-';
const TEST_JSON = '{}';
const TEST_TEXT = 'ABC';
const SUB_DIRS = ['alpha', 'beta', 'gamma', 'delta'];

// Setup the environment
const runBefore = async () => {
    await tools.createDirectory(path.join(__dirname, TEST_DIR));
    let count = 1;
    let tasks = [];
    SUB_DIRS.forEach(async (dir) => {
        // Create folder
        await tools.createDirectory(path.join(__dirname, TEST_DIR, dir));
        // Create test files
        tasks.push(tools.createFile(path.join(__dirname, TEST_DIR, dir, [TEST_FILE, count, '.json'].join('')), TEST_JSON));
        tasks.push(tools.createFile(path.join(__dirname, TEST_DIR, dir, [TEST_FILE, count, '.txt'].join('')), TEST_TEXT));
        count++;
    });
    await Promise.all(tasks);
};

const runAfter = async () => {
    let tasks = [];
    SUB_DIRS.forEach(async (dir) => {
        tasks.push(tools.remove(path.join(__dirname, TEST_DIR, dir)));
    });
    // Remove sub directories
    await Promise.all(tasks);
    // Remove main directory
    await tools.remove(path.join(__dirname, TEST_DIR));
};

// Build the test environment
lab.before(runBefore);

// Cleanup the test environment
lab.after(runAfter);


lab.experiment('list', () => {

    lab.test('directories', async (flags) => {
        let sourcePath = path.join(__dirname, 'test');
        let list = await tools.directories(sourcePath);
        // Check expectations
        expect(list).to.be.an.array();
        flags.note(JSON.stringify(list, null, 4));
    });

    lab.test('all files', async (flags) => {
        let sourcePath = path.join(__dirname, TEST_DIR, 'beta');
        let list = await tools.files(sourcePath);
        expect(list).to.be.an.array();
        flags.note(JSON.stringify(list, null, 4));
    });

    lab.test('json files', async (flags) => {
        let sourcePath = path.join(__dirname, TEST_DIR, 'beta');
        let list = await tools.files(sourcePath, '.json');
        expect(list).to.be.an.array();
        flags.note(JSON.stringify(list, null, 4));
    });

});


lab.experiment('write-read', () => {
    lab.test('content', async () => {
        let file = path.join(__dirname, TEST_DIR, 'readwrite.txt');
        await tools.createFile(file, 'HELLO WORLD');
        let content = await tools.read(file);
        expect(content).to.be.a.string();
        expect(content).to.be.equal('HELLO WORLD');
        await tools.remove(file);
    });
});

lab.experiment('copy', () => {
    lab.test('file', async () => {
        let src = path.join(__dirname, TEST_DIR, 'alpha', 'apple.txt');
        let dest = path.join(__dirname, TEST_DIR, 'delta', 'apple.txt');
        await tools.createFile(src, 'DELICIOUS');
        await tools.copy(src, dest);
        let content = await tools.read(dest);
        expect(content).to.be.a.string();
        expect(content).to.be.equal('DELICIOUS');
        await tools.remove(src);
        await tools.remove(dest);
    });
});

lab.experiment('rename', () => {
    lab.test('content', () => {

    });
});

lab.experiment('remove', () => {
    lab.test('content', () => {

    });
});
