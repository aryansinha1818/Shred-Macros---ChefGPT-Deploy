const express = require("express");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const recipe = require("./routes/recipe.route");
const user = require("./routes/user.route");
const ai = require("./routes/ai.route");
const connectDB = require("./config/db.config");

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

// 🔴 BODY PARSERS FIRST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔴 CORS MUST BE HERE (BEFORE ROUTES)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// 🔴 STATIC
app.use(cookieParser());
app.use(express.static("public"));
app.use("/images", express.static(path.join(__dirname, "public/images")));

// 🔴 ROUTES LAST
app.use("/recipe", recipe);
app.use("/user", user);
app.use("/ai-chef", ai);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
