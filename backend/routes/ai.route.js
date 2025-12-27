const express = require("express");
const router = express.Router();
const { ai, aiChat, shareRecipe } = require("../controller/ai.controller");

router.post("/", ai);

router.post("/chat", aiChat);

router.post("/share", shareRecipe);

module.exports = router;
