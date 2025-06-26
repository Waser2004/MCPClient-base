import { useEffect, useState } from "react";
import Chatbot from './components/Chatbot';
import { useApi } from "./components/ApiContext";
import './App.css';


function App() {
  const api = useApi();

  useEffect(() => {
    api.authenticate("Standard", "password")
      .catch(err => {
        console.error('Auth failed:', err);
      });
  }, [api]);

  return (
    <div className="App">

      {/*
        <header className="App-header">
          <h1>Chatcp Test environment</h1>
        </header>
      */}

      <div className="Chatbot-container">
          <Chatbot />
      </div>

    </div>
  );
}

export default App;
