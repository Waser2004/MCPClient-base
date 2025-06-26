import React, { useEffect, useRef } from 'react';
import '../styles/ChatbotMessages.css';

import editIcon from '../assets/img/pencil-icon.png';
import deleteIcon from '../assets/img/trash-icon.png';
import deleteIconError from '../assets/img/trash-icon-error.png';
import refreshIcon from '../assets/img/refresh-icon.png';
import refreshIconError from '../assets/img/refresh-icon-error.png';
import arrowUp from '../assets/img/arrow_up.png';
import arrowDown from '../assets/img/arrow_down.png';
import closeIcon from '../assets/img/close-icon.png';
import sendIcon from '../assets/img/send-icon.png';

interface Message {
    role: 'user' | 'assistant' | 'tool' | 'error';
    content: string;
}

interface ToolCall {
    name: string
    tool_arguments: Object
    tool_results: null | Object
}

interface UserMessageProps{
    content: string
    onDelete: () => void
    onEdit: () => void
    onRefresh: () => void
}

export const UserMessage: React.FC<UserMessageProps> = ({ content, onDelete, onEdit, onRefresh }) => {
    return (
        <div>
            <div className="user-message">
                <p>{content}</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' , marginTop: "10px", marginRight: "10px", justifyContent: "flex-end"}}>
                <img
                    src={refreshIcon}
                    alt="try again"
                    style={{ cursor: 'pointer', width: '1rem' }}
                    onClick={() => onRefresh()}
                />
                <img
                    src={editIcon}
                    alt="Edit message"
                    style={{ cursor: 'pointer', width: '1rem' }}
                    onClick={() => onEdit()}
                />
                <img
                    src={deleteIcon}
                    alt="Delete message"
                    style={{ cursor: 'pointer', width: '1rem' }}
                    onClick={() => onDelete()}
                />
            </div>
        </div>
    )
}

interface UserMessageEditProps {
    content: string
    onDiscard: () => void
    onSubmit: (text: string) => void
}

export const UserMessageEdit: React.FC<UserMessageEditProps> = ({ content, onDiscard, onSubmit }) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    // Reset height → measure scrollHeight → apply it
    const autoResize = (ta: HTMLTextAreaElement) => {
        ta.style.height = 'auto';
        ta.style.height = `${ta.scrollHeight}px`;
    };

    // submit the new message
    const handleSubmit = () => {
        if (textAreaRef.current != null){
            const newContent = textAreaRef.current.value
            onSubmit(newContent)
        }
    }

    return (
        <div>
            <div className="user-message-edit">
                <textarea ref={textAreaRef} id="user-message-entry" defaultValue={content} onInput={(e) => autoResize(e.currentTarget)} rows={1} />
            </div>
            <div style={{ display: 'flex', gap: '10px' , marginTop: "10px", marginRight: "10px", justifyContent: "flex-end"}}>
                <img
                    src={closeIcon}
                    alt="try again"
                    style={{ cursor: 'pointer', width: '1rem' }}
                    onClick={() => onDiscard()}
                />
                <img
                    src={sendIcon}
                    alt="Edit message"
                    style={{ cursor: 'pointer', width: '1rem' }}
                    onClick={() => handleSubmit()}
                />
            </div>
        </div>
    )
}

export const AssistantMessage: React.FC<Message> = ({ role, content }) => {
    return (
        <div className="assistant-message">
            <p>
                {content.split('\n').map((line, index) => (
                    <span key={index}>
                        {line}
                        <br />
                    </span>
                    )
                )} 
            </p>
        </div>
    )
}

interface ToolCallHeaderProps {
    displayString: string
    onToggle: () => void
    expanded: boolean
    toolCallComplete: boolean
}


export const ToolMessageHeader: React.FC<ToolCallHeaderProps> = ({ displayString, onToggle, expanded, toolCallComplete }) => {
    return (
        <div className="tool-message-header">
            <p>{displayString}</p>
            <div className="tool-message-header-icon-container">
                {!toolCallComplete && (
                    <img 
                        id="WorikingIndicator"
                        src={refreshIcon}
                        alt="tool call in progress"
                        style={{ width: '1rem', height: 'auto', display: 'inline-block'}}
                    />
                )}
                <img 
                    src={expanded ? arrowDown : arrowUp}
                    alt="expand/close Tool Call"
                    style={{ cursor: 'pointer', width: '1rem', height: 'auto', display: 'inline-block'}}
                    onClick={() => onToggle()}
                />
            </div>
        </div>
    )
}

interface ToolCallFooterProps {
    tool_arguments: null | Object
    tool_results: null | Object
}

export const ToolMessageFooter: React.FC<ToolCallFooterProps> = ({ tool_arguments, tool_results }) => {
    return (
        <div className="tool-message-details">
            <hr className="tool-message-details-hr" />

            <p>ToolCall Arguments:</p>
            <div className="tool-message_details_params">
            <pre>{JSON.stringify(tool_arguments, null, 4)}</pre>
            </div>

            <p>ToolCall Results: </p>
            <div className="tool-message_details_params">
            <pre>{JSON.stringify(tool_results, null, 4)}</pre>
            </div>
        </div>
    )
}

interface ErrorMessageProps {
    role: string
    content: string
    onRetry: () => void
    onDelete: () => void
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ role, content, onRetry, onDelete }) => {
    return (
        <div className="error-message">
            <p>{content}</p>

            <div>
                <img 
                    src={refreshIconError}
                    alt="resend the request"
                    style={{ cursor: 'pointer', width: '1rem', height: '1rem', display: 'inline-block', marginRight: "10px"}}
                    onClick={() => onRetry()}
                />
                <img 
                    src={deleteIconError}
                    alt="delete error"
                    style={{ cursor: 'pointer', width: '1rem', height: '1rem', display: 'inline-block'}}
                    onClick={() => onDelete()}
                />
            </div>
        </div>
    )
}