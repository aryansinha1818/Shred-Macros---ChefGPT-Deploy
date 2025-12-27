import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import InputForm from "./InputForm";
import { NavLink } from "react-router-dom";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const token = localStorage.getItem("token");
  const [isLogin, setIsLogin] = useState(!token);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    setIsLogin(!token);
  }, [token]);

  const checkLogin = () => {
    if (token) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLogin(true);
    } else {
      setIsOpen(true);
    }
  };

  // 👉 extract username before @
  const username = user?.email ? user.email.split("@")[0] : "";

  return (
    <>
      <header>
        <h2>Food Blog</h2>

        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>

          <li onClick={() => isLogin && setIsOpen(true)}>
            <NavLink to={!isLogin ? "/myRecipe" : "/"}>My Recipe</NavLink>
          </li>

          <li onClick={() => isLogin && setIsOpen(true)}>
            <NavLink to={!isLogin ? "/favRecipe" : "/"}>Favourites</NavLink>
          </li>

          <li onClick={() => isLogin && setIsOpen(true)}>
            <NavLink to={!isLogin ? "/ai-chef" : "/"}>Ask AI Chef!</NavLink>
          </li>

          <li onClick={checkLogin}>
            <p className="login">
              {isLogin ? (
                "Login"
              ) : (
                <>
                  Logout
                  <span className="user-email" title={username}>
                    {username}
                  </span>
                </>
              )}
            </p>
          </li>
        </ul>
      </header>

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <InputForm setIsOpen={() => setIsOpen(false)} />
        </Modal>
      )}
    </>
  );
}
