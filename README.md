# AI Floating Chat Widget

A customizable floating chat widget for React applications that integrates with multiple AI providers (OpenAI, Claude, Cohere) and supports tool-based function calling.

## Features

- 💬 Floating chat widget that can be positioned at different corners of the viewport
- 🤖 Integration with multiple AI providers (OpenAI, Claude, Cohere)
- 🛠️ Support for tool-based function calling with custom callbacks
- 🎯 Intent matching system to map user queries to specific tools
- 🎨 Fully customizable theme and styling
- 📱 Responsive design for both desktop and mobile
- 🔔 Unread message notifications
- ⚙️ Easy-to-use API with sensible defaults

## Installation

```bash
npm install ai-floating-chat
# or
yarn add ai-floating-chat
```

## Basic Usage

```jsx
import React from 'react';
import { AIFloatingChat } from 'ai-floating-chat';
import 'ai-floating-chat/dist/index.css';

const App = () => {
    return (
        <div>
            <h1>My Application</h1>

            <AIFloatingChat aiProvider="openai" apiKey="your-api-key-here" welcomeMessage="Hi there! How can I help you today?" />
        </div>
    );
};
```

## Advanced Usage with Tools

The following example demonstrates how to use the chat widget with custom tools and intent matching:

```jsx
import React from 'react';
import { AIFloatingChat } from 'ai-floating-chat';
import 'ai-floating-chat/dist/index.css';

const App = () => {
    // Define your tools
    const tools = [
        {
            name: 'search_products',
            description: 'Search for products in the catalog',
            parameters: {
                type: 'object',
                properties: {
                    query: {
                        type: 'string',
                        description: 'Search query for products',
                    },
                    category: {
                        type: 'string',
                        description: 'Optional category to filter by',
                    },
                },
                required: ['query'],
            },
        },
        // Add more tools as needed
    ];

    // Intent matcher function
    const matchIntent = async (message, tools) => {
        // Your logic to match user message to tool intents
        if (message.toLowerCase().includes('find') || message.toLowerCase().includes('search')) {
            return {
                tool: 'search_products',
                params: {
                    query: message.split('for ')[1] || 'product',
                    category: message.includes('electronics') ? 'electronics' : null,
                },
            };
        }
        return null; // No intent match
    };

    // Tool execution handler
    const handleToolExecution = async (toolName, params) => {
        // Handle different tools
        if (toolName === 'search_products') {
            // Call your actual API here
            return `Found 3 products matching "${params.query}"`;
        }
        return null;
    };

    return (
        <div>
            <h1>My E-commerce App</h1>

            <AIFloatingChat
                aiProvider="claude"
                apiKey="your-claude-api-key"
                modelName="claude-3-opus-20240229"
                welcomeMessage="Hello! I'm your shopping assistant. How can I help?"
                position="bottom-right"
                theme={{
                    primaryColor: '#6366f1',
                    secondaryColor: '#f3f4f6',
                    textColor: '#111827',
                }}
                tools={tools}
                intentMatcher={matchIntent}
                onToolExecution={handleToolExecution}
            />
        </div>
    );
};
```

## Props Reference

| Prop              | Type     | Default                                  | Description                                                                          |
| ----------------- | -------- | ---------------------------------------- | ------------------------------------------------------------------------------------ |
| `aiProvider`      | string   | `'openai'`                               | The AI provider to use ('openai', 'claude', or 'cohere')                             |
| `apiKey`          | string   | -                                        | Your API key for the selected provider                                               |
| `modelName`       | string   | Provider-specific default                | Model name for the provider (e.g., 'gpt-4', 'claude-3-opus-20240229')                |
| `welcomeMessage`  | string   | `'Hey there! How can I help you today?'` | Initial message displayed in the chat                                                |
| `position`        | string   | `'bottom-right'`                         | Position of the chat widget ('bottom-right', 'bottom-left', 'top-right', 'top-left') |
| `theme`           | object   | See below                                | Theme customization object                                                           |
| `tools`           | array    | `[]`                                     | Array of tool objects for function calling                                           |
| `intentMatcher`   | function | `null`                                   | Function to match user input to tool intents                                         |
| `onToolExecution` | function | `() => {}`                               | Function called when a tool should be executed                                       |
| `avatar`          | string   | `null`                                   | URL to the avatar image for the assistant                                            |
| `chatBubbleIcon`  | string   | `null`                                   | URL to the chat icon for the widget                                                  |
| `customStyles`    | object   | `{}`                                     | Custom styles for various components                                                 |

### Default Theme

```js
{
  primaryColor: '#007bff',
  secondaryColor: '#f8f9fa',
  textColor: '#212529'
}
```

### Custom Styles

You can customize specific components with the `customStyles` prop:

```js
{
  container: {
    // Styles for the main container
  },
  chatBubble: {
    // Styles for the chat bubble button
  },
  chatWindow: {
    // Styles for the chat window
  }
}
```

## Tool Format

Each tool should follow this format:

```js
{
  name: 'tool_name',
  description: 'Description of what the tool does',
  parameters: {
    type: 'object',
    properties: {
      // Define parameters here
      paramName: {
        type: 'string', // or number, boolean, etc.
        description: 'Description of the parameter'
      }
    },
    required: ['requiredParam1', 'requiredParam2']
  }
}
```

## Intent Matcher Function

The intent matcher function should have this signature:

```js
async function intentMatcher(message, tools) {
    // Analyze the message and determine if it matches a tool intent
    // Return null if no match, or an object with tool and params if matched:
    return {
        tool: 'tool_name',
        params: {
            // Parameter values for the tool
        },
    };
}
```

## Tool Execution Function

The tool execution function should have this signature:

```js
async function onToolExecution(toolName, params) {
    // Execute the tool with the given parameters
    // Return a string response or null
    return 'Result of tool execution';
}
```

## Provider-Specific Notes

### OpenAI

- Default model: 'gpt-4'
- Requires an OpenAI API key

### Claude (Anthropic)

- Default model: 'claude-3-opus-20240229'
- Requires a Claude API key

### Cohere

- Default model: 'command'
- Requires a Cohere API key

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License.

## Contact

For any questions or support, please open an issue on the GitHub repository or contact the maintainer.

## Acknowledgments

- Thanks to [Thayalan](https://github.com/ThayalanGR) for suggesting this approach.

## Changelog

- **v1.0.7**: Initial release with basic functionality.
