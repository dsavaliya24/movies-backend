const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const {
	USER_TYPE: { ADMIN, SUPERADMIN, USER },
} = require("../json/enums.json");

const { upload } = require("../service/s3.upload");
const uploadFile = upload.single("image");

const {
	MOVIES: { VALIDATOR, APIS },
} = require("../controllers");

// POST METHOD
router.post(
	"/add",
	auth({ usersAllowed: [ADMIN, SUPERADMIN, USER] }),
	upload.single("image"),
	VALIDATOR.add,
	APIS.add,
);
// GET METHOD
router.get(
	"/",
	auth({ usersAllowed: [ADMIN, SUPERADMIN, USER] }),
	VALIDATOR.get,
	APIS.get,
);
// PUT METHOD
router.put(
	"/update",
	auth({ usersAllowed: [ADMIN, SUPERADMIN, USER] }),
	upload.single("image"),
	VALIDATOR.update,
	APIS.update,
);
// DELETE METHOD
router.delete(
	"/delete",
	auth({ usersAllowed: [ADMIN, SUPERADMIN, USER] }),
	VALIDATOR.delete,
	APIS.delete,
);

module.exports = router;
