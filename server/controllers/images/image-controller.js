const mongoose = require("mongoose");
const { getImageStream } = require("../../helpers/cloudinary");

const getImage = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid image ID"
      });
    }

    const downloadStream = getImageStream(id);
    
    downloadStream.on('error', (error) => {
      console.log(error);
      res.status(404).json({
        success: false,
        message: "Image not found"
      });
    });

    downloadStream.on('file', (file) => {
      res.set('Content-Type', file.metadata.mimetype);
    });

    downloadStream.pipe(res);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error retrieving image"
    });
  }
};

module.exports = { getImage };