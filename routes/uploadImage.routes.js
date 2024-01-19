const express = require("express");
const router = express.Router();
const utils = require("../utils/utils")
const { upload } = require("../service/s3.upload");
const uploadFile = upload.single('image');

// POST METHOD 
router.post("/addphotos", uploadFile, utils.uploadImage);

module.exports = router