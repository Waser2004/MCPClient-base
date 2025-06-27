import '../styles/Chatbot.css';
import { useEffect, useRef, useState, useCallback } from 'react';
import ekoHeadshot from '../assets/img/eko-chatbot-headshot.png';
import sendIcon from '../assets/img/send-icon.png';
import closeIcon from '../assets/img/close-icon.png';
import refreshIcon from '../assets/img/refresh-icon.png';
import refreshIconError from '../assets/img/refresh-icon-error.png';

import { Chunk } from './Api';
import { useApi } from "../components/ApiContext"
import { Notifications } from './Notifications';
import { setNotification, setAlert } from './utils/notificationService';
import { InputFields, Field, formReturn } from './InputFields';
import { CoursePresentation, Course, OverviewCourseCard } from './CoursePresentation';
import { UserMessage, UserMessageEdit, AssistantMessage, ToolMessageHeader, ToolMessageFooter, ErrorMessage } from './ChatbotMessages';
import { handleRequestWrapper, isEditingWrapper, setIsEditingWrapper, isErrorWrapper, setIsErrorWrapper, setIsAuthenticatedWrapper} from './utils/globalRequestLockWithOverrides';

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
  tool_arguments: null | Object[],
  tool_results: null  | Object[]
}

interface CoursePresentationInterface {
  id: string
  courses: Course[]
}

interface InputFieldInterface {
  id: string
  fieldArray: Field[]
}

