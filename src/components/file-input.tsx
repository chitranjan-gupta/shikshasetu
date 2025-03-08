'use client';

import { useState, type FC } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Paperclip } from 'lucide-react';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from './ui/form';
import { Button } from './ui/button';
import { Input } from './ui/input';

import { EditIcon } from './editicon';

import { normalizeText } from '@/lib';

import type { FormSchemaType, FormValuesType } from '@/types';

const createDownloadLink = (file: File) => {
  const a = document.querySelector<HTMLAnchorElement>('#download-document');
  if (a && file) {
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  }
};

interface FileInputProps {
  form: UseFormReturn<FormSchemaType>;
  property: FormValuesType;
  description: string;
}

export const FileInput: FC<FileInputProps> = ({
  form,
  property,
  description,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const fileRef = form.register(property.value as keyof FormSchemaType);
  const fileArray = Array.from(
    form.getValues(
      property.value as keyof FormSchemaType
    ) as unknown as FileList
  );
  return (
    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <dt
        className={`${fileArray.length > 0 && !isEditing ? 'hidden' : ''} text-sm/6 font-medium text-gray-900`}
      >
        {normalizeText(String(property.value))}
      </dt>
      <dd
        className={`${fileArray.length > 0 ? '!w-full' : ''} p-2 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 flex flex-row justify-start items-center gap-x-5`}
      >
        {!isEditing ? (
          <>
            {fileArray.length > 0 ? (
              <ul
                role="list"
                className="w-full divide-y divide-gray-100 rounded-md border border-gray-200"
              >
                {fileArray.map((file: File) => (
                  <li
                    key={file.name}
                    className="flex items-center justify-between py-4 pl-4 pr-5 text-sm/6"
                  >
                    <div className="flex w-0 flex-1 items-center">
                      <Paperclip
                        aria-hidden="true"
                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                      />
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">
                          {file.name}
                        </span>
                        <span className="flex-shrink-0 text-gray-400">
                          {file.size} bytes
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <button
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                        onClick={() => createDownloadLink(file)}
                      >
                        Download
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <></>
            )}
          </>
        ) : (
          <FormField
            control={form.control}
            name={property.value as keyof FormSchemaType}
            render={() => (
              <FormItem>
                <FormControl>
                  <Input type="file" placeholder="" {...fileRef} />
                </FormControl>
                <FormDescription>{description}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <a id="download-document" className="sr-only"></a>
        <Button onClick={() => setIsEditing((prev) => !prev)} type="button">
          <EditIcon state={isEditing} />
        </Button>
      </dd>
    </div>
  );
};
