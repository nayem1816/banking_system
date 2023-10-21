const fs = require("fs");

const CreateUploadsFile = (directory) => {
  directory.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

module.exports = CreateUploadsFile;
