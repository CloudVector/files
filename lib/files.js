'use strict';

const path = require('path');
const fs = require('fs');

module.exports = (startPath, options) => {
    options = options || {};
    options.files = options.files === undefined ? false : options.files;
    return new Promise((resolve, reject) => {
        fs.readdir(startPath, (err, data) => {
            if (err) {
                reject(err);
            } else {
                let result = data.filter((file) => {
                    let fullPath = path.join(startPath, file);
                    let isDir = fs.statSync(fullPath).isDirectory();
                    let isExt = true;
                    if (options.ext) {
                        isExt = (path.extname(file).toLowerCase() === options.ext);
                    }
                    if (options.files) {
                        return (!isDir && isExt);
                    } else {
                        return isDir;
                    }
                });
                resolve(result);
            }
        });
    });
};
