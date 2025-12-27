import { useNavigate } from "react-router-dom";
import RecipeItems from "./RecipeItems";
import { useState } from "react";
import Modal from "./Modal";
import InputForm from "./InputForm";
import { useLoaderData } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const recipes = useLoaderData();

  const addRecipe = () => {
    let token = localStorage.getItem("token");
    if (token) {
      navigate("/addRecipe");
    } else {
      alert("⚠️ Please login to fill form");
      setIsOpen(false);
    }
  };

  return (
    <>
      <section className="home">
        <div className="left">
          <h1>Shred Macros!</h1>
          <h5>
            Discover a world of healthy, fitness-friendly recipes tailored for
            gym-goers and wellness lovers. Learn how to make them, explore their
            benefits, and if you have your own nutritious creation — share it
            with the community!
          </h5>
          <button style={{ cursor: "pointer" }} onClick={addRecipe}>
            Share your recipe
          </button>
        </div>

        <div className="right">
          <img
            className="home-img"
            src="/images/foodRecipe.png"
            width="320"
            height="300"
            alt=""
          />
        </div>
      </section>

      <div className="bg">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#d4f6e8"
            fillOpacity="1"
            d="M0,128L12.6,138.7C25.3,149,51,171,76,186.7C101.1,203,126,213,152,218.7C176.8,224,202,224,227,202.7C252.6,181,278,139,303,112C328.4,85,354,75,379,96C404.2,117,429,171,455,186.7C480,203,505,181,531,170.7C555.8,160,581,160,606,138.7C631.6,117,657,75,682,74.7C707.4,75,733,117,758,138.7C783.2,160,808,160,834,176C858.9,192,884,224,909,229.3C934.7,235,960,213,985,224C1010.5,235,1036,277,1061,277.3C1086.3,277,1112,235,1137,192C1162.1,149,1187,107,1213,128C1237.9,149,1263,235,1288,277.3C1313.7,320,1339,320,1364,266.7C1389.5,213,1415,107,1427,53.3L1440,0L1440,320L1427.4,320C1414.7,320,1389,320,1364,320C1338.9,320,1314,320,1288,320C1263.2,320,1238,320,1213,320C1187.4,320,1162,320,1137,320C1111.6,320,1086,320,1061,320C1035.8,320,1011,320,985,320C960,320,935,320,909,320C884.2,320,859,320,834,320C808.4,320,783,320,758,320C732.6,320,707,320,682,320C656.8,320,632,320,606,320C581.1,320,556,320,531,320C505.3,320,480,320,455,320C429.5,320,404,320,379,320C353.7,320,328,320,303,320C277.9,320,253,320,227,320C202.1,320,177,320,152,320C126.3,320,101,320,76,320C50.5,320,25,320,13,320L0,320Z"
          ></path>
        </svg>
      </div>

      <h2 className="recipe-heading">Recipe Book</h2>

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <InputForm setIsOpen={() => setIsOpen(false)} />
        </Modal>
      )}

      <div className="recipe">
        <RecipeItems recipes={recipes} />
      </div>
    </>
  );
};

export default Home;
