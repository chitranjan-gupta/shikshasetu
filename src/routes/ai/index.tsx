import { useRef, useEffect, useCallback, useState, type FC } from 'react';
import { useChat } from 'ai/react';
import { observer } from '@legendapp/state/react';
import { RefreshCw, Pause } from 'lucide-react';

import { ChatMessage, ChatInput, Spinner } from '@/components';

import { messages$ } from '@/store';
import { handleCopy } from '@/lib';

const AIChat: FC = () => {
  const savedMessages = messages$.get().messages;
  const [currentChat, setCurrentChat] = useState<number>(0);
  const initialMessages = (
    currentChat < savedMessages.length ? (savedMessages[currentChat] ?? []) : []
  ) as {
    id: string;
    content: string;
    role: 'data' | 'user' | 'system' | 'assistant';
  }[];
  const [modelName, setModelName] = useState<string>('qwen2.5:1.5b');
  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    reload,
    stop,
  } = useChat({
    api: 'https://3000-chitranjangupta-ai-ud72755xdj3.ws-us117.gitpod.io/api/chat',
    initialMessages,
    streamProtocol: 'text',
    sendExtraMessageFields: true,
    body: {
      modelName: modelName,
    },
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      setMessages(messages.filter((message) => message.id !== id));
    },
    [setMessages, messages]
  );

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (!isLoading) {
      messages$.saveMessages(currentChat, messages);
    }
  }, [messages, currentChat, isLoading]);

  return (
    <div className="flex flex-col w-full min-w-[400px] min-h-[600px] h-screen">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            handleDelete={handleDelete}
            isLoading={isLoading}
            handleCopy={handleCopy}
          />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex flex-row items-center gap-x-2 bg-blue-600 text-white dark:bg-gray-800 dark:text-gray-100 rounded-lg p-3 text-sm">
              <span>AI is thinking... </span>
              <Spinner />
              <button type="button" title="Stop" onClick={() => stop()}>
                <Pause />
              </button>
            </div>
          </div>
        )}
        {error && (
          <div className="flex flex-row items-center gap-x-2">
            <span>An error occurred.</span>
            <button title="Reload" type="button" onClick={() => reload()}>
              <RefreshCw />
            </button>
          </div>
        )}
        <div ref={messagesEndRef} />
        <textarea ref={textareaRef} className="sr-only w-0 h-0"></textarea>
      </div>
      <div className="p-2">
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          currentChat={currentChat}
          setCurrentChat={setCurrentChat}
          totalChats={savedMessages.length}
          modelName={modelName}
          setModelName={setModelName}
          error={error}
        />
      </div>
    </div>
  );
};

const AiChat = observer(AIChat);

export default AiChat;
