import React, { useState } from "react";
import axios from "axios";
import "../App.css";

export default function InputForm({ setIsOpen }) {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    let endpoint = "";
    let requestData = {};

    if (isSignUp) {
      endpoint = "signUp";
      requestData = { fullname, email, password };
    } else {
      endpoint = "login";
      requestData = { email, password };
    }

    try {
      const response = await axios.post(
        `http://localhost:5001/user/${endpoint}`,
        requestData
      );

      // Save auth data
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setError("");

      if (isSignUp) {
        // ✅ Signup success
        setSuccessMsg("✅ Account created successfully. Please login.");
        setIsSignUp(false);
        resetForm(false); // keep success message
      } else {
        // ✅ Login success
        setSuccessMsg("✅ Login successful!");
        setTimeout(() => {
          setIsOpen(false);
        }, 800);
      }
    } catch (err) {
      let msg = "Something went wrong";

      if (
        err.response?.data?.error &&
        err.response.data.error.includes("E11000 duplicate key error")
      ) {
        msg = "Full Name already exists. Please try another.";
      } else if (err.response?.data?.error) {
        msg = err.response.data.error;
      }

      setSuccessMsg("");
      setError(msg);
    }
  };

  const resetForm = (clearSuccess = true) => {
    setFullname("");
    setEmail("");
    setPassword("");
    setError("");
    if (clearSuccess) setSuccessMsg("");
  };

  const handleSwitchMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  return (
    <form className="form" onSubmit={handleOnSubmit}>
      {isSignUp && (
        <div className="form-control">
          <label>Full Name</label>
          <input
            type="text"
            className="input"
            value={fullname}
            onChange={(e) => {
              setFullname(e.target.value);
              setError("");
            }}
            required
            minLength={3}
            onInvalid={(e) =>
              e.target.setCustomValidity("Please enter at least 3 characters")
            }
            onInput={(e) => e.target.setCustomValidity("")}
          />
        </div>
      )}

      <div className="form-control">
        <label>Email</label>
        <input
          type="email"
          className="input"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          required
          onInvalid={(e) =>
            e.target.setCustomValidity(
              "Please enter a valid email (e.g., user@example.com)"
            )
          }
          onInput={(e) => e.target.setCustomValidity("")}
        />
      </div>

      <div className="form-control">
        <label>Password</label>
        <input
          type="password"
          className="input"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          required
          minLength={6}
          onInvalid={(e) =>
            e.target.setCustomValidity("Password must be at least 6 characters")
          }
          onInput={(e) => e.target.setCustomValidity("")}
        />
      </div>

      <button
        type="submit"
        disabled={
          isSignUp ? !fullname || !email || !password : !email || !password
        }
      >
        {isSignUp ? "Sign Up" : "Login"}
      </button>

      <br />

      {error && <h6 className="error">{error}</h6>}

      {successMsg && (
        <h6 style={{ color: "#00c851", marginTop: "10px" }}>{successMsg}</h6>
      )}

      <br />

      <p onClick={handleSwitchMode} style={{ cursor: "pointer" }}>
        {isSignUp ? "Already have an account?" : "Create new account"}
      </p>
    </form>
  );
}
