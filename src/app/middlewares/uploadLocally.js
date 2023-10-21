const multer = require("multer");
const path = require("path");
const CreateUploadsFile = require("../../utils/createUploadFile");

// ----------------------------------------------------
//File Upload directory
const imageUploadDirectory = "./uploads/images";
const fileUploadDirectory = "./uploads/files";

// Create Upload directory if not exist.
const directory = [imageUploadDirectory, fileUploadDirectory];
// create upload file function
CreateUploadsFile(directory);

// ----------------------------------------------------
// File Upload storage and file name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "bannerImage") {
      cb(null, imageUploadDirectory);
    }
    if (
      file.fieldname === "files" ||
      file.fieldname === "shareHappiness" ||
      file.fieldname === "products" ||
      file.fieldname === "brands"
    ) {
      cb(null, fileUploadDirectory);
    }
  },
  filename: (req, file, cb) => {
    if (file.fieldname === "brands") {
      // convert json file to csv file
      const fileExtension = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileExtension, "")
          .toLowerCase()
          .split(" ")
          .join("-") +
        "-" +
        Date.now() +
        ".txt";

      cb(null, fileName);
    } else {
      const fileExtension = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileExtension, "")
          .toLowerCase()
          .split(" ")
          .join("-") +
        "-" +
        Date.now() +
        fileExtension;
      cb(null, fileName);
    }
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5000000,
  },
  fileFilter(req, file, cb) {
    if (file.fieldname === "bannerImage" || file.fieldname === "image") {
      if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
        return cb(new Error("Please upload an image"));
      }
    }
    if (file.fieldname === "files" || file.fieldname === "file") {
      if (!file.originalname.match(/\.(pdf|doc|docx|xls|xlsx|ppt|pptx)$/)) {
        return cb(new Error("Please upload a file"));
      }
    }
    if (file.fieldname === "shareHappiness" || file.fieldname === "products") {
      if (!file.originalname.match(/\.(xlsx|csv)$/)) {
        return cb(new Error("Please upload a xlsx or csv file"));
      }
    }

    if (file.fieldname === "brands") {
      if (!file.originalname.match(/\.(json)$/)) {
        return cb(new Error("Please upload a json file"));
      }
    }

    cb(null, true);
  },
});

const UploadLocally = upload;

module.exports = UploadLocally;
