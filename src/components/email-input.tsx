'use client';

import { useState, type FC } from 'react';
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

import type { FormSchemaType, FormValuesType } from '@/types';

interface EmailInputProps {
  form: UseFormReturn<FormSchemaType>;
  property: FormValuesType;
  description: string;
}

export const EmailInput: FC<EmailInputProps> = ({
  form,
  property,
  description,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  return (
    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <dt className="text-sm/6 font-medium text-gray-900">
        {normalizeText(String(property.value))}
      </dt>
      <dd className="p-2 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 flex flex-row justify-start items-center gap-x-5">
        {!isEditing ? (
          <>{form.getValues(property.value as keyof FormSchemaType)}</>
        ) : (
          <FormField
            control={form.control}
            name={property.value as keyof FormSchemaType}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="email"
                    placeholder=""
                    {...field}
                    value={String(field.value)}
                  />
                </FormControl>
                <FormDescription>{description}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button onClick={() => setIsEditing((prev) => !prev)} type="button">
          <EditIcon state={isEditing} />
        </Button>
      </dd>
    </div>
  );
};
