import React from 'react';

interface IChatBubbleProps {
    onClick: () => void;
    customStyles?: React.CSSProperties;
    chatBubbleIcon: string | null;
    unreadCount: number;
}

const ChatBubble = (props: IChatBubbleProps) => {
    // props
    const { onClick, customStyles = {}, chatBubbleIcon, unreadCount = 0 } = props;

    // paint
    return (
        <div className="ai-chat-bubble-container" onClick={onClick} style={customStyles}>
            <div className="ai-chat-bubble-button">
                {chatBubbleIcon ? (
                    <img src={chatBubbleIcon} alt="Chat" className="ai-chat-avatar-bubble" />
                ) : (
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                )}
            </div>

            {unreadCount > 0 && <div className="ai-chat-notification">{unreadCount}</div>}
        </div>
    );
};

export default ChatBubble;
