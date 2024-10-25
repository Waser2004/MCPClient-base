from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from utils import find_answer

app = FastAPI()

# Enable CORS for all origins, methods, and headers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the Chat model using Pydantic's BaseModel
class Chat(BaseModel):
    question: str
    context: str

# POST route for new chats
@app.post("/chat/")
async def chat_response(chat: Chat):
    # Pass the question and context and return the result
    return find_answer(chat.question, chat.context)
    