const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth");
const { USER_TYPE } = require("../json/enums.json");

const {
	ROLE: { VALIDATOR, APIS },
} = require("../controllers");

router.post("/add", VALIDATOR.createRole, APIS.createRole);
router.get("/", APIS.get);

module.exports = router;
