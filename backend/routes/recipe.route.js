const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth");

const {
  getRecipes,
  addRecipe,
  editRecipe,
  deleteRecipe,
  getRecipe,
  upload,
  getMyRecipes,
} = require("../controller/recipe.controller");

// PUBLIC
router.get("/", getRecipes);
router.get("/myRecipe", verifyToken, getMyRecipes); // ⬆ move up
router.get("/:id", getRecipe);

// PROTECTED
router.post("/", verifyToken, upload.single("file"), addRecipe);
router.put("/:id", verifyToken, upload.single("file"), editRecipe);
router.delete("/:id", verifyToken, deleteRecipe);

module.exports = router;
