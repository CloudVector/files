'use strict';

const path = require('path');
const fs = require('fs');
const internal = {};

/* List directories or files */
internal.list = (dir, options) => {
    options = options || {};
    options.files = options.files === undefined ? false : options.files;
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, data) => {
            if (err) {
                reject(err);
            } else {
                let result = data.filter((file) => {
                    let fullPath = path.join(dir, file);
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

// Call an event while reading and writing a file
internal.copyWithEvent = async (src, dest, event) => {
    let options = {
        src: src,
        dest: dest,
        content: await internal.read(src)
    };
    options = event(options);
    await internal.write(options.dest, options.content);
};

/* Copy a file or a full directory */
internal.copyContent = async (src, dest, event) => {
    // Check if both is directory
    if (fs.statSync(src).isDirectory() && fs.statSync(dest).isDirectory()) {
        let list = await internal.list(src, { files: true });
        list.forEach(async (file) => {
            let srcFile = path.join(src, file);
            let destFile = path.join(dest, file);
            await internal.copyWithEvent(srcFile, destFile, event);
        });
    } else {
        await internal.copyWithEvent(src, dest, event);
    }
};

/* Copy a single file */
internal.copyFile = (src, dest) => {
    return new Promise((resolve, reject) => {
        fs.copyFile(src, dest, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

/* Copy a file or a full directory */
internal.copy = async (src, dest) => {
    // Check if both is directory
    if (fs.statSync(src).isDirectory() && fs.statSync(dest).isDirectory()) {
        let list = await internal.list(src, { files: true });
        list.forEach(async (file) => {
            let srcFile = path.join(src, file);
            let destFile = path.join(dest, file);
            await internal.copyFile(srcFile, destFile);
        });
    } else {
        await internal.copyFile(src, dest);
    }
};

/* Read a file */
internal.read = (file, options) => {
    options = options || 'utf8';
    return new Promise((resolve, reject) => {
        fs.readFile(file, options, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

/* Rename a file */
internal.rename = (oldPath, newPath) => {
    return new Promise((resolve, reject) => {
        fs.rename(oldPath, newPath, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
};

/* Remove a file or directory */
internal.remove = (file) => {
    return new Promise((resolve, reject) => {
        if (fs.statSync(file).isDirectory()) {
            fs.readdir(file, (err, list) => {
                if (err) {
                    reject(err);
                } else {
                    list.forEach((item) => {
                        let fullName = path.join(file, item);
                        if (!fs.statSync(fullName).isDirectory()) {
                            fs.unlinkSync(fullName);
                        }
                    });
                    fs.rmdir(file, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(true);
                        }
                    });
                }
            });
        } else {
            fs.unlink(file, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            })
        }
    });
};

/* write a file */
internal.write = (file, content, options) => {
    options = options || 'utf8';
    return new Promise((resolve, reject) => {
        fs.writeFile(file, content, options, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
};

/* Creates a directory */
internal.createDir = (dir) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(dir, (err) => {
            if (err) {
                if (err.code === 'EEXIST') {
                    resolve(true);
                } else {
                    reject(err);
                }
            } else {
                resolve(true);
            }
        });
    });
};

/* Create a single file */
internal.createFile = (file, content) => {
    return new Promise((resolve, reject) => {
        fs.appendFile(file, content, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
};

module.exports = {
    // Gets the directory names for single level (not recursive!)
    directories: async (startPath) => {
        return await internal.list(startPath, { files: false });
    },
    // Gets the file names for single level or type if extension is specified
    files: async (startPath, extension) => {
        return await internal.list(startPath, { files: true, ext: extension });
    },
    // Read the file content
    read: async (file, options) => {
        return await internal.read(file, options);
    },
    // Write content to file
    write: async (file, content, options) => {
        return await internal.write(file, content, options);
    },
    // Remove a single file or directory
    remove: async (file) => {
        return await internal.remove(file);
    },
    // Rename a single file or directory
    rename: async (oldPath, newPath) => {
        return await internal.rename(oldPath, newPath);
    },
    // Copy a single file or directory
    copy: async (src, dest, event) => {
        if (typeof event === 'function') {
            return await internal.copyContent(src, dest, event);
        } else {
            return await internal.copy(src, dest);
        }
    },
    // Create directory
    createDir: async (dir) => {
        return await internal.createDir(dir);
    },
    isDir: (file) => {
        return fs.statSync(file).isDirectory();
    },
    // Create file
    createFile: async (file, content) => {
        return await internal.createFile(file, content);
    }
};