import React, { useEffect, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { BsStopwatchFill } from "react-icons/bs";
import { FaHeart, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from "axios";

export default function RecipeItems({ recipes }) {
  const dataFromLoader = useLoaderData();
  const [allRecipes, setAllRecipes] = useState(recipes || dataFromLoader);
  const [favItems, setFavItems] = useState([]);
  const [isFavRecipe, setIsFavRecipe] = useState(false);
  const navigate = useNavigate();
  const path = window.location.pathname === "/myRecipe" ? true : false;

  useEffect(() => {
    setAllRecipes(recipes);
  }, [recipes]);

  useEffect(() => {
    const storedFavs = JSON.parse(localStorage.getItem("fav")) ?? [];
    setFavItems(storedFavs);
  }, [isFavRecipe, allRecipes]);

  const onDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/recipe/${id}`);
      const updated = allRecipes.filter((recipe) => recipe._id !== id);
      setAllRecipes(updated);

      const updatedFavs = favItems.filter((recipe) => recipe._id !== id);
      localStorage.setItem("fav", JSON.stringify(updatedFavs));
      setIsFavRecipe((prev) => !prev);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const favRecipe = (item) => {
    const isAlreadyFav = favItems.some((recipe) => recipe._id === item._id);
    let updatedFavs;
    if (isAlreadyFav) {
      updatedFavs = favItems.filter((recipe) => recipe._id !== item._id);
    } else {
      updatedFavs = [...favItems, item];
    }
    localStorage.setItem("fav", JSON.stringify(updatedFavs));
    setIsFavRecipe((prev) => !prev);
  };

  return (
    <div className="card-container">
      {allRecipes?.map((item, index) => (
        <div
          key={index}
          className="card"
          onDoubleClick={() => navigate(`/recipe/${item._id}`)}
        >
          <img
            src={`http://localhost:5001/images/${item.coverImage}`}
            width="120px"
            height="100px"
            alt={item.title}
          />
          <div className="card-body">
            <div className="title">{item.title}</div>
            <div className="icons">
              <div className="timer">
                <BsStopwatchFill /> {item.time}
              </div>
              {!path ? (
                <FaHeart
                  onClick={() => favRecipe(item)}
                  style={{
                    color: favItems.some((res) => res._id === item._id)
                      ? "red"
                      : "gray",
                    cursor: "pointer",
                  }}
                />
              ) : (
                <div className="action">
                  <Link to={`/editRecipe/${item._id}`} className="editIcon">
                    <FaEdit />
                  </Link>
                  <MdDelete
                    onClick={() => onDelete(item._id)}
                    className="deleteIcon"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