function Chatbot() {
  const client = useApi();
  const [fakeChat, setFakeChat] = useState<boolean>(false);

  // error reporting
  const [errorRedoFunction, setErrorRedoFunction] = useState<(() => void) | null>(null);

  // authentication status
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  // State for storing the conversation history (user and bot messages)
  const defaultMessage: string = "Hey, ich bin welanteBot.\nMeine Aufgaben sind es dir bei der Kurssuche und bei der Kursanmeldung zu helfen.\nWas kann ich heute für dich tun?"
  const [messages, updateMessages] = useState<Message[]>([]);
  const messagesRef = useRef<Message[]>([]);
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([]);

  // Expanded toolcalls
  const [expandedIndices, setExpandedIndices] = useState<Set<number>>(new Set());

  // esit
  const [editMessageIndex, setEditMessageIndex] = useState<number | null>(null);

  // Courses to present
  const [courseList, setCourseList] = useState<CoursePresentationInterface[]>([])
  const [inputFieldsList, setInputFieldsList] = useState<InputFieldInterface[]>([])

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

  // Reset height → measure scrollHeight → apply it
  const autoResize = (ta: HTMLTextAreaElement) => {
    // get padding
    const style = getComputedStyle(ta);
    const paddingTop    = parseFloat(style.paddingTop);
    const paddingBottom = parseFloat(style.paddingBottom);

    const paddingVertical = paddingTop + paddingBottom

    // set new height
    ta.style.height = 'auto';
    ta.style.height = ta.scrollHeight - paddingVertical < 200? `${ta.scrollHeight - paddingVertical}px` : `200px`;
  };

  function createFakeChat() {}

  // Function to toggle the chatbot open/close state
  const toggleButton = async () => {
    const isChatbotCurrentlyOpen = isChatbotOpen

    setIsChatbotOpen(!isChatbotOpen);
    setShouldScroll(true);

    // connect to the API if not already
    if (!isChatbotCurrentlyOpen) {
      await authenticateAPI()
    }
  }

  const authenticateAPI = async () => {
    if (!isAuthenticating) {
      setIsAuthenticating(true);

      // connect to the API if not already
      const result = await client.getcurrentUser()
      
      if (!result.username){
        setIsAuthenticated(false);
        setIsAuthenticatedWrapper(false);
      } else {
        setIsAuthenticated(true);
        setIsAuthenticatedWrapper(true);
      }

      setIsAuthenticating(false);
    }
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
  }, [messages, courseList, shouldScroll]);

  function deleteErrorMessage() {
    // delete error message
    if (isErrorWrapper){
      setMessages(messagesRef.current.slice(0, -1));
    }

    setIsErrorWrapper(false);
    setErrorRedoFunction(null);
  }

  function raiseErrorMessage(error_message: string, error_redo_function: () => void) {
    // set as error
    setIsErrorWrapper(true);
    setErrorRedoFunction(() => () => {
      // reset error parameters
      setMessages(messagesRef.current.slice(0, -1));
      setIsErrorWrapper(false);

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
  const handleRefresh = handleRequestWrapper(async () => {
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
      editMessage.forcePersistent(null)

      localStorage.removeItem("messages");
    }
  });

  const editMessage = handleRequestWrapper(async (index: number | null) => {
    setEditMessageIndex(index);
    setIsEditingWrapper(!index ? false : true);
  });

  const deleteMessage = handleRequestWrapper(async (index: number, fromRefreshMessage: boolean = false) => {
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
  });

  const refreshMessage = handleRequestWrapper(async (index: number) => {
    // store message
    const idx = index >= 0 ? index + 1 : messagesRef.current.length + index + 1
    console.log(idx);

    // delete all the messages and add refresh message to messages
    const delete_success = await deleteMessage.forcePersistent(idx, true);

    // only proceed if the message was successfuly deleted
    if (!delete_success){
      raiseErrorMessage(
        "I'm sorry while refreshing the message something went wrong, please try again",
        () => refreshMessage(idx)
      )
      return;
    }

    // process new query
    setIsBotResponding(true)
    setShouldScroll(true)

    try {
      await processStreaming("", true)
    } catch (error) {
      console.log(error);
      raiseErrorMessage(
        "I'm sorry while refreshing the message something went wrong, please try again",
        () => refreshMessage(idx)
      )
    } finally {
      // Enable the send button after the bot responds or an error occurs
      setIsBotResponding(false);
    }
  });

  const updateMessage = handleRequestWrapper(async (index: number, newContent: string) => {

    // update message
    const newMessages = messagesRef.current.map((m, i) =>
        i === index ? { ...m, content: newContent } : m
      )
    setMessages(newMessages);

    // exit
    editMessage.forcePersistent(null)

    await refreshMessage.forcePersistent(index);
  });

  const handleFormReturn = handleRequestWrapper(async (tool_call_id: string, form_data: formReturn, force_delete: boolean = false) => {
    // get message index
    const messageIndex = messages.findIndex(m => m.content === tool_call_id)

    // bad tool call id
    if (messageIndex === undefined){
      console.log("Ups something went wrong")
      return
    } 
    // this toolcall is not the latest Message therefore ask the user to confirm deleting the following messages for proceeding!
    else if (messageIndex + 1 != messagesRef.current.length) {
      if (!force_delete){
        setAlert({message: "Wenn sie ihre Daten erneut abschicken wollen werden alle Nachrichten nach dieser gelöscht!", onConfirm: () => handleFormReturn(tool_call_id, form_data, true)})
        return
      }

      // delete next messages and follow thorugh!
      console.log(messageIndex + 1)
      const deleteResult = await deleteMessage.forcePersistent(messageIndex + 1);

      if (!deleteResult) {return}
    }

    // request to change tool result
    const message: string = JSON.stringify({info: "The user filled out the form, and hereby requests you to sign him up using the Data he provided, the signup is not yet complete", form_data: form_data})
    const apiResult = await client.updateToolResult(tool_call_id, message)

    if (apiResult) {
      // update tool result
      setToolCalls(tool_calls => 
        tool_calls.map(tool_call => 
          tool_call.id === tool_call_id
          ? {...tool_call, tool_results: JSON.parse(message)}
          : tool_call
        )
      );

      // start streaming
      try {
        await processStreaming("", true);
      } catch (error) {
        raiseErrorMessage(
          "I'm sorry while processing your request something went wrong",
          () => refreshMessage(messages.length)
        )
      } finally {
        // Enable the send button after the bot responds or an error occurs
        setIsBotResponding(false);
      }
    }
  });

  const signUpFor = handleRequestWrapper(async (tool_call_id: string, course_index: number, force_delete: boolean = false) => {
    // get course list
    const courseArray: CoursePresentationInterface | undefined = courseList.find(c => c.id === tool_call_id)
    const course: Course | undefined = courseArray === undefined ? undefined : courseArray.courses[course_index]

    // get message index
    const messageIndex = messages.findIndex(m => m.content === tool_call_id)

    if (course === undefined || messageIndex === undefined){
      console.log("Ups something went wrong")
      return
    } else if (messageIndex + 1 != messagesRef.current.length) {
      // ask the user if he wants to delete the 
      if (!force_delete){
        setAlert({message: "Wenn sie mit der Anneldung Fortfahren möchten, werden die Nachrichten nach dieser neu generiert!", onConfirm: () => signUpFor(tool_call_id, course_index, true)})
        return
      }
      // delete next messages and follow thorugh!
      console.log(messageIndex + 1)
      const deleteResult = await deleteMessage.forcePersistent(messageIndex + 1);

      if (!deleteResult) {return}
    }
    // create new tool result
    const courseCode = course.code
    const newResult: string = `The user decided to signup for the course ${courseCode}. He hereby requests you to sign him up to that course, initialize the signup!`
    
    // request to change tool result
    const apiResult = await client.updateToolResult(tool_call_id, newResult)

    console.log(apiResult)

    if (apiResult) {
      // update tool result
      setToolCalls(tool_calls => 
        tool_calls.map(tool_call => 
          tool_call.id === tool_call_id
          ? {...tool_call, tool_results:[newResult]}
          : tool_call
        )
      );

      // start streaming
      try {
        await processStreaming("", true);
      } catch (error) {
        raiseErrorMessage(
          "I'm sorry while processing your request something went wrong",
          () => refreshMessage(messages.length)
        )
      } finally {
        // Enable the send button after the bot responds or an error occurs
        setIsBotResponding(false);
      }
    }
  });

  const processStreaming = async (content: string, noQuery: boolean = false) => {
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
        // process tool_call initialization
        else if (chunk.type === 'tool_call_init') {
          // create message that tool has been called
          const message: Message = {
            role: "tool",
            content: "tool_call_initialized"
          };

          setMessages([...messagesRef.current, message]);
        }
        // process tool_call request
        else if (chunk.type === 'tool_call_request') {
          const last: Message = messagesRef.current[messagesRef.current.length - 1]

          // add tool id to Message
          if (last.role === "tool" && last.content === "tool_call_initialized"){
            last.content = chunk.payload.content.id;
          }
          // create new tool call message since no other is available
          else{
            const message: Message = {
              role: "tool",
              content: chunk.payload.content.id
            };
            setMessages([...messagesRef.current, message]);
          }
          

          // create tool call message
          const json_arguments = JSON.parse(chunk.payload.content.arguments)
          const tool_call: ToolCall = {
            id: chunk.payload.content.id,
            name: chunk.payload.content.name,
            tool_arguments: json_arguments,
            tool_results: null
          };
          
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
          // fetch input fields data
          if (name === "Erfassung von Daten" || name === "Initialisierung der Kursanmeldung" || (name ==="Validierung der Anmeldedaten und Fertigstellung der Anmeldung" && result?.status === "ok")){
            const parsed: Field[] = result?.fields;
            setInputFieldsList(prev => [...prev, {id: id, fieldArray: parsed}])
          }

          // add result to tool call entry
          setToolCalls(old =>
            old.map(tool_call => tool_call.id === id ? { ...tool_call, tool_results: result } : tool_call)
          );
        }
        // once we’ve rendered a bit of assistant output, scroll
        setShouldScroll(true);
      }, noQuery);
  }

  const handleSubmit = handleRequestWrapper(async (e: React.FormEvent) => {
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
      await processStreaming(newMessageObj.content);
    } catch (error) {
      raiseErrorMessage(
        "I'm sorry while processing your request something went wrong",
        () => refreshMessage(messages.length)
      )
    } finally {
      // Enable the send button after the bot responds or an error occurs
      setIsBotResponding(false);
    }
  });

  return (
    <>
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
                onClick={() => (setNotification("Hey I am welantebot!"))}
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

              <Notifications />

              {/* Failed to authenticated! */}
              {!isAuthenticated && (
                <div className="auth-failed-message-conteiner">
                  <img
                    src={refreshIconError}
                    alt="try again"
                    className={isAuthenticating ? "woriking-indicator" : ""}
                    style={{ width: '50px', cursor: "pointer"}}
                    onClick={() => authenticateAPI()}
                  />
                  <h2>{isAuthenticating ? "Verbindung zum Server wird hergestellt..." : "Verbindung zum Server konnte nicht hergestellt werden!"}</h2>
                </div>
              )}

              <div className="Chatbot-ui-messages">
                {/* default message */}
                {isAuthenticated && (
                  <AssistantMessage role="assistant" content={defaultMessage}/>
                )}

                {/* all other messages */}
                {isAuthenticated && messages.map((message, index) => {
                  if (message.role === "user"){
                    if (editMessageIndex == null || editMessageIndex != index){
                      return (<UserMessage key={index} content={message.content} onRefresh={() => refreshMessage(index)} onEdit={() => editMessage(index)} onDelete={() => deleteMessage(index)} />)
                    } else{
                      return (<UserMessageEdit key={index} content={message.content} onDiscard={() => editMessage.force(null)} onSubmit={(text: string) => (updateMessage.force(index, text))}/>)
                    }
                  } else if (message.role === "assistant"){
                    return (<AssistantMessage key={index}  role={message.role} content={message.content} />)
                  } else if (message.role === "tool"){
                    // get tool call info
                    const toolCallListSearch: ToolCall | undefined = toolCalls.find(tc => tc.id === message.content)
                    const tool_call: ToolCall = 
                      toolCallListSearch === undefined 
                      ? {
                        id: "",
                        name: message.content === "tool_call_initialized" ? "Tool Nutzung...": "nicht registrierter tool call",
                        tool_arguments: null,
                        tool_results: null,
                      }
                      : toolCallListSearch;

                    // get course presentatino data
                    const courseSearch: CoursePresentationInterface | undefined = courseList.find(c => c.id === tool_call.id)
                    const coursesToPresent = courseSearch === undefined ? null : courseSearch.courses

                    // get Input fields data
                    const inputFields: InputFieldInterface | undefined = inputFieldsList.find(infi => infi.id === tool_call.id)
                    const inputFieldsToPresent = inputFields === undefined ? null : {title: "Anmeldung:", fields: inputFields.fieldArray}

                    return(
                      <div className="tool-message"key={index}>
                        <ToolMessageHeader  
                          displayString={tool_call.name} 
                          onToggle={() => expandToolCall(index)} 
                          expanded={expandedIndices.has(index)} 
                          toolCallComplete={tool_call.tool_results === null ? false : true}
                        />
                        
                        {/* Tool message content */}
                        {tool_call.name === "Präsentation von Kursen" && coursesToPresent != null && (
                          <CoursePresentation courses={coursesToPresent} onSubmit={async (idx: number) => (await signUpFor(tool_call.id, idx))} onRender={() => setShouldScroll(true)}/>
                        )}
                        {(tool_call.name === "Initialisierung der Kursanmeldung" || tool_call.name === "Validierung der Anmeldedaten und Fertigstellung der Anmeldung") && inputFieldsToPresent != null && (
                          <InputFields title={inputFieldsToPresent.title} fields={inputFieldsToPresent.fields} onSubmit={(formData: formReturn) => {handleFormReturn(tool_call.id, formData)}}/>
                        )}
                        
                        {expandedIndices.has(index) && (
                          <ToolMessageFooter tool_arguments={tool_call.tool_arguments} tool_results={tool_call.tool_results} />
                        )}
                      </div>
                    )
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
              <form onSubmit={(e: React.FormEvent) => {e.preventDefault(); handleSubmit(e)}} className="Chatbot-ui-input-form">
                <textarea
                  className="Chatbot-input"
                  placeholder="Deine Frage"
                  value={newMessage}
                  required
                  onChange={(e) => {
                    setNewMessages(e.target.value) 
                    autoResize(e.currentTarget)
                  }} 
                  rows={1}
                  // Allow the user to press the return key on their keyboard to submit a message
                  onKeyDown={(e) => {
                    if (
                      e.key === 'Enter' &&
                      !e.shiftKey &&
                      newMessage.trim() !== ''
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
    </>
  );
}

export default Chatbot;
