# artisan-take-home-chatbot

Chatbot widget built with React, TypeScript, Python, and FastAPI. Supports message send, edit, and delete functionality.

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
