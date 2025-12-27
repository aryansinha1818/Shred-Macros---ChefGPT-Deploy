import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditRecipe() {
  const [recipeData, setRecipeData] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    time: "",
    file: null,
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getData = async () => {
      await axios.get(`http://localhost:5001/recipe/${id}`).then((response) => {
        let res = response.data;
        setRecipeData({
          title: res.title,
          ingredients: res.ingredients.join(","),
          instructions: res.instructions,
          time: res.time,
        });
      });
    };
    getData();
  }, [id]);

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

    if (recipeData.ingredients) {
      const ingredientsArray = Array.isArray(recipeData.ingredients)
        ? recipeData.ingredients
        : recipeData.ingredients.split(",");

      ingredientsArray.forEach((item) =>
        formData.append("ingredients", item.trim())
      );
    }

    if (recipeData.file) {
      formData.append("file", recipeData.file);
    }

    await axios.put(`http://localhost:5001/recipe/${id}`, formData, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    navigate("/myRecipe");
  };

  return (
    <>
      <div className="container">
        <form className="form" onSubmit={onHandleSubmit}>
          <div className="form-control">
            <label>Title</label>
            <input
              type="text"
              className="input"
              name="title"
              onChange={onHandleChange}
              value={recipeData.title}
            ></input>
          </div>
          <div className="form-control">
            <label>Time</label>
            <input
              type="text"
              className="input"
              name="time"
              onChange={onHandleChange}
              value={recipeData.time}
            ></input>
          </div>
          <div className="form-control">
            <label>Ingredients</label>
            <textarea
              type="text"
              className="input-textarea"
              name="ingredients"
              rows="5"
              onChange={onHandleChange}
              value={recipeData.ingredients}
            ></textarea>
          </div>
          <div className="form-control">
            <label>Instructions</label>
            <textarea
              type="text"
              className="input-textarea"
              name="instructions"
              rows="5"
              onChange={onHandleChange}
              value={recipeData.instructions}
            ></textarea>
          </div>
          <div className="form-control">
            <label>Recipe Image</label>
            <input
              type="file"
              className="input"
              name="file"
              onChange={onHandleChange}
            ></input>
          </div>
          <button type="submit">Edit Recipe</button>
        </form>
      </div>
    </>
  );
}
