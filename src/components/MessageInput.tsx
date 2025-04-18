import React, { useState } from 'react';

interface IMessageInputProps {
    onSendMessage: (message: string) => void;
    disabled: boolean;
}

const MessageInput = (props: IMessageInputProps) => {
    // props
    const { onSendMessage, disabled } = props;

    // state
    const [message, setMessage] = useState('');

    // handlers
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && !disabled) {
            onSendMessage(message);
            setMessage('');
        }
    };

    // paint
    return (
        <form className="ai-chat-input-container" onSubmit={handleSubmit}>
            <input
                type="text"
                className="ai-chat-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={disabled}
            />
            <button type="submit" className="ai-chat-send-btn" disabled={!message.trim() || disabled}>
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
            </button>
        </form>
    );
};

export default MessageInput;
