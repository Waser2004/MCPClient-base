import '../styles/Chatbot.css';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import avaHeadshot from '../assets/img/ava-chatbot-headshot.png';
import sendIcon from '../assets/img/send-icon.png';
import userHeadshot from '../assets/img/user-headshot.png';
import editIcon from '../assets/img/pencil-icon.png';
import closeIcon from '../assets/img/close-icon.png';
import deleteIcon from '../assets/img/trash-icon.png';
import refreshIcon from '../assets/img/refresh-icon.png';

// Define an interface for a message
interface Message {
  sender: 'user' | 'bot';
  text: string;
}

function Chatbot() {
  // State for whether the chatbot is open or closed
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  // State for storing the new user message input
  const [newMessage, setNewMessages] = useState('');
  // State for the new user message context
  const [context, setContext] = useState('general');
  // State for storing the conversation history (user and bot messages)
  const [messages, setMessages] = useState<Message[]>([]);
  // Ref used for scrolling to the bottom of the messages
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // State for the message being hovered over
  const [hoveredMessage, setHoveredMessage] = useState<number | null>(null);
  // States for the message in edit mode
  const [editMode, setEditMode] = useState<number | null>(null);
  const [editMessageText, setEditMessageText] = useState('');
  // State for scrolling to the bottom of the chat
  const [shouldScroll, setShouldScroll] = useState(false);
  // State to disable the submit button
  const [isBotResponding, setIsBotResponding] = useState(false);

  // Function to toggle the chatbot open/close state
  function toggleButton() {
    setIsChatbotOpen(!isChatbotOpen);
    setShouldScroll(true);
  }

  // Function to delete a user message and bot reply
  function deleteMessage(index: number) {
    // Create a new array excluding the two messages to delete (user + bot response)
    const updatedMessages = messages.filter(
      (_, i) => i < index || i >= index + 2
    );
    // Update the state with the new messages array
    setMessages(updatedMessages);
  }

  // Function to edit a user message and generate a new bot reply
  function editMessage(index: number) {
    // Set the message index to edit mode
    setEditMode(index);
    // Initialize the textarea with the current message text
    setEditMessageText(messages[index].text);
  }

  function cancelEdit() {
    setEditMode(null);
    setEditMessageText('');
  }

  const saveMessage = async (index: number, context: string) => {
    // Update the user message at messages[index]
    const updatedMessages = [...messages];
    // Update the edited message
    updatedMessages[index] = {
      ...updatedMessages[index],
      text: editMessageText,
    };

    try {
      // Make an API call to get a new bot response based on the edited message
      const response = await axios.post('http://127.0.0.1:8000/chat/', {
        question: editMessageText,
        context: context,
      });

      // Simulate bot thinking delay
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));
      await delay(1000);

      // Update bot response at messages[index + 1]
      updatedMessages[index + 1] = { sender: 'bot', text: response.data };
      // Update the state with the new messages
      setMessages(updatedMessages);

      // Exit edit mode
      setEditMode(null);
      // Clear the edit text state
      setEditMessageText('');
    } catch (error) {
      console.error('Error updating the message:', error);

      // Handle error by updating the bot response to show a failure message
      updatedMessages[index + 1] = {
        sender: 'bot',
        text: "I'm sorry, something went wrong. Please try again.",
      };
      setMessages(updatedMessages);
    }
  };

  useEffect(() => {
    // Scroll to the bottom only if shouldScroll is true
    if (shouldScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      // Reset scrolling
      setShouldScroll(false);
    }
  }, [messages, shouldScroll]);

  // Refresh / reset the chatbot
  function handleRefresh() {
    setMessages([]);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Disable sending messages until the bot responds
    setIsBotResponding(true);

    // Add the new user message to the conversation area
    const newMessageObj: Message = {
      sender: 'user',
      text: newMessage,
    };
    setMessages((prevMessages) => [...prevMessages, newMessageObj]);
    // Clear the user input box
    setNewMessages('');
    // Enable scrolling after a new message
    setShouldScroll(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/chat/', {
        question: newMessage,
        context: context,
      });

      // Delay the response for 1 second to simulate the bot thinking
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));
      await delay(1000);

      // Add the bot response to the conversation area
      const botMessageObj: Message = {
        sender: 'bot',
        text: response.data,
      };
      setMessages((prevMessages) => [...prevMessages, botMessageObj]);
      // Enable scrolling after a bot response
      setShouldScroll(true);
    } catch (error) {
      console.error('Error sending message:', error);

      // Add an error message to the chat to notify the user
      const errorMessageObj: Message = {
        sender: 'bot',
        text: "I'm sorry, but I couldn't process your request. Please try again.",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessageObj]);
      // Enable scrolling after an error response
      setShouldScroll(true);
    } finally {
      // Enable the send button after the bot responds or an error occurs
      setIsBotResponding(false);
    }
  };

  return (
    <div>
      <div className="Chatbot-ui-container">
        {/* Chatbot is displayed only if it's open */}
        {isChatbotOpen && (
          <div className="Chatbot-ui">
            <div
              className="Chatbot-ui-header"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {/* Refresh icon on the left */}
              <img
                src={refreshIcon}
                alt="Refresh chatbot icon"
                style={{ width: '16px', cursor: 'pointer' }}
                onClick={handleRefresh}
              />
              {/* Close button on the right */}
              <img
                src={closeIcon}
                alt="Close chatbot icon"
                style={{ width: '12px', cursor: 'pointer' }}
                onClick={toggleButton}
              />
            </div>

            {/* Chatbot heading with avatar and intro text */}
            <div className="Chatbot-ui-heading">
              <img
                src={avaHeadshot}
                alt="Ava Chatbot headshot"
                style={{ width: '60px' }}
              />
              <h3>Hey👋, I'm Ava</h3>
              <p>Ask me anything or pick a place to start</p>
            </div>

            {/* Conversation area (user messages and bot responses will appear here) */}
            <div className="Chatbot-ui-conversation-container">
              <div className="Chatbot-ui-messages">
                {messages.map((message, index) => (
                  <div key={index}>
                    {/* Wrapper for message and optional icons */}
                    <div
                      style={{ display: 'flex', alignItems: 'center' }}
                      onMouseLeave={() => setHoveredMessage(null)}
                    >
                      {/* Conditionally render ava headshot for bot messages */}
                      {message.sender === 'bot' && (
                        <img
                          src={avaHeadshot}
                          alt="Ava Headshot"
                          style={{
                            width: '25px',
                            height: '25px',
                            marginRight: '10px',
                          }}
                        />
                      )}

                      {/* Message box for user or bot message */}
                      {/* Conditionally render either the purple message box or the textarea based on edit mode */}
                      <div
                        className={
                          index === editMode
                            ? 'edit-message-container'
                            : message.sender === 'user'
                              ? 'user-message'
                              : 'ava-response'
                        }
                        style={{ marginRight: '5px' }}
                        onMouseEnter={() =>
                          message.sender === 'user' && setHoveredMessage(index)
                        }
                      >
                        {index === editMode ? (
                          // Render the textarea and always visible Cancel and Send icons when in edit mode
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                          >
                            <textarea
                              className="edit-message"
                              value={editMessageText}
                              onChange={(e) =>
                                setEditMessageText(e.target.value)
                              }
                            />
                            {/* Cancel and Send icons are permanently visible in edit mode */}
                            <img
                              src={closeIcon}
                              alt="Cancel edit icon"
                              style={{ cursor: 'pointer', width: '8px' }}
                              onClick={cancelEdit}
                            />
                            <img
                              src={sendIcon}
                              alt="Send message icon"
                              style={{ cursor: 'pointer', width: '10px' }}
                              onClick={() => saveMessage(index, context)}
                            />
                          </div>
                        ) : (
                          // Render the regular message text
                          <p>{message.text}</p>
                        )}
                      </div>

                      {/* Conditionally show edit/delete icons for user messages on hover */}
                      {hoveredMessage === index &&
                        message.sender === 'user' &&
                        index !== editMode && (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <img
                              src={editIcon}
                              alt="Edit message"
                              style={{ cursor: 'pointer', width: '10px' }}
                              onClick={() => editMessage(index)}
                            />
                            <img
                              src={deleteIcon}
                              alt="Delete message"
                              style={{ cursor: 'pointer', width: '10px' }}
                              onClick={() => deleteMessage(index)}
                            />
                          </div>
                        )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input section for new messages */}
            <div className="Chatbot-ui-input-container">
              <hr className="Chatbot-ui-input-hr" />

              {/* Form for message input and context selection */}
              <form onSubmit={handleSubmit}>
                <div className="Chatbot-ui-input-box">
                  <img
                    src={userHeadshot}
                    alt="User headshot"
                    style={{
                      width: '30px',
                      height: '30px',
                      marginRight: '10px',
                    }}
                  />
                  <textarea
                    className="Chatbot-input"
                    placeholder="Your question"
                    value={newMessage}
                    required
                    onChange={(e) => setNewMessages(e.target.value)}
                    // Allow the user to press the return key on their keyboard to submit a message
                    onKeyDown={(e) => {
                      if (
                        e.key === 'Enter' &&
                        !e.shiftKey &&
                        newMessage.trim() !== '' &&
                        !isBotResponding
                      ) {
                        // Prevent default behavior of Enter (new line)
                        e.preventDefault();
                        // Call the submit function
                        handleSubmit(e);
                      }
                    }}
                  ></textarea>
                </div>

                {/* Context dropdown and send button */}
                <div className="Chatbot-ui-input-toggles">
                  <div>
                    <label htmlFor="context" style={{ color: '#6d6d6d' }}>
                      Context{' '}
                    </label>
                    <select
                      id="context"
                      name="context"
                      className="Chatbot-ui-select-context"
                      onChange={(e) => setContext(e.target.value)}
                    >
                      <option value="general">General</option>
                      <option value="onboarding">Onboarding</option>
                      <option value="pricing">Pricing</option>
                    </select>
                  </div>
                  <div className="Chatbot-ui-send-btn">
                    {/* Send button to submit the message */}
                    <button type="submit" disabled={isBotResponding}>
                      <img
                        src={sendIcon}
                        alt="Send message"
                        style={{ width: '18px' }}
                      />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Button to open and close the chatbot */}
        <button onClick={toggleButton} className="Chatbot-open-toggle">
          <p>Ask Ava</p>
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
