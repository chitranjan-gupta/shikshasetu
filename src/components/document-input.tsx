'use client';

import { useState, type ChangeEvent, type FC } from 'react';
import { UseFormReturn } from 'react-hook-form';

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
import { useS3 } from '@/hooks';

import type { FormSchemaType, FormValuesType } from '@/types';

interface FileInputProps {
  form: UseFormReturn<FormSchemaType>;
  property: FormValuesType;
  description: string;
}

export const DocumentInput: FC<FileInputProps> = ({
  form,
  property,
  description,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { addBucket } = useS3();
  // const workerRef = useRef<Worker>(null);
  const inputValue = String(
    form.getValues(property.value as keyof FormSchemaType)
  );
  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) {
      return;
    }
    const file = files.length > 0 ? files[0] : null;
    if (file) {
      // s3$.addBucket(file);
      const url = `indexeddb://${file.name}`;
      addBucket(property.value, {
        name: property.value,
        value: url,
        file: file,
      });
      form.setValue(property.value as keyof FormSchemaType, url, {
        shouldValidate: true,
      });
      // if (chrome && chrome.runtime) {
      // } else {
      //   if(window.Worker){
      //     if(!workerRef.current){
      //       workerRef.current = new Worker(new URL("../lib/worker", import.meta.url), { type: 'module' })
      //     }
      //     workerRef.current.postMessage(["save", file]);
      //     form.setValue(property.value, `opfs://${file.name}`, { shouldValidate: true });
      //   }
      // }
    }
  }
  return (
    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <dt className={`text-sm/6 font-medium text-gray-900`}>
        {normalizeText(String(property.value))}
      </dt>
      <dd
        className={`p-2 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 flex flex-row justify-start items-center gap-x-5`}
      >
        {!isEditing ? (
          <>
            {inputValue && inputValue.length > 0 && <span>{inputValue}</span>}
          </>
        ) : (
          <div className="flex flex-col">
            <Input type="file" onChange={handleUpload} />
            <u>OR</u>
            <FormField
              control={form.control}
              name={property.value as keyof FormSchemaType}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter the url"
                      {...field}
                      value={String(field.value)}
                    />
                  </FormControl>
                  <FormDescription>{description}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        <Button onClick={() => setIsEditing((prev) => !prev)} type="button">
          <EditIcon state={isEditing} />
        </Button>
      </dd>
    </div>
  );
};
