'use client';

import {
  memo,
  useRef,
  type FormEvent,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  type FC,
} from 'react';
import { SendHorizontal, ListPlus, FilePlus2, CirclePlus } from 'lucide-react';
import { uploadPdfs } from '@/api';

interface ChatInputProps {
  input: string;
  handleInputChange: (input: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent) => void;
  currentChat: number;
  setCurrentChat: Dispatch<SetStateAction<number>>;
  totalChats: number;
  error: Error | undefined;
  modelName: string;
  setModelName: Dispatch<SetStateAction<string>>;
}

const onFilesChange = async (event: any) => {
  console.log('Chnage');
  const files = event.target.files;
  if (files.length === 1) {
    const res = await uploadPdfs(
      'https://3000-chitranjangupta-ai-ud72755xdj3.ws-us117.gitpod.io/api/upload',
      files
    );
    console.log(res);
  } else {
    console.log('File is not selected');
  }
};

const onFileClick = (ref: any) => {
  ref.current?.click();
};

const ChatInputComponent: FC<ChatInputProps> = ({
  input,
  handleInputChange,
  handleSubmit,
  currentChat,
  setCurrentChat,
  totalChats,
  error,
  modelName,
  setModelName,
}) => {
  const fileRef = useRef(null);
  return (
    <>
      <input
        ref={fileRef}
        className="sr-only"
        type="file"
        onChange={onFilesChange}
      />
      <div className="w-full flex flex-row items-center justify-center">
        <label htmlFor="dialog-text">Url:</label>
        <input
          id="dialog-text"
          type="text"
          className="outline-none rounded-md"
        />
      </div>
      <form
        onSubmit={handleSubmit}
        className="p-4 border border-gray-200 rounded-xl w-full"
      >
        <div className="flex flex-row flex-wrap justify-start items-center gap-x-2 mb-2">
          <button
            type="button"
            className="flex flex-row rounded-md p-1 gap-x-1"
          >
            <ListPlus />
            Add System
          </button>
          <button
            onClick={() => onFileClick(fileRef)}
            type="button"
            className="flex flex-row rounded-md p-1 gap-x-1"
          >
            <FilePlus2 />
            PDF
          </button>
          <button
            type="button"
            className="flex flex-row rounded-md p-1 gap-x-1"
          >
            <CirclePlus />
            Web
          </button>
          <select
            className="border-none outline-none h-6 rounded-md p-0 pr-7"
            value={String(currentChat)}
            onChange={(event) => setCurrentChat(Number(event.target.value))}
          >
            {Array.from({ length: totalChats }, (_, index) => index + 0).map(
              (v) => {
                return (
                  <option
                    key={String(v)}
                    value={String(v)}
                  >{`Chat Id ${v}`}</option>
                );
              }
            )}
            <option key={totalChats} value={totalChats}>
              New Chat
            </option>
          </select>
        </div>
        <div className="flex space-x-4">
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Enter your prompt for the AI"
            className="flex-1 p-2 bg-white dark:bg-gray-700 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={error != null}
          />
        </div>
        <div className="flex flex-row flex-wrap justify-between items-center px-2 -mt-10">
          <div className="flex flex-row flex-wrap items-center justify-center gap-x-2">
            <select
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="border-none outline-none h-6 rounded-md p-0 pr-7"
            >
              <option value="llama3.2:3b">😊 llama3.2:3b</option>
              <option value="mistral:7b">😊 mistral:7b</option>
              <option value="qwen2.5:1.5b">😊 qwen2.5:1.5b</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
          >
            <SendHorizontal />
          </button>
        </div>
      </form>
    </>
  );
};

export const ChatInput = memo(ChatInputComponent);
