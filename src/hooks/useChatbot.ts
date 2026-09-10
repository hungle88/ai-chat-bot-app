import axios from 'axios';
import { useState } from 'react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

export const useChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const sendMessage = async (message: string) => {
    const userMessage: Message = { text: message, sender: 'user' };
    setMessages((currentMessages) => [...currentMessages, userMessage]);

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: message,
            },
          ],
          store: true,
        },
        {
          headers: {
            Authorization: `Bearer Token`,
            'Content-Type': 'application/json',
          },
        },
      );
      const botMessage = response.data.choices[0].message.content;
      setMessages((currentMessages) => [
        ...currentMessages,
        { text: botMessage, sender: 'bot' },
      ]);
    } catch (error) {
      console.error('Error fetching AI response: ', error);
      const errorMessage =
        axios.isAxiosError(error) && error.response?.status === 429
          ? 'The service is currently rate-limited. Please try again shortly.'
          : 'Unable to get a response right now. Please try again.';

      setMessages((currentMessages) => [
        ...currentMessages,
        { text: errorMessage, sender: 'bot' },
      ]);
    }
  };

  return { messages, sendMessage };
};
