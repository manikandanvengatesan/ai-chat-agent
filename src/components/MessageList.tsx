import React, { forwardRef } from 'react';
import Message from './Message';
import { IMessage } from '../types';

interface IMessageListProps {
    messages: IMessage[];
    isTyping: boolean;
    avatar: string | null;
}

const MessageList = forwardRef<HTMLDivElement, IMessageListProps>((props, ref) => {
    // props
    const { messages, isTyping, avatar } = props;

    // paint
    return (
        <div className="ai-chat-messages" ref={ref}>
            {messages.map((message, index) => (
                <Message key={index} message={message} avatar={message.role === 'assistant' ? avatar : null} />
            ))}

            {isTyping && (
                <div className="ai-chat-message assistant">
                    {avatar && <img src={avatar} alt="AI" className="ai-chat-avatar" />}
                    <div className="ai-chat-bubble typing">
                        <span className="ai-typing-indicator">
                            <span className="ai-typing-dot"></span>
                            <span className="ai-typing-dot"></span>
                            <span className="ai-typing-dot"></span>
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
});

export default MessageList;
