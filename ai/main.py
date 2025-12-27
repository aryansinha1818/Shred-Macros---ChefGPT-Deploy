
from fastapi import FastAPI, HTTPException

from pydantic import BaseModel

from typing import List, Optional, Dict
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

from fastapi.middleware.cors import CORSMiddleware

import os
import json
from uuid import uuid4
import asyncio  

load_dotenv()

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if not os.getenv("OPENAI_API_KEY"):
    raise ValueError("OPENAI_API_KEY not found")

llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.7)


class RecipeRequest(BaseModel):
    type: str
    ingredients: List[str]
    time: str
    session_id: Optional[str] = None

# /chart base model
class ChatRequest(BaseModel):
    message: str
    session_id: str
    context: Optional[List[Dict]] = None

class ShareRequest(BaseModel):
    recipe: Dict

memory: Dict[str, List[Dict[str, str]]] = {}

SYSTEM_INSTRUCTIONS = """
You are a helpful AI chef that creates healthy recipes and provides nutritional information. You must ONLY use the exact ingredients provided by the user. 
Do not add or suggest any other ingredients under any circumstances. 
If an ingredient is missing for a typical recipe, work around it with what’s provided. 
Always respond in this JSON format:
{
    "title": "Recipe Title",
    "ingredients": ["item1", "item2"],
    "instructions": "Step by step instructions",
    "macros": {
        "calories": "X kcal",
        "protein": "X g",
        "carbs": "X g",
        "fat": "X g"
    }
}

For follow-up questions, adapt the recipe while maintaining this format.
If asked to modify, clearly state what changed and why.
"""

def generate_recipe_prompt(type: str, ingredients: List[str], time: str) -> str:
    return (
       
           f"Create a detailed {type} recipe using ONLY these ingredients: {', '.join(ingredients)}. "
        f"No new ingredients should be added under any circumstances. "
        f"Preparation time should be under {time} minutes. "
        "Include exact measurements for the given ingredients. "
        "Provide detailed step-by-step instructions. "
        "Calculate and include accurate nutritional information (macros) for the entire recipe."
    )

@app.post('/generate-recipe')
async def generate_recipe(data: RecipeRequest):

    session_id = data.session_id or str(uuid4())


    memory[session_id] = [
        {"role": "system", "content": SYSTEM_INSTRUCTIONS},
        {"role": "user", "content": generate_recipe_prompt(data.type, data.ingredients, data.time)}
    ]

    try:
        response = await asyncio.wait_for(llm.ainvoke(memory[session_id]), timeout=10)

        try:
            recipe_data = json.loads(response.content)
            if not isinstance(recipe_data, dict):
                raise ValueError("Response is not a dictionary")

            if "title" not in recipe_data:
                recipe_data["title"] = f"{data.type.capitalize()} Recipe"
            if "ingredients" not in recipe_data:
                recipe_data["ingredients"] = data.ingredients
            if "instructions" not in recipe_data:
                recipe_data["instructions"] = response.content
            if "macros" not in recipe_data:
                recipe_data["macros"] = {
                    "calories": "N/A",
                    "protein": "N/A",
                    "carbs": "N/A",
                    "fat": "N/A"
                }

        except (json.JSONDecodeError, ValueError) as e:

            print(f"Failed to parse recipe: {e}")
            recipe_data = {





                "title": f"{data.type.capitalize()} Recipe",
                "ingredients": data.ingredients,
                "instructions": response.content,
                "macros": {
                    "calories": "N/A",
                    "protein": "N/A",
                    "carbs": "N/A",
                    "fat": "N/A"
                }
            }

        memory[session_id].append({"role": "assistant", "content": json.dumps(recipe_data)})

        return {
            "session_id": session_id,
            "recipe": recipe_data,
            "success": True
        }
    except asyncio.TimeoutError:
        print("AI service timed out")
        return {
            "session_id": session_id,
            "recipe": {
                "title": "Timeout Error",
                "ingredients": [],
                "instructions": "AI took too long to respond. Please try again.",
                "macros": {
                    "calories": "N/A",
                    "protein": "N/A",
                    "carbs": "N/A",
                    "fat": "N/A"
                }
            },
            "success": False
        }

    except Exception as e:
        print(f"Error generating recipe: {e}")
        raise HTTPException(500, "Failed to generate recipe")

@app.post('/chat')
async def chat(data: ChatRequest):
    
    if not data.message:
        raise HTTPException(400, "Message required")
    if not data.session_id:
        raise HTTPException(400, "session_id required")

    if data.session_id not in memory:
        raise HTTPException(400, "Invalid session_id")

    try:

        memory[data.session_id].append({"role": "user", "content": data.message})
        
        response = await asyncio.wait_for(llm.ainvoke(memory[data.session_id]), timeout=10)

        try:
            content_json = json.loads(response.content)

            if not isinstance(content_json, dict):
                raise ValueError("Response is not a dictionary")

            if "title" not in content_json:
                content_json["title"] = "Modified Recipe"
            if "ingredients" not in content_json:
                prev_recipe = next(
                    (msg for msg in reversed(memory[data.session_id]) 
                     if msg["role"] == "assistant" and isinstance(json.loads(msg["content"]), dict)),
                    None
                )
                content_json["ingredients"] = json.loads(prev_recipe["content"])["ingredients"] if prev_recipe else []
            if "instructions" not in content_json:
                content_json["instructions"] = response.content
            if "macros" not in content_json:
                content_json["macros"] = {
                    "calories": "N/A",
                    "protein": "N/A",
                    "carbs": "N/A",
                    "fat": "N/A"
                }

            response_content = content_json
        except:
            response_content = {
                "title": "AI Response",
                "ingredients": [],
                "instructions": response.content,
                "macros": {
                    "calories": "N/A",
                    "protein": "N/A",
                    "carbs": "N/A",
                    "fat": "N/A"
                }
            }

        memory[data.session_id].append({
            "role": "assistant", 
            "content": json.dumps(response_content)
        })

        return {
            "message": response_content,
            "success": True
        }

    except asyncio.TimeoutError:
        print("Chat AI service timed out")
        return {
            "message": {
                "title": "Timeout Error",
                "ingredients": [],
                "instructions": "AI took too long to respond. Please try again.",
                "macros": {
                    "calories": "N/A",
                    "protein": "N/A",
                    "carbs": "N/A",
                    "fat": "N/A"
                }
            },
            "success": False
        }
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(500, "Failed to process chat message")

@app.post("/share-recipe")
async def share(data: ShareRequest):
    try:
        shared_recipe = {
            "title": data.recipe.get("title", "Unnamed Recipe"),
            "ingredients": data.recipe.get("ingredients", []),
            "instructions": data.recipe.get("instructions", ""),
            "nutrition": data.recipe.get("macros", {})
        }
        return {"recipe": shared_recipe, "success": True}
    except Exception as e:
        raise HTTPException(400, f"Invalid recipe format: {str(e)}")

@app.get("/")
async def root():
    return {"message": "AI Recipe Chef API"}


