const Recipes = require("../models/recipe.model");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + "-" + file.originalname;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

const getRecipes = async (req, res) => {
  const data = await Recipes.find();
  if (data) return res.json(data);
  else return "Your Recipe Book is empty";
};
const getRecipe = async (req, res) => {
  const data = await Recipes.findById(req.params.id);
  if (data) return res.json(data);
  else return res.status(404).json({ error: "Recipe not found" });
};
const addRecipe = async (req, res) => {
  try {
    const { title, time, instructions, ingredients } = req.body;
    const file = req.file;

    if (!title || !time || !instructions || !ingredients || !file) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const ingredientsArray = Array.isArray(ingredients)
      ? ingredients
      : typeof ingredients === "string"
      ? ingredients.split(",")
      : [];

    const newRecipe = new Recipes({
      title,
      time,
      instructions,
      ingredients: ingredientsArray.map((i) => i.trim()), // Clean up ingredients
      coverImage: file.filename,
      createdBy: req.user.id,
    });

    await newRecipe.save();
    res.status(201).json({ msg: "Recipe added", recipe: newRecipe });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

const getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipes.find({ createdBy: req.user.id });
    return res.json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const editRecipe = async (req, res) => {
  const { title, ingredients, instructions, time } = req.body;
  let data = await Recipes.findById(req.params.id);
  try {
    if (data) {
      // cause when we upload we get the filename and when we dont it is blank
      // varna old laga do
      let coverImage = req.file?.filename
        ? req.file?.filename
        : data.coverImage;

      await Recipes.findByIdAndUpdate(
        req.params.id,
        { ...req.body, coverImage },

        { new: true }
      );
      res.json({ title, ingredients, instructions, time });
    }
  } catch (e) {
    return res.status(404).json({ message: "error" });
  }
};
const deleteRecipe = async (req, res) => {
  try {
    await Recipes.deleteOne({ _id: req.params._id });
    res.json({ status: "success" });
  } catch (e) {
    return res.status(404).json({ message: "error" });
  }
};

module.exports = {
  getRecipes,
  getRecipe,
  addRecipe,
  editRecipe,
  deleteRecipe,
  upload,
  getMyRecipes,
};
