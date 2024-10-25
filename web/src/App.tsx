import React from 'react';
import Chatbot from './components/Chatbot';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Chat with Ava</h1>
      </header>
      <div className="Chatbot-container">
        <Chatbot />
      </div>
    </div>
  );
}

export default App;
