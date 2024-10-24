import '../styles/Chatbot.css';
import { useState } from 'react';
import avaChatbot from '../assets/img/ava-chatbot.png';
import sendIcon from '../assets/img/send-icon.png';
import userHeadshot from '../assets/img/user-headshot.png';

function Chatbot() {    
    // State for whether the chatbot is open or closed
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);

    // State for storing the new message input
    const [newMessage, setNewMessages] = useState('');

    // State for storing the conversation history (user and AI messages)
    const [messages, setMessages] = useState([]);

    // Function to toggle the chatbot open/close state
    function toggleButton() {
        setIsChatbotOpen(!isChatbotOpen);
    }
    
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

                        {/* Conversation area (user messages and AI responses will appear here) */}
                        <div className='Chatbot-ui-conversation'>                                   
                            <p className='user-message'>What services does Artisan provide?</p>
                            <div className='ava-response'>
                                <img src={avaChatbot} alt="Ava Chatbot" style={{width:"30px", height:"30px", marginRight: "10px"}} />
                                <p>Artisan provides AI-powered employees that help automate business tasks, such as sales outreach, customer support, and lead generation. How can I assist you further?</p>
                            </div>
                        </div>

                        {/* Input section for new messages */}
                        <div className='Chatbot-ui-input-container'>
                            <hr className='Chatbot-ui-input-hr' />

                            {/* Form for message input and context selection */}
                            <form>
                                <div className='Chatbot-ui-input-box'>
                                    <img src={userHeadshot} alt="User headshot" style={{width:"30px", height:"30px", marginRight: "10px"}} />
                                    <textarea className='Chatbot-input' placeholder='Your question'></textarea>
                                </div>

                                {/* Context dropdown and send button */}
                                <div className='Chatbot-ui-input-toggles'>
                                    <div>
                                        <label htmlFor='context' style={{color:"#6d6d6d"}}>Context </label>
                                        <select id='context' name='context' className='Chatbot-ui-select-context'>
                                            <option value='General'>General</option>
                                            <option value='Onboarding'>Onboarding</option>
                                            <option value='Pricing'>Pricing</option>
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
