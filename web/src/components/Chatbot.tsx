import '../styles/Chatbot.css';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import avaChatbot from '../assets/img/ava-chatbot.png';
import sendIcon from '../assets/img/send-icon.png';
import userHeadshot from '../assets/img/user-headshot.png';

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

    // Function to toggle the chatbot open/close state
    function toggleButton() {
        setIsChatbotOpen(!isChatbotOpen);
    }

    useEffect(() => {
        // Scroll to bottom when messages change or the chatbot is opened
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isChatbotOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        // Add the new user message to the conversation area
        const newMessageObj: Message = {
            sender: 'user',
            text: newMessage
        };
        setMessages((prevMessages) => [...prevMessages, newMessageObj]);
    
        // Clear the user input box
        setNewMessages('');
        
        try {
            const response = await axios.post('http://127.0.0.1:8000/chat/', {
                question: newMessage,
                context: context
            });
    
            // Delay the response for 1 second to simulate the bot thinking
            const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
            await delay(1000);
    
            // Add the bot response to the conversation area
            const botMessageObj: Message = {
                sender: 'bot',
                text: response.data
            };
            setMessages((prevMessages) => [...prevMessages, botMessageObj]);
    
        } catch (error) {
            console.error('Error sending message:', error);
    
            // Add an error message to the chat to notify the user
            const errorMessageObj: Message = {
                sender: 'bot',
                text: "I'm sorry, but I couldn't process your request. Please try again."
            };
            setMessages((prevMessages) => [...prevMessages, errorMessageObj]);
        }
    };    
    
    return (
        <div>
            <div className='Chatbot-ui-container'>   
                {/* Chatbot is displayed only if it's open */}
                {isChatbotOpen && (
                    <div className='Chatbot-ui'>
                        {/* Close button for the chatbot */}
                        <div onClick={toggleButton} className='Chatbot-ui-header'>
                            &times;
                        </div>

                        {/* Chatbot heading with avatar and intro text */}
                        <div className='Chatbot-ui-heading'>
                            <img src={avaChatbot} alt="Ava Chatbot" style={{width:"60px"}} />
                            <h3>Hey👋, I'm Ava</h3>
                            <p>Ask me anything or pick a place to start</p>               
                        </div>

                        {/* Conversation area (user messages and bot responses will appear here) */}
                        <div className='Chatbot-ui-conversation'>
                            {messages.map((message, index) => (
                                <div key={index} className={message.sender === 'user' ? 'user-message' : 'ava-response'}>
                                    <p>{message.text}</p>
                                </div>
                            ))}
                            {/* Invisible div to mark the end of the messages */}
                            <div ref={messagesEndRef}/>
                        </div>

                        {/* Input section for new messages */}
                        <div className='Chatbot-ui-input-container'>
                            <hr className='Chatbot-ui-input-hr' />

                            {/* Form for message input and context selection */}
                            <form onSubmit={handleSubmit}>
                                <div className='Chatbot-ui-input-box'>
                                    <img src={userHeadshot} alt="User headshot" style={{width:"30px", height:"30px", marginRight: "10px"}} />
                                    <textarea 
                                        className='Chatbot-input'
                                        placeholder='Your question' 
                                        value={newMessage} 
                                        required
                                        onChange={(e) => setNewMessages(e.target.value)}
                                        // Allow the user to press the return key on their keyboard to submit a message
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey && newMessage.trim() !== '' && newMessage.trim() !== '') {
                                                // Prevent default behavior of Enter (new line)
                                                e.preventDefault();                                                
                                                // Call the submit function
                                                handleSubmit(e);
                                            }
                                        }}
                                    ></textarea>
                                </div>

                                {/* Context dropdown and send button */}
                                <div className='Chatbot-ui-input-toggles'>
                                    <div>
                                        <label htmlFor='context' style={{color:"#6d6d6d"}}>Context </label>
                                        <select 
                                            id='context'
                                            name='context'
                                            className='Chatbot-ui-select-context'
                                            onChange={(e) => setContext(e.target.value)}
                                        >
                                            <option value='general'>General</option>
                                            <option value='onboarding'>Onboarding</option>
                                            <option value='pricing'>Pricing</option>
                                        </select>
                                    </div>
                                    <div className='Chatbot-ui-send-btn'>
                                        {/* Send button to submit the message */}
                                        <button type='submit'>
                                            <img src={sendIcon} alt="Send message" style={{width:"18px"}} />
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Button to open and close the chatbot */}
                <button onClick={toggleButton} className='Chatbot-open-toggle'>
                    <p>Ask Ava</p>
                </button>
            </div>
        </div>
    );
}

export default Chatbot;
