'use client';

import { Fragment, type FC } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z, type ZodObject, type ZodRawShape } from 'zod';

import { renderInput } from './render-input';

import { normalizeText } from '@/lib';
import { FormSchema } from '@/constants';

import type { FormSchemaType, FormValuesType } from '@/types';

interface ObjectInputProps {
  form: UseFormReturn<FormSchemaType>;
  property: FormValuesType;
  description: string;
}

const getHTMLInputType = (fieldName: string) => {
  switch (fieldName) {
    case 'currency':
    case 'salary_period':
    case 'country_code':
      return 'select';
    case 'size':
    case 'salary':
      return 'number';
    case 'phone_number':
      return 'tel';
    case 'file':
      return 'file';
    case 'url':
      return 'document';
    case 'currently_studying_here':
    case 'currently_working_here':
      return 'checkbox';
    case 'date_of_joining':
    case 'date_of_relieving':
    case 'start_of_course':
    case 'end_of_course':
      return 'date';
    default:
      return 'text';
  }
};

export const ObjectInput: FC<ObjectInputProps> = ({
  form,
  property,
  description,
}) => {
  const object = property.value.match(/\.\d+$/)
    ? property.value.split(/\.\d+$/)[0]
    : property.value;
  const type = FormSchema.shape[object as keyof FormSchemaType]._def.innerType;
  const detail = (
    FormSchema.shape[object as keyof FormSchemaType]._def
      .innerType as ZodObject<ZodRawShape>
  ).shape;
  const propertyDetail =
    type instanceof z.ZodArray
      ? type._def.type instanceof z.ZodObject
        ? type._def.type.shape
        : detail
      : detail;
  return (
    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <div className="text-sm/6 font-medium text-gray-900">
        {normalizeText(String(property.value))}
      </div>
      <div className="p-2 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 flex flex-row justify-start items-center gap-x-5">
        {typeof propertyDetail === 'object' ? (
          <div className="flex flex-row flex-wrap">
            {Object.entries(propertyDetail).map(([key]) => {
              const field = {
                value: `${property.value}.${key}`,
                type: getHTMLInputType(key),
              };
              return <Fragment key={key}>{renderInput(form, field)}</Fragment>;
            })}
          </div>
        ) : (
          <>{description}</>
        )}
      </div>
    </div>
  );
};
