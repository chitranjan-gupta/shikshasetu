'use client';

import { memo, type FC } from 'react';
import Markdown from 'react-markdown';
import gfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import { Trash2, Clipboard, User, Bot } from 'lucide-react';

import type { Message } from '@/types';

interface ChatMessageProps {
  message: Message;
  handleDelete: (id: string) => void;
  isLoading: boolean;
  handleCopy: (text: string) => void;
}

const ChatMessageComponent: FC<ChatMessageProps> = ({
  message,
  handleDelete,
  isLoading,
  handleCopy,
}) => {
  return (
    <div
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 text-black`}
      >
        <div
          className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} text-sm`}
        >
          <div className="bg-gray-200 rounded-lg flex flex-row justify-center items-center w-8 h-8">
            {message.role === 'user' ? (
              <User className="w-5 h-5" />
            ) : (
              <Bot className="w-5 h-5" />
            )}
          </div>
          <Markdown
            remarkPlugins={[gfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
          >
            {message.content}
          </Markdown>
        </div>
        {!isLoading && (
          <div
            className={`flex flex-row ${message.role === 'user' ? 'items-end' : 'items-start'} gap-x-2`}
          >
            <button
              title="Delete"
              type="button"
              onClick={() => handleDelete(message.id)}
            >
              <Trash2 />
            </button>
            <button
              title="Delete"
              type="button"
              onClick={() => handleCopy(message.content)}
            >
              <Clipboard />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const ChatMessage = memo(ChatMessageComponent);
