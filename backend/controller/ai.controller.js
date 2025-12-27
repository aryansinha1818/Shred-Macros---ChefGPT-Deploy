const axios = require("axios");

// const AI_API_BASE = "http://localhost:8000";
const AI_API_BASE = "http://ai:8000";

const ai = async (req, res) => {
  try {
    const response = await axios.post(
      `${AI_API_BASE}/generate-recipe`,
      {
        type: req.body.type,
        ingredients: req.body.ingredients,
        time: req.body.time,
        session_id: req.body.session_id,
      },
      {
        timeout: 30000,
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("AI Generate Recipe Error:", error.message);
    res.status(500).json({
      error: error.response?.data?.detail || "Failed to generate recipe",
      success: false,
    });
  }
};

const aiChat = async (req, res) => {
  try {
    const response = await axios.post(
      `${AI_API_BASE}/chat`,
      {
        message: req.body.message,
        context: req.body.context || [],
        session_id: req.body.session_id || "",
      },
      {
        timeout: 30000,
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("AI Chat Error:", error.message);
    res.status(500).json({
      error: error.response?.data?.detail || "Failed to process chat message",
      success: false,
    });
  }
};

const shareRecipe = async (req, res) => {
  try {
    const response = await axios.post(
      `${AI_API_BASE}/share-recipe`,
      {
        recipe: req.body.recipe,
      },
      {
        timeout: 30000,
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Share Recipe Error:", error.message);
    res.status(500).json({
      error:
        error.response?.data?.detail || "Failed to prepare recipe for sharing",
      success: false,
    });
  }
};

module.exports = { ai, aiChat, shareRecipe };
