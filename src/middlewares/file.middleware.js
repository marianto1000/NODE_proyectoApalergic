const multer = require('multer');
const path = require('path');

const upload = multer({
  storage,
  fileFilter,
});

module.exports = { upload };