import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
import MainNavigation from "./components/MainNavigation";
import axios from "axios";
import AddFoodRecipe from "./components/AddFoodRecipe";
import EditRecipe from "./components/EditRecipe";
import RecipeItems from "./components/RecipeItems";
import RecipeDetails from "./components/RecipeDetails";
import AIRecipeForm from "./components/AIRecipeForm";

const getAllRecipes = async () => {
  try {
    const res = await axios.get("http://localhost:5001/recipe");
    return res.data;
  } catch (error) {
    console.error(error.message);
    return [];
  }
};

const getMyRecipe = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5001/recipe/myRecipe", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Could not fetch user recipes", err.message);
    return [];
  }
};

const getFavRecipes = () => {
  return JSON.parse(localStorage.getItem("fav")) || [];
};

const getRecipe = async ({ params }) => {
  try {
    const recipeRes = await axios.get(
      `http://localhost:5001/recipe/${params.id}`
    );
    const recipe = recipeRes.data;
    const userRes = await axios.get(
      `http://localhost:5001/user/${recipe.createdBy}`
    );
    return { ...recipe, email: userRes.data.email };
  } catch (err) {
    console.error("Failed to fetch recipe details", err.message);
    return null;
  }
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainNavigation />,
    children: [
      {
        path: "/",
        element: <Home />,
        loader: getAllRecipes,
      },
      {
        path: "/myRecipe",
        element: <Home />,
        loader: getMyRecipe,
      },
      {
        path: "/favRecipe",
        element: <Home />,
        loader: getFavRecipes,
      },
      {
        path: "/addRecipe",
        element: <AddFoodRecipe />,
      },
      {
        path: "/editRecipe/:id",
        element: <EditRecipe />,
      },
      {
        path: "/recipe/:id",
        element: <RecipeDetails />,
        loader: getRecipe,
      },
      {
        path: "/ai-chef",
        element: <AIRecipeForm />,
      },
    ],
  },
]);

const App = () => {
  return (
    <RouterProvider router={router} fallbackElement={<div>Loading...</div>} />
  );
};

export default App;
