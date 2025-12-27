import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../index.css";

const AIRecipeChat = () => {
  const [type, setType] = useState("veg");
  const [ingredients, setIngredients] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateInitialRecipe = async () => {
    if (!ingredients.trim() || !prepTime.trim()) {
      alert("Please fill in ingredients and time!");
      return;
    }

    setIsLoading(true);

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: `Generate a ${type} recipe using ${ingredients} in ${prepTime}`,
      timestamp: new Date(),
    };

    setMessages([userMessage]);
    setChatStarted(true);

    try {
      const response = await axios.post("http://localhost:5001/ai-chef/", {
        type,
        ingredients: ingredients.split(",").map((i) => i.trim()),
        time: prepTime,
      });

      setSessionId(response.data.session_id);

      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: response.data.recipe,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: {
          title: "Error",
          ingredients: [],
          instructions:
            error.response?.data?.error ||
            "Sorry, I couldn't generate a recipe right now.",
        },
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsLoading(true);

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: newMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");

    try {
      const response = await axios.post("http://localhost:5001/ai-chef/chat", {
        message: newMessage,
        session_id: sessionId,
        context: messages.map((msg) => ({
          type: msg.type,
          content: msg.content,
        })),
      });

      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: response.data.message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: "ai",
        content:
          error.response?.data?.error ||
          "Sorry, I couldn't process your message.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const shareRecipe = async () => {
    try {
      const lastRecipe = messages
        .filter(
          (m) =>
            m.type === "ai" && typeof m.content === "object" && m.content?.title
        )
        .pop();

      if (!lastRecipe) {
        alert("No recipe found to share");
        return;
      }

      const macros = lastRecipe.content.macros || {
        calories: "N/A",
        protein: "N/A",
        carbs: "N/A",
        fat: "N/A",
      };
      const nutritionInfo = `
Nutritional Information:
- Calories: ${macros.calories}
- Protein: ${macros.protein}
- Carbohydrates: ${macros.carbs}
- Fat: ${macros.fat}
`;

      const recipeToShare = {
        title: lastRecipe.content.title,
        ingredients: lastRecipe.content.ingredients.join(", "),
        instructions: `${lastRecipe.content.instructions}\n\n${nutritionInfo}`,
        time: lastRecipe.content.time || "30 minutes",
        macros: macros,
      };

      navigate("/addRecipe", { state: { sharedRecipe: recipeToShare } });
    } catch (error) {
      console.error("Sharing failed:", error);
      alert(
        error.response?.data?.error || "Failed to prepare recipe for sharing"
      );
    }
  };

  const resetChat = () => {
    setMessages([]);
    setChatStarted(false);
    setNewMessage("");
    setIngredients("");
    setPrepTime("");
    setSessionId("");
  };

  const renderMessage = (message) => {
    if (message.type === "user") {
      return (
        <div key={message.id} className="message user-message">
          <div className="message-content">
            <p>{message.content}</p>
          </div>
          <div className="message-time">
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
      );
    } else {
      const content = message.content;
      return (
        <div key={message.id} className="message ai-message">
          <div className="message-content">
            {typeof content === "string" ? (
              <p>{content}</p>
            ) : (
              <div className="recipe-response">
                <h3 className="recipe-title">{content.title}</h3>
                {content.ingredients && content.ingredients.length > 0 && (
                  <div className="recipe-section">
                    <strong>Ingredients:</strong>
                    <ul>
                      {content.ingredients.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="recipe-section">
                  <strong>Instructions:</strong>
                  <p>{content.instructions}</p>
                </div>
                {content.macros && (
                  <div className="nutrition">
                    <h4>Nutrition Information</h4>
                    <p>Calories: {content.macros.calories || "N/A"}</p>
                    <p>Protein: {content.macros.protein || "N/A"}</p>
                    <p>Carbs: {content.macros.carbs || "N/A"}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="message-time">
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
      );
    }
  };

  if (!chatStarted) {
    return (
      <div className="recipe-container">
        <div className="recipe-form">
          <h2 className="form-title">AI Recipe Chef 🤖👨‍🍳</h2>

          <div className="input-group">
            <label className="input-label">Choose Type:</label>
            <select
              className="select-input"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="veg">Vegetarian</option>
              <option value="non-veg">Non-Vegetarian</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">
              Primary Ingredients (comma separated):
            </label>
            <input
              className="text-input"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="e.g., chicken, rice, vegetables"
            />
          </div>

          <div className="input-group">
            <label className="input-label">How much time do you have?</label>
            <input
              className="text-input"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              placeholder="e.g., 30 minutes"
            />
          </div>

          <button
            className="generate-btn"
            onClick={generateInitialRecipe}
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Start Cooking Chat! 🚀"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>AI Recipe Chef 🤖👨‍🍳</h2>
        <div className="header-buttons">
          <button
            className="share-btn"
            onClick={shareRecipe}
            disabled={isLoading}
          >
            {isLoading ? "Sharing..." : "Share Recipe"}
          </button>
          <button className="reset-btn" onClick={resetChat}>
            New Recipe
          </button>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map(renderMessage)}
        {isLoading && (
          <div className="message ai-message loading">
            <div className="message-content">
              <p>AI Chef is cooking up a response... 🍳</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ask me anything about the recipe..."
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !newMessage.trim()}
          className="send-btn"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AIRecipeChat;
