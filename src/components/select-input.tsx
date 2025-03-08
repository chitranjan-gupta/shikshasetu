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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Button } from './ui/button';

import { EditIcon } from './editicon';

import { normalizeText } from '@/lib';

import type { FormSchemaType, FormValuesType } from '@/types';

interface SelectInputProps {
  form: UseFormReturn<FormSchemaType>;
  property: FormValuesType;
  description: string;
  options: { value: string; label: string }[];
}

export const SelectInput: FC<SelectInputProps> = ({
  form,
  property,
  description,
  options,
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
                  <Select
                    value={String(field.value)}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
