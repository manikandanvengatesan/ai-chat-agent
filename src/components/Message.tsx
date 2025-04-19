import React from 'react';
import { formatRelativeTime } from '../utils/dateUtils';
import ReactMarkdown from 'react-markdown';
import { IMessage as MessageType } from '../types';

interface IMessageProps {
    message: MessageType;
    avatar: string | null;
}

const Message = (props: IMessageProps) => {
    // props
    const { avatar, message } = props;
    const { role, content, timestamp, tool, error } = message;

    const messageClass = `ai-chat-message ${role} ${tool ? 'tool' : ''} ${error ? 'error' : ''}`;

    // paint
    return (
        <div className={messageClass}>
            {role === 'assistant' && avatar && <img src={avatar} alt="AI" className="ai-chat-avatar" />}

            <div className="ai-chat-bubble">
                <ReactMarkdown
                    components={{
                        p: ({ ...props }) => <p className="ai-chat-content" {...props} />,
                    }}
                >
                    {content}
                </ReactMarkdown>

                {tool && <div className="ai-chat-tool-badge">{tool}</div>}

                <div className="ai-chat-timestamp">{formatRelativeTime(timestamp)}</div>
            </div>
        </div>
    );
};

export default Message;
