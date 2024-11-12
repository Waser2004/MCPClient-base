# eko-chatbot

Eko Chatbot is a customizable customer support chatbot widget built with React, TypeScript, Python, and FastAPI. Designed to help businesses automate responses to common inquiries, Eko enables efficient customer interactions without the need for AI models. Eko’s fuzzy logic technology matches user questions to the best answers from a predefined knowledge base, making setup simple and cost-effective.

## Prerequisites

### Frontend Setup

1. Navigate to the `web` directory:  
   cd web
2. Install dependencies:
   npm install
3. Start the app:
   npm start

### Backend Setup

1. Navigate to the `api` directory:
   cd api
2. Create and activate a virtual environment:

   - On macOS/Linux:

     python3 -m venv venv
     source venv/bin/activate

   - On Windows:

     python -m venv venv
     venv\Scripts\activate

3. Install dependencies:
   pip install -r requirements.txt
4. Start the FastAPI server:
   uvicorn main:app --reload

## Backend (api folder)

### main.py

- Contains the FastAPI server and routes.
- New chatbot submissions are routed here as POST requests.
- The pydantic library is used to validate and structure POST request bodies.
- The /chat/ route receives user chatbot questions and calls the find_answer function in utils.py.

### utils.py

- Contains utility functions.
- The find_answer function receives a question and uses the SequenceMatcher from Python's built-in difflib library to find the most similar match for the question in the response_db.py file.
- Based on the best match, it returns the corresponding answer from the context-specific lists (General, Onboarding, Pricing).
- Includes error handling to ensure a fallback message if no match is found or if an error occurs.

### response_db.py

- Contains the predefined questions and answers, categorized into lists based on the context (General, Onboarding, Pricing).
- Each list is a set of dictionaries with "question" and "answer" keys.

### Testing

- Tests are written using pytest to verify the functionality of utility functions like find_answer.
- Test cases ensure the chatbot returns the correct answers for exact questions and tests progressively altered queries to check fuzzy matching accuracy.
- Run tests using the command pytest from the project root directory.

## Frontend (web folder)

### Chatbot.tsx

- Main component for the chatbot UI and logic.
- Integrates with FastAPI backend via Axios to send user questions and receive bot responses.

### Chatbot Features

- Message Submission
  - Messages are sent by pressing Enter or by clicking the send button.
  - Messages are stored in the `messages` state array, updated dynamically.
- Bot Response Handling
  - On form submission, a request is sent to the backend, and the bot's response is added to the `messages` array after a brief delay to simulate processing.
- Context Selection
  - A dropdown menu allows users to select the context (e.g., General, Onboarding, Pricing) for their questions, updating the `context` state.
- Edit and delete
  - Delete Functionality: Users can delete their messages along with the corresponding bot response, removing them from the messages array.
  - Edit Functionality: Users can edit a previously sent message, triggering a new request to the backend. The edited message and corresponding bot response are updated in the chat.
- Refresh the chat
  - A refresh button allows users to clear the entire chat history and reset the conversation.
- Auto Scrolling
- The chat automatically scrolls to the bottom when new messages are sent.
- Edited or deleted messages do not trigger the scroll so that the user can view their changes.

### Chatbot.css

- Defines the appearance and layout for the chatbot widget.
