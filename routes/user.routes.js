const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth");
const { USER_TYPE: { ADMIN } } = require("../json/enums.json");

const {
  USER: { VALIDATOR, APIS },
} = require("../controllers");

// POST METHOD 
router.post("/signup", VALIDATOR.signup, APIS.signUp);
router.post("/signin", VALIDATOR.signIn, APIS.signIn);
router.post("/forgot", VALIDATOR.forgot, APIS.forgot);
router.post("/verifyOtp", VALIDATOR.verifyOtp, APIS.verifyOtp);
// PUT METHOD
router.put("/changePassword", VALIDATOR.changePassword, APIS.changePassword);
router.put("/updatePassword", auth({ usersAllowed: ["*"] }), VALIDATOR.updatePassword, APIS.updatePassword);
router.put("/update", auth({ usersAllowed: ["*"] }), VALIDATOR.update, APIS.update);
// GET METHOD
router.get("/get", auth({ usersAllowed: ["*"] }), VALIDATOR.fetch, APIS.getUser);
router.get("/dashboard", auth({ usersAllowed: [ADMIN] }), APIS.dashboardCounts);

module.exports = router;
