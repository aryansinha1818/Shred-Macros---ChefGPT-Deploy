const express = require("express");
const router = express.Router();

const {
  userSignUp,
  userLogin,
  getUser,
} = require("../controller/user.controller");

router.post("/signUp", userSignUp);
router.post("/login", userLogin);
router.get("/:id", getUser);

module.exports = router;
