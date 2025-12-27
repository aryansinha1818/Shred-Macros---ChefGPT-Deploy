import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function AddFoodRecipe() {
  const location = useLocation();
  const navigate = useNavigate();
  const [recipeData, setRecipeData] = useState({
    title: "",
    time: "",
    ingredients: "",
    instructions: "",
    file: null,
  });

  useEffect(() => {
    if (location.state?.sharedRecipe) {
      const { sharedRecipe } = location.state;
      setRecipeData({
        title: sharedRecipe.title,
        time: sharedRecipe.time,
        ingredients: sharedRecipe.ingredients,
        instructions: sharedRecipe.instructions,
        file: null,
      });

      alert(
        "Recipe fields have been pre-filled from your AI chat. Please add an image and submit!"
      );
    }
  }, [location.state]);

  const onHandleChange = (e) => {
    let val =
      e.target.name === "ingredients"
        ? e.target.value.split(",")
        : e.target.name === "file"
        ? e.target.files[0]
        : e.target.value;
    setRecipeData((pre) => ({ ...pre, [e.target.name]: val }));
  };

  const onHandleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", recipeData.title);
    formData.append("time", recipeData.time);
    formData.append("instructions", recipeData.instructions);
    if (recipeData.file) {
      formData.append("file", recipeData.file);
    }

    if (recipeData.ingredients) {
      const ingredientsArray = Array.isArray(recipeData.ingredients)
        ? recipeData.ingredients
        : recipeData.ingredients.split(",");

      ingredientsArray.forEach((item) => {
        formData.append("ingredients", item.trim());
      });
    }

    try {
      await axios.post("http://localhost:5001/recipe", formData, {
        headers: {
          // "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      navigate("/");
    } catch (err) {
      console.error("Error uploading recipe:", err);
      alert("Failed to upload recipe. Please check all fields and try again.");
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={onHandleSubmit}>
        <div className="form-control">
          <label>Title</label>
          <input
            type="text"
            className="input"
            name="title"
            value={recipeData.title}
            onChange={onHandleChange}
          />
        </div>
        <div className="form-control">
          <label>Time</label>
          <input
            type="text"
            className="input"
            name="time"
            value={recipeData.time}
            onChange={onHandleChange}
          />
        </div>
        <div className="form-control">
          <label>Ingredients (comma separated)</label>
          <textarea
            className="input-textarea"
            name="ingredients"
            rows="5"
            value={recipeData.ingredients}
            onChange={onHandleChange}
          />
        </div>
        <div className="form-control">
          <label>Instructions</label>
          <textarea
            className="input-textarea"
            name="instructions"
            rows="5"
            value={recipeData.instructions}
            onChange={onHandleChange}
          />
        </div>
        <div className="form-control">
          <label>Recipe Image</label>
          <input
            type="file"
            className="input"
            name="file"
            onChange={onHandleChange}
            required
          />
        </div>
        <button type="submit">Add Recipe</button>
      </form>
    </div>
  );
}
