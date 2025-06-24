import '../styles/Chatbot.css';
import { useEffect, useRef, useState, useCallback } from 'react';
import axios, { AxiosInstance } from 'axios';
import ekoHeadshot from '../assets/img/eko-chatbot-headshot.png';
import sendIcon from '../assets/img/send-icon.png';
import userHeadshot from '../assets/img/user-headshot.png';
import editIcon from '../assets/img/pencil-icon.png';
import closeIcon from '../assets/img/close-icon.png';
import deleteIcon from '../assets/img/trash-icon.png';
import refreshIcon from '../assets/img/refresh-icon.png';
import arrowUp from '../assets/img/arrow_up.png';
import arrowDown from '../assets/img/arrow_down.png';
import { useApi } from "../components/ApiContext"
import { Chunk } from './Api';
import { CoursePresentation, Course, OverviewCourseCard } from './CoursePresentation';
import { UserMessage, UserMessageEdit, AssistantMessage, ToolMessageHeader, ToolMessageFooter, ErrorMessage } from './ChatbotMessages';

// Define an interface for a message
interface Message {
  role: 'user' | 'assistant' | 'tool' | 'error';
  content: string;
}

interface CourseCodeList {
  codes: string[]
  descriptions: string[]
}

interface ToolCall {
  id: string,
  name: string,
  tool_arguments: Object[],
  tool_results: null  | Object[]
}

interface CoursePresentationInterface {
  id: string
  courses: Course[]
}

