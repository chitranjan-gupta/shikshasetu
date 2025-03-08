'use client';

import { useState, type FC } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CalendarIcon } from 'lucide-react';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from './ui/form';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';

import { EditIcon } from './editicon';

import { normalizeText, cn } from '@/lib';

import type { FormSchemaType, FormValuesType } from '@/types';

interface DateInputProps {
  form: UseFormReturn<FormSchemaType>;
  property: FormValuesType;
  description: string;
}

export const DateInput: FC<DateInputProps> = ({
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
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[240px] pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                        type="button"
                      >
                        {field.value ? (
                          <span>
                            {field.value &&
                            !isNaN(Date.parse(field.value as string))
                              ? new Date(field.value as string).toDateString()
                              : 'Invalid date'}
                          </span>
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        field.value && !isNaN(Date.parse(field.value as string))
                          ? new Date(field.value as string)
                          : undefined
                      }
                      onSelect={(date) => {
                        if (date) field.onChange(date.toDateString());
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
