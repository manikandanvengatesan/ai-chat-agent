import React, { useState, useEffect, useRef } from 'react';
import { useAIChat } from '../hooks/useAIChat';
import ChatBubble from './ChatBubble';
import ChatWindow from './ChatWindow';
import { ITheme, ICustomStyles, ITool, IIntentMatcherFunction, IToolExecutionFunction, IMessage } from '../types';
import '../styles/index.css';

interface AIFloatingChatProps {
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    aiProvider?: 'openai' | 'claude' | 'cohere';
    apiKey: string;
    modelName?: string;
    welcomeMessage?: string;
    theme?: ITheme;
    tools?: ITool[];
    intentMatcher?: IIntentMatcherFunction;
    avatar?: string | null;
    chatBubbleIcon?: string | null;
    chatHeader?: string;
    customStyles?: ICustomStyles;
}

const AIFloatingChat = (props: AIFloatingChatProps) => {
    // props
    const {
        position = 'bottom-right',
        aiProvider = 'openai',
        apiKey,
        modelName,
        tools = [],
        intentMatcher = null,
        welcomeMessage = 'Hey there! How can I help you today?',
        theme = {
            primaryColor: '#007bff',
            secondaryColor: '#f8f9fa',
            textColor: '#212529',
        },
        avatar = null,
        chatBubbleIcon = null,
        customStyles = {},
        chatHeader = 'AI Assistant',
    } = props;

    // state
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [messages, setMessages] = useState<IMessage[]>([{ role: 'assistant', content: welcomeMessage, timestamp: new Date() }]);

    // refs
    const chatWindowRef = useRef<HTMLDivElement | null>(null);

    // hooks
    const { sendMessage, error } = useAIChat({
        aiProvider,
        apiKey,
        modelName,
        tools,
    });

    // effects
    useEffect(() => {
        // Scroll to bottom on new messages
        if (chatWindowRef.current && isOpen) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    // handlers
    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleSendMessage = async (messageText: string) => {
        if (!messageText.trim()) return;

        // Add user message to chat
        const userMessage: IMessage = {
            role: 'user',
            content: messageText,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setIsTyping(true);

        try {
            // Check for tool intent match
            let toolMatch = null;
            if (intentMatcher && tools.length > 0) {
                toolMatch = await intentMatcher(messageText, tools);
            }

            if (toolMatch) {
                const tool = tools.find((t) => t.name === toolMatch.tool);

                if (!tool) {
                    throw new Error(`Tool '${toolMatch.tool}' not found`);
                }

                const toolResult = await tool.execute(toolMatch.params);

                setMessages((prev) => [
                    ...prev,
                    {
                        role: 'assistant',
                        content: toolResult || `I've processed your request using ${toolMatch.tool}`,
                        timestamp: new Date(),
                        tool: toolMatch.tool,
                    },
                ]);
            } else {
                // Regular AI response
                const response = await sendMessage(messageText, messages);

                setMessages((prev) => [
                    ...prev,
                    {
                        role: 'assistant',
                        content: response,
                        timestamp: new Date(),
                    },
                ]);
            }
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: "Sorry, I'm having trouble processing your request right now.",
                    timestamp: new Date(),
                    error: true,
                },
            ]);
            console.error('Error in chat:', err);
        } finally {
            setIsTyping(false);
        }
    };

    // Position classes
    const positionClass = `ai-floating-chat-${position}`;

    // paint
    return (
        <div
            className={`ai-floating-chat-container ${positionClass}`}
            style={
                {
                    ...customStyles.container,
                    '--primary-color': theme.primaryColor,
                    '--secondary-color': theme.secondaryColor,
                    '--text-color': theme.textColor,
                } as React.CSSProperties
            }
        >
            {isOpen ? (
                <ChatWindow
                    ref={chatWindowRef}
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    onClose={toggleChat}
                    isTyping={isTyping}
                    error={error}
                    customStyles={customStyles.chatWindow}
                    avatar={avatar}
                    chatHeader={chatHeader}
                />
            ) : (
                <ChatBubble
                    onClick={toggleChat}
                    customStyles={customStyles.chatBubble}
                    chatBubbleIcon={chatBubbleIcon}
                    unreadCount={isOpen ? 0 : messages.filter((m) => m.role === 'assistant' && !m.isRead).length}
                />
            )}
        </div>
    );
};

export default AIFloatingChat;
