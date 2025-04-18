export interface ITheme {
    primaryColor: string;
    secondaryColor: string;
    textColor: string;
}

export interface ICustomStyles {
    container?: React.CSSProperties;
    chatBubble?: React.CSSProperties;
    chatWindow?: React.CSSProperties;
}

export interface IToolParameter {
    type: string;
    description: string;
    enum?: string[];
}

export interface IToolParameters {
    type: string;
    properties: Record<string, IToolParameter>;
    required?: string[];
}

export interface ITool {
    name: string;
    description: string;
    parameters: IToolParameters;
}

export interface IToolMatch {
    tool: string;
    params: Record<string, any>;
}

export type IIntentMatcherFunction = (message: string, tools: ITool[]) => Promise<IToolMatch | null>;

export type IToolExecutionFunction = (toolName: string, params: Record<string, any>) => Promise<string | null>;

export interface IMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    tool?: string;
    error?: boolean;
    isRead?: boolean;
}

export interface IAIProviderProps {
    aiProvider: 'openai' | 'claude' | 'cohere';
    apiKey: string;
    modelName?: string;
    tools?: ITool[];
}

export interface ISendMessageOptions {
    message: string;
    conversationHistory: IMessage[];
    apiKey: string;
    modelName?: string;
    tools?: ITool[];
}

export interface AIProviderInstance {
    sendMessage: (options: ISendMessageOptions) => Promise<string>;
}
