const readChunk = require('read-chunk')
const fileType = require('file-type');

module.exports = function (file) {
    const validFileTypes = /jpeg|jpg|png|gif/;
    const buffer = readChunk.sync(file.path, 0, 2048);
    const type = fileType(buffer);
    const extValidation = validFileTypes.test(type.ext);
    const mimeValidation = validFileTypes.test(type.mime)
    if (extValidation && mimeValidation) {
        return true;
    } else {
        return false;
    }
}