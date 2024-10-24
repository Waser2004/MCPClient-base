import React from 'react';
import Chatbot from './components/Chatbot'
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Chat with Ava</h1>
        <div style={{
            position: 'fixed',  // Keeps it in place on scroll
            bottom: '20px',     // 20 pixels from the bottom
            right: '20px',      // 20 pixels from the right
            zIndex: 1000        // Ensures it's on top of other elements
          }}>
          <Chatbot />
        </div>
      </header>
    </div>
  );
}

export default App;