function Chatbot() {
  const client = useApi();
  const [fakeChat, setFakeChat] = useState<boolean>(false);

  // error reporting
  const [isErrorMessage, setIsErrorMessage] = useState<boolean>(false);
  const [errorRedoFunction, setErrorRedoFunction] = useState<(() => void) | null>(null);

  // State for storing the conversation history (user and bot messages)
  const [messages, updateMessages] = useState<Message[]>([]);
  const messagesRef = useRef<Message[]>([]);
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([]);

  // Expanded toolcalls
  const [expandedIndices, setExpandedIndices] = useState<Set<number>>(new Set());

  // esit
  const [editMessageIndex, setEditMessageIndex] = useState<number | null>(null);

  // Courses to present
  const [courseList, setCourseList] = useState<CoursePresentationInterface[]>([])
  // State for whether the chatbot is open or closed
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  // State for storing the new user message input
  const [newMessage, setNewMessages] = useState('');
  // Ref used for scrolling to the bottom of the messages
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // State for scrolling to the bottom of the chat
  const [shouldScroll, setShouldScroll] = useState(false);
  // State to disable the submit button
  const [isBotResponding, setIsBotResponding] = useState(false);

  function setMessages(newMessages: Message[]){
    messagesRef.current = newMessages;
    updateMessages(newMessages);
  }

  function createFakeChat() {
    // create fake messages
    const new_user_message: Message = {
      role: "user",
      content: "Hey, kannst du mir helfen mir den Kurs 250SE1-GE-EL präsentieren?"
    };
    const new_tool_message: Message = {
      role: "tool",
      content: "call_Uk08cUTafoQCwUUnXyyx9g8b"
    };

    const new_tool_call_message: ToolCall = {
      id: "call_Uk08cUTafoQCwUUnXyyx9g8b",
      name: "Präsentation von Kursen",
      tool_arguments: ['{\n  "codes": [\n    "250SE1-GE-EL"\n  ],\n  "descriptions": [\n    "Wollen Sie Ihre Beweglichkeit, Wahrnehmung, Konzentration und innere Ruhe fördern? In stärkenden Yoga-Übungen, Bewegungen, bewusstem Atem und im aufmerksamen Hinhören auf die Bedürfnisse des Körpers werden Energien freigesetzt. Lebenskraft und Lebensfreude entfalten sich. Entspannungsübungen und Meditationen ermöglichen die Erfahrung der Stille in uns. Einstieg jederzeit möglich."\n  ]\n}'],
      tool_results: ['{\n  "codes": [\n    "250SE1-GE-EL"\n  ],\n  "descriptions": [\n    "Wollen Sie Ihre Beweglichkeit, Wahrnehmung, Konzentration und innere Ruhe fördern? In stärkenden Yoga-Übungen, Bewegungen, bewusstem Atem und im aufmerksamen Hinhören auf die Bedürfnisse des Körpers werden Energien freigesetzt. Lebenskraft und Lebensfreude entfalten sich. Entspannungsübungen und Meditationen ermöglichen die Erfahrung der Stille in uns. Einstieg jederzeit möglich."\n  ]\n}']
    };
    const course_info: Course = {
      code: "250SE1-GE-EL",
      title: "Gerlafingen - Deutsch Elternkurs mit Kinderbetreuung",
      description: "Hatha Yoga: Yoga-Übungen zur Förderung von Beweglichkeit, Wahrnehmung, Konzentration und innerer Ruhe, inkl. Entspannung und Meditation. Einstieg jederzeit möglich.",
      summary: "Hallo",
      date: "Mo 20.01.2025 08:30 - Mi 25.06.2025 11:00",
      weekdays: "Mo 20.01.2025 08:30 - Mi 25.06.2025 11:00",
      placesLeft: true,
      places: ["Pfarramt Gerlafingen"],
      events: {
        eventCount: 20,
        eventTimes: [{
          count: 10,
          time: "Mo 15:00 - 16:15"
        }, {
          count: 10,
          time: "Mi 14:15 - 15:30"
        }]
      },
      prices: [{
        name: "Standard",
        price: 500,
        currency: "CHF"
      }, {
        name: "Mitglied",
        price: 400,
        currency: "CHF"
      }, {
        name: "Senioren",
        price: 300,
        currency: "CHF"
      }],
      categories: ["Deutsch", "Gerlafingen", "Sprachen"]
    }
    const course_presentation: CoursePresentationInterface = {
      id: "call_Uk08cUTafoQCwUUnXyyx9g8b",
      courses: [course_info]
    }

    // add them to the list
    setMessages([new_user_message, new_tool_message]);
    setToolCalls([new_tool_call_message]);
    setCourseList([course_presentation]);
  }

  // Function to toggle the chatbot open/close state
  function toggleButton() {
    setIsChatbotOpen(!isChatbotOpen);
    setShouldScroll(true);
  }

  // will expand the tool call and show more details
  function expandToolCall(index: number){
    setExpandedIndices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index); // Collapse
      } else {
        newSet.add(index); // Expand
      }
      return newSet;
    });
  }

  useEffect(() => {
    // Scroll to the bottom only if shouldScroll is true
    if (shouldScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      // Reset scrolling
      setShouldScroll(false);
    }

    if (!fakeChat){
      createFakeChat();
      setFakeChat(true);
    }
  }, [messages, shouldScroll]);

  function deleteErrorMessage() {
    // delete error message
    if (isErrorMessage){
      setMessages(messagesRef.current.slice(0, -1));
    }

    setIsErrorMessage(false);
    setErrorRedoFunction(null);
  }

  function raiseErrorMessage(error_message: string, error_redo_function: () => void) {
    // set as error
    setIsErrorMessage(true);
    setErrorRedoFunction(() => () => {
      // reset error parameters
      setMessages(messagesRef.current.slice(0, -1));
      setIsErrorMessage(false)

      // retry action that caused error
      error_redo_function()
    })

    // create error message object
    const errorMessageObj: Message = {
      role: 'error',
      content: error_message,
    };
    setMessages([...messagesRef.current, errorMessageObj]);

    // Enable scrolling after an error response
    setShouldScroll(true);
  }

  // Refresh / reset the chatbot
  const handleRefresh = async () => {
    // request to delete history
    const refresh_success = await client.clearMessageHistory();

    // request failed
    if (!refresh_success){
      raiseErrorMessage(
        "I'm sorry while clearing your chat history something went wrong",
        () => handleRefresh()
      );
    } else {
      setMessages([]);
      setToolCalls([]);
      setCourseList([]);
      setNewMessages('');

      localStorage.removeItem("messages");
    }
  }

  const deleteMessage = async (index: number, fromRefreshMessage: boolean = false) => {
    // request to delete message
    const delete_success = await client.deleteMessage(index);
    // error
    if (!delete_success){
      if (!fromRefreshMessage){
        raiseErrorMessage(
          "I'm sorry while deleting your message something went wrong, please try again",
          () => deleteMessage(index)
        )
      }

      return false
    } 
  
    // success
    // get tool calls that have to be deleted
    const toolCallIdsToDelete = new Set(
      messagesRef.current
        .slice(index)
        .filter(message => message.role === "tool")
        .map(message => message.content)
    );

    // Filter out the tool calls and Courselists that shouldn't be deleted
    setToolCalls(prev => prev.filter(tc => !toolCallIdsToDelete.has(tc.id)));
    setCourseList(prev => prev.filter(c => !toolCallIdsToDelete.has(c.id)));

    // Filter out the messages
    const newMessages = messagesRef.current.slice(0, index);
    messagesRef.current = newMessages
    setMessages(newMessages);

    return true
  }

  const refreshMessage = async (index: number) => {
    // store message
    index = index >= 0 ? index : messagesRef.current.length + index
    const refresh_message: Message = {
      role: "user",
      content: messagesRef.current[index].content
    }

    // delete all the messages and add refresh message to messages
    const delete_success = await deleteMessage(index, true);

    // only proceed if the message was successfuly deleted
    if (!delete_success){
      raiseErrorMessage(
        "I'm sorry while refreshing the message something went wrong, please try again",
        () => refreshMessage(index)
      )
    }

    // process new query
    setMessages([...messagesRef.current, refresh_message])
    setIsBotResponding(true)
    setShouldScroll(true)

    try {
      await processStreaiming(refresh_message.content)
    } catch (error) {
      console.log(error);
      raiseErrorMessage(
        "I'm sorry while refreshing the message something went wrong, please try again",
        () => refreshMessage(index)
      )
    } finally {
      // Enable the send button after the bot responds or an error occurs
      setIsBotResponding(false);
    }
  }

  const updateMessage = async (index: number, newContent: string) => {

    // update message
    const newMessages = messagesRef.current.map((m, i) =>
        i === index ? { ...m, content: newContent } : m
      )
    setMessages(newMessages);

    // exit
    setEditMessageIndex(null)

    await refreshMessage(index);
  }

  const processStreaiming = async (content: string) => {
    await client.query_streaming(content, (chunk: Chunk) => {
        if (chunk.type === 'assistant_message') {
          // extract cunck-text and and last message
          const text = chunk.payload.content;
          const last = messagesRef.current[messagesRef.current.length - 1];

          // add chunck to existing streaming message
          if (last?.role === 'assistant'){
            // add chunck text to last message
            const updated = [...messagesRef.current];
            updated[updated.length - 1] = {
              role: 'assistant',
              content: last.content + text,
            };

            setMessages(updated);
          }
          
          // new assistant message
          else {
            setMessages([...messagesRef.current, { role: 'assistant', content: text }])
          }
        } 
        // process tool_call request
        else if (chunk.type === 'tool_call_request') {
          // create message
          const message: Message = {
            role: "tool",
            content: chunk.payload.content.id
          };

          // create tool call message
          const json_arguments = JSON.parse(chunk.payload.content.arguments)
          const tool_call: ToolCall = {
            id: chunk.payload.content.id,
            name: chunk.payload.content.name,
            tool_arguments: json_arguments,
            tool_results: null
          };
        
          setMessages([...messagesRef.current, message]);
          setToolCalls(prev => [...prev, tool_call]);
        }
        // process tool_call result
        else if (chunk.type === 'tool_call_result') {
          // extract chunck data
          const id = chunk.payload.content.id;
          const name = chunk.payload.content.name;
          const result = chunk.payload.content.result.length > 0 ? JSON.parse(chunk.payload.content.result): [];

          // fetch course data if tool call is course presentation
          if(name === "Präsentation von Kursen"){
            // create courseCodelist
            const parsed: CourseCodeList = result;
            const summaries: string[] = parsed.descriptions;
            Promise
              .all(parsed.codes.map((code, index) => client.getCourseInfo(code, summaries[index])))
              .then((fetchedCourses: Course[]) => {
                setCourseList(prev => [...prev, {id: id, courses: fetchedCourses}]);
              })
              .catch(err => console.log(err))
          }

          // add result to tool call entry
          setToolCalls(old =>
            old.map(tool_call => tool_call.id === id ? { ...tool_call, tool_results: result } : tool_call)
          );
        }
        // once we’ve rendered a bit of assistant output, scroll
        setShouldScroll(true);
      });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Disable sending messages until the bot responds
    setIsBotResponding(true);

    // Add the new user message to the conversation area
    const newMessageObj: Message = {
      role: 'user',
      content: newMessage,
    };
    setMessages([...messagesRef.current, newMessageObj]);

    // Clear the user input box & scroll to the bottom
    setNewMessages('');
    setShouldScroll(true);

    try {
      await processStreaiming(newMessageObj.content);
    } catch (error) {
      raiseErrorMessage(
        "I'm sorry while processing your request something went wrong",
        () => refreshMessage(messages.length)
      )
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
            <div className="Chatbot-ui-header"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
              }}
            >
              {/* Refresh icon on the left */}
              <img
                src={refreshIcon}
                alt="Refresh chatbot icon"
                style={{ width: '16px', cursor: 'pointer' }}
                onClick={handleRefresh}
              />
              {/* Chatbot heading with avatar and intro text */}
              <img
                src={ekoHeadshot}
                alt="Eko Chatbot headshot"
                style={{ height: '50px' }}
              />
              {/* Close button on the right */}
              <img
                src={closeIcon}
                alt="Close chatbot icon"
                style={{ width: '12px', cursor: 'pointer' }}
                onClick={toggleButton}
              />
            </div>


            {/* Conversation area (user messages and bot responses will appear here) */}
            <div className="Chatbot-ui-conversation-container">
              <div className="Chatbot-ui-messages">
                {messages.map((message, index) => {
                  if (message.role === "user"){
                    if (editMessageIndex == null || editMessageIndex != index){
                      return (<UserMessage key={index} content={message.content} onRefresh={() => refreshMessage(index)} onEdit={() => setEditMessageIndex(index)} onDelete={() => deleteMessage(index)} />)
                    } else{
                      return (<UserMessageEdit key={index} content={message.content} onDiscard={() => setEditMessageIndex(null)} onSubmit={(text: string) => (updateMessage(index, text))}/>)
                    }
                  } else if (message.role === "assistant"){
                    return (<AssistantMessage key={index}  role={message.role} content={message.content} />)
                  } else if (message.role === "tool"){
                    const tool_call = toolCalls.find(tc => tc.id === message.content);
                    
                    if (tool_call === undefined) {
                      return(<p key={index}>No such tool call</p>)
                    } else {
                      const courseSearch: CoursePresentationInterface | undefined = courseList.find(c => c.id === tool_call.id)
                      const coursesToPresent = courseSearch === undefined ? null : courseSearch.courses

                      return(
                        <div className="tool-message"key={index}>
                          <ToolMessageHeader  name={tool_call.name} onToggle={() => expandToolCall(index)} expanded={expandedIndices.has(index)}/>
                          
                          {/* Tool message content */}
                          {tool_call.name === "Präsentation von Kursen" && coursesToPresent != null && (
                            <CoursePresentation courses={coursesToPresent}/>
                          )}
                          
                          {expandedIndices.has(index) && (
                            <ToolMessageFooter tool_arguments={tool_call.tool_arguments} tool_results={tool_call.tool_results} />
                          )}
                        </div>
                    )}
                  } else if (message.role === "error"){
                    const redo_function = errorRedoFunction != null ? errorRedoFunction : () => (null)

                    return (<ErrorMessage role={message.role} content={message.content} onRetry={() => redo_function()} onDelete={() => deleteErrorMessage()}/>)
                  }
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input section for new messages */}
            <div className="Chatbot-ui-input-container">

              {/* Form for message input and context selection */}
              <form onSubmit={handleSubmit} className="Chatbot-ui-input-form">
                  <textarea
                    className="Chatbot-input"
                    placeholder="Deine Frage"
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
              </form>
            </div>
          </div>
        )}

      </div>

      {/* Button to open and close the chatbot */}
      <button onClick={toggleButton} className="Chatbot-open-toggle">
        <img
          src={ekoHeadshot}
          alt="Eko Chatbot headshot"
          style={{ width: '30px' }}
        />
      </button>
    </div>
  );
}

export default Chatbot;
