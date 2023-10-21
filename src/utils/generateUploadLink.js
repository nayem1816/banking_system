const generateUploadLink = (req, image) => {
  const url = req.get("host");
  const protocol = req.protocol;
  const imageLink = protocol + "://" + url + "/images/" + image.filename;

  let imageData = {};
  if (imageLink) {
    imageData = {
      url: imageLink,
      filename: image.filename,
    };
  }

  return imageData;
};

module.exports = generateUploadLink;
