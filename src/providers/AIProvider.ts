import { AIProviderInstance, ISendMessageOptions, IMessage } from '../types';

interface IProviders {
    [key: string]: AIProviderInstance;
}

const providers: IProviders = {
    openai: {
        sendMessage: async ({ message, conversationHistory, apiKey, modelName = 'gpt-4', tools }: ISendMessageOptions): Promise<string> => {
            const history = conversationHistory.map((msg) => ({
                role: msg.role,
                content: msg.content,
            }));

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: modelName,
                    messages: [...history, { role: 'user', content: message }],
                    tools: tools?.map((tool) => ({
                        type: 'function',
                        function: {
                            name: tool.name,
                            description: tool.description,
                            parameters: tool.parameters,
                        },
                    })),
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'OpenAI API error');
            }

            const data = await response.json();
            return data.choices[0].message.content;
        },
    },

    claude: {
        sendMessage: async ({
            message,
            conversationHistory,
            apiKey,
            modelName = 'claude-3-opus-20240229',
            tools,
        }: ISendMessageOptions): Promise<string> => {
            const history = conversationHistory.map((msg) => ({
                role: msg.role,
                content: msg.content,
            }));

            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                },
                body: JSON.stringify({
                    model: modelName,
                    messages: [...history, { role: 'user', content: message }],
                    tools: tools,
                    max_tokens: 1000,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'Claude API error');
            }

            const data = await response.json();
            return data.content[0].text;
        },
    },

    cohere: {
        sendMessage: async ({ message, conversationHistory, apiKey, modelName = 'command', tools }: ISendMessageOptions): Promise<string> => {
            const history = conversationHistory.map((msg) => ({
                role: msg.role === 'assistant' ? 'CHATBOT' : 'USER',
                message: msg.content,
            }));

            const response = await fetch('https://api.cohere.ai/v1/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: modelName,
                    chat_history: history,
                    message: message,
                    tools: tools,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Cohere API error');
            }

            const data = await response.json();
            return data.text;
        },
    },
};

export const getAIProvider = (providerName: string): AIProviderInstance => {
    return providers[providerName.toLowerCase()];
};

export const AIProvider = { providers };
