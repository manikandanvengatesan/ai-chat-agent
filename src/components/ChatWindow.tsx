import React, { forwardRef } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { IMessage } from '../types';

interface IChatWindowProps {
    messages: IMessage[];
    onSendMessage: (message: string) => void;
    onClose: () => void;
    isTyping: boolean;
    error: string | null;
    customStyles?: React.CSSProperties;
    avatar: string | null;
    chatHeader?: string;
}

const ChatWindow = forwardRef<HTMLDivElement, IChatWindowProps>((props, ref) => {
    // props
    const { messages, onSendMessage, onClose, isTyping, customStyles = {}, avatar, chatHeader = 'AI Assistant' } = props;

    // paint
    return (
        <div className="ai-chat-window" style={customStyles}>
            <div className="ai-chat-header">
                <div className="ai-chat-title">
                    {avatar && <img src={avatar} alt="Chat avatar" className="ai-chat-avatar-small" />}
                    <span>{chatHeader}</span>
                </div>
                <button className="ai-chat-close-btn" onClick={onClose}>
                    ×
                </button>
            </div>

            <MessageList messages={messages} isTyping={isTyping} ref={ref} avatar={avatar} />

            <MessageInput onSendMessage={onSendMessage} disabled={isTyping} />
        </div>
    );
});

export default ChatWindow;
