import { useState, useCallback } from 'react';
import { getAIProvider } from '../providers/AIProvider';
import { IAIProviderProps, IMessage } from '../types';

interface IAIChatResult {
    sendMessage: (message: string, conversationHistory: IMessage[]) => Promise<string>;
    isLoading: boolean;
    error: string | null;
}

export const useAIChat = (props: IAIProviderProps): IAIChatResult => {
    // props
    const { aiProvider, apiKey, modelName, tools = [] } = props;

    // state
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // callbacks
    const sendMessage = useCallback(
        async (message: string, conversationHistory: IMessage[]): Promise<string> => {
            setIsLoading(true);
            setError(null);

            try {
                const provider = getAIProvider(aiProvider);
                if (!provider) {
                    throw new Error(`AI provider '${aiProvider}' not supported`);
                }

                const response = await provider.sendMessage({
                    message,
                    conversationHistory,
                    apiKey,
                    modelName,
                    tools,
                });

                return response;
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'An error occurred';
                setError(errorMessage);
                console.error('Chat error:', err);
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        [aiProvider, apiKey, modelName, tools],
    );

    return {
        sendMessage,
        isLoading,
        error,
    };
};
