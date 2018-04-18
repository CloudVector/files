'use strict';

const files = require('./lib/files.js');

module.exports = {
    // Gets the folder names for single level
    folders: async (startPath) => {
        return await files(startPath, { files: false });
    },
    // Gets the file names for single level or type if extension is specified
    names: async (startPath, extension) => {
        return await files(startPath, { files: true, ext: extension });
    }
};