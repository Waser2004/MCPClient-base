from fastapi import FastAPI
from pydantic import BaseModel
from utils import find_answer

app = FastAPI()

# Define the Chat model using Pydantic's BaseModel
class Chat(BaseModel):
    question: str
    context: str

# POST route for new chats
@app.post("/chat/")
async def chat_response(chat: Chat):
    # Pass the question and context and return the result
    return find_answer(chat.question, chat.context)
    