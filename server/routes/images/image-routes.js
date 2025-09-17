const express = require("express");
const { getImage } = require("../../controllers/images/image-controller");

const router = express.Router();

router.get('/:id', getImage);

module.exports = router;